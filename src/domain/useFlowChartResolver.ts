import { MarkerType, type Edge, type Node } from "@xyflow/react";
import type {
  CustomNodeData,
  CutsData,
  Execution,
  Position,
  SeparatorNodeData,
  SeparatorType,
  TransportData,
} from "./types";
import { getExecutionData } from "./executionData";
import useWholeChartPosition from "./stores/useWholeChartPosition";

// const tempPrcId = 53558;
const tempPrcId = 53911;
const tempToken =
  "2a8b42d3c757b6fd0be1f19ad6473fa5f5917cffa604f4b67532f9130f27eb61";

export const useFlowChartResolver = () => {
  //hooks
  const { setPosition } = useWholeChartPosition();

  async function resolveJsonData(): Promise<[nodes: Node[], edges: Edge[]]> {
    //fetch
    const executionData: Execution[] = await getExecutionData(
      tempPrcId,
      tempToken
    );

    //state
    const allNodes: Node<CustomNodeData>[] = [];
    const allEdges: Edge[] = [];
    const currentPosition: Position = {
      currentX: 0,
      currentY: 0,
    };

    //create all transportation nodes, edges and separators
    createTransport({ allNodes, allEdges, currentPosition, executionData });

    //update global state with position of whole graph
    setPosition(currentPosition);

    //cuts section
    createCuts({ allNodes });

    return [allNodes, allEdges];
  }

  function createCuts(data: CutsData) {
    const { allNodes } = data;

    addMainHorizontalSeparatorNode(allNodes);
  }

  function addMainHorizontalSeparatorNode(allNodes: Node<CustomNodeData>[]) {
    console.log({ allNodes });

    allNodes.push({
      id: "separator_cuts_main",
      position: {
        x: 185,
        y: 210,
      },
      data: {
        currentAmount: 0,
        eventDate: null,
        localizationLabel: "Cięcie",
        movedAmount: 0,
        movedFrom: null,
        movedTo: "",
        nextDistinctiveDate: null,
      },
      type: "mainHorizontalSeparator",
    });
  }
  function createTransport(data: TransportData) {
    const { allNodes, allEdges, currentPosition, executionData } = data;

    const currentNodes: Node<CustomNodeData>[] = [];
    const previousNodes: Node<CustomNodeData>[] = [];

    //initial node with "siewnik"
    currentPosition.currentX = 100;
    currentPosition.currentY = 50;
    addInitialNodeWith__Siewnik(
      allNodes,
      currentNodes,
      currentPosition,
      executionData
    );

    // for (let i = 0; i < executionData.length; i++) {
    for (let i = 0; i < 2; i++) {
      const currentItem = executionData[i];
      copyNodesToPreserveLastState(currentNodes, previousNodes);
      generateCurrentNodes(
        currentItem,
        currentNodes,
        previousNodes,
        currentPosition,
        i
      );
      renderNodes(allNodes, currentNodes);
      renderEdges(allEdges, previousNodes, currentNodes, currentItem);
      addInformationNode(allNodes, currentPosition, currentItem, i);
      addSeparatorNode({
        allNodes,
        currentPosition,
        currentItem,
        index: i,
        executionData,
      });
    }
  }
  function addInformationNode(
    allNodes: Node<CustomNodeData>[],
    currentPosition: Position,
    currentItem: Execution,
    index: number
  ) {
    const isNewMainSeparator = checkIfIsNewMainSeparator(allNodes, currentItem);
    if (!isNewMainSeparator) return;

    allNodes.push({
      id: `info____${index + 1}`,
      position: {
        x: currentPosition.currentX - 25,
        y: currentPosition.currentY + 140,
      },
      data: {
        localizationLabel: "info",
        movedFrom: "",
        movedTo: "",
        eventDate: null,
        movedAmount: 0,
        currentAmount: 0,
        nextDistinctiveDate: null,
      },
      type: "nodeEventsInfo",
    });
  }
  function renderEdges(
    allEdges: Edge[],
    previousNodes: Node<CustomNodeData>[],
    currentNodes: Node<CustomNodeData>[],
    currentItem: Execution
  ) {
    const previousNodesCopy = [...previousNodes];
    const currentNodesCopy = [...currentNodes];

    //handle current move
    const from = currentItem.name_from;
    const to = currentItem.name_to;

    const indexOfFrom = previousNodesCopy.findIndex((node) =>
      node.id.startsWith(from)
    );
    const indexOfTo = currentNodesCopy.findIndex((node) =>
      node.id.startsWith(to)
    );

    if (indexOfFrom === -1 || indexOfTo === -1) {
      // debugger;
      throw new Error("renderEdger -> Index not found");
    }

    const fromNode = previousNodesCopy[indexOfFrom];
    const toNode = currentNodesCopy[indexOfTo];
    previousNodesCopy.splice(indexOfFrom, 1);
    currentNodesCopy.splice(indexOfTo, 1);

    allEdges.push(
      setArrow(`${fromNode.id}->${toNode.id}`, fromNode.id, toNode.id)
    );
  }
  function setArrow(id: string, name_from: string, name_to: string): Edge {
    return {
      id: id,
      source: name_from,
      target: name_to,
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 12,
        height: 8,
        color: "#3870B5",
      },
      style: {
        strokeWidth: 1.5,
        stroke: "#3870B5",
      },
    };
  }
  function generateCurrentNodes(
    currentItem: Execution,
    currentNodes: Node<CustomNodeData>[],
    previousNodes: Node<CustomNodeData>[],
    currentPosition: Position,
    index: number
  ) {
    currentNodes.length = 0;
    currentPosition.currentX += 200;

    addCurrentMoveToCurrentNodes(
      currentItem,
      index,
      previousNodes,
      currentNodes,
      currentPosition
    );

    for (let i = 0; i < previousNodes.length; i++) {
      const prev = previousNodes[i];
      const prevIdPrefix = prev.id.split("_")[0];

      //if that is current move
      if (currentItem.name_from === prevIdPrefix) {
        const currentAmountAfterMove =
          prev.data.currentAmount - currentItem.movqty;

        if (currentAmountAfterMove > 0) {
          //is not empty -> move to current nodes
          const newId = `${prevIdPrefix}_${index + 1}`;
          currentNodes.push({
            id: newId,
            position: {
              x: currentPosition.currentX,
              y: currentPosition.currentY,
            },
            data: { ...prev.data, currentAmount: currentAmountAfterMove },
            type: "nodeItemNotCurrent",
          });
        }
      }

      //if that is not current move
      else {
        const newId = `${prevIdPrefix}_${index + 1}`;
        //check if node with this location is already in current nodes array
        const foundNodeWithThisLocation = currentNodes.find(
          (node) => node.id === newId
        );

        if (foundNodeWithThisLocation) {
          foundNodeWithThisLocation.data.currentAmount += prev.data.movedAmount;
        }
        if (!foundNodeWithThisLocation) {
          currentNodes.push({
            id: newId,
            position: {
              x: currentPosition.currentX,
              y: currentPosition.currentY,
            },
            data: { ...prev.data },
            type: "nodeItemNotCurrent",
          });
        }
      }
    }
  }
  function addCurrentMoveToCurrentNodes(
    currentItem: Execution,
    index: number,
    previousNodes: Node<CustomNodeData>[],
    currentNodes: Node<CustomNodeData>[],
    currentPosition: Position
  ) {
    const newId = `${currentItem.name_to}_${index + 1}`;

    //check if there's node in previous nodes with target location
    const foundItemWithTargetLocationInPreviousNodes = previousNodes.find(
      (node) => node.id.startsWith(currentItem.name_to)
    );

    if (foundItemWithTargetLocationInPreviousNodes) {
      const currentAmountAfterMove =
        foundItemWithTargetLocationInPreviousNodes.data.currentAmount +
        currentItem.movqty;

      //wywal node ktory dodasz z poprzednich lokalizacji
      const indexOfFoundItemWithTargetLocationInPreviousNodes =
        previousNodes.findIndex((node) => node.id.startsWith(newId));
      previousNodes.splice(
        indexOfFoundItemWithTargetLocationInPreviousNodes,
        1
      );

      //add new node
      currentNodes.push({
        id: newId,
        position: {
          x: currentPosition.currentX,
          y: currentPosition.currentY,
        },
        data: {
          localizationLabel: currentItem.name_to,
          movedFrom: currentItem.name_from,
          movedTo: currentItem.name_to,
          eventDate: currentItem.data_przeniesienia,
          movedAmount: currentItem.movqty,
          currentAmount: currentAmountAfterMove,
          nextDistinctiveDate: null,
        },
        type: "nodeItem",
      });

      return;
    }

    currentNodes.push({
      id: newId,
      position: {
        x: currentPosition.currentX,
        y: currentPosition.currentY,
      },
      data: {
        localizationLabel: currentItem.name_to,
        movedFrom: currentItem.name_from,
        movedTo: currentItem.name_to,
        eventDate: currentItem.data_przeniesienia,
        movedAmount: currentItem.movqty,
        currentAmount: currentItem.movqty,
        nextDistinctiveDate: null,
      },
      type: "nodeItem",
    });
  }
  function createNewDatObjectWithOnlyYearMonthDay(date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    return new Date(year, month, day);
  }
  function addSeparatorNode(data: SeparatorNodeData) {
    const { allNodes, currentItem, currentPosition, index, executionData } =
      data;
    const isNewMainSeparator = checkIfIsNewMainSeparator(allNodes, currentItem);

    if (isNewMainSeparator) {
      const executionsFilteredByDateLaterThanCurrentNode = executionData.filter(
        (item) => {
          if (!item.data_przeniesienia) {
            return false;
          }

          const itemDate = createNewDatObjectWithOnlyYearMonthDay(
            item.data_przeniesienia
          );
          const currentItemDate = createNewDatObjectWithOnlyYearMonthDay(
            currentItem.data_przeniesienia
          );

          return itemDate > currentItemDate;
        }
      );

      allNodes.push(
        createSeparatorNode(
          `separator_${index + 1}`,
          currentItem.data_przeniesienia,
          "nodeMainSeparator",
          currentPosition,
          executionsFilteredByDateLaterThanCurrentNode.length > 0 &&
            executionsFilteredByDateLaterThanCurrentNode[0].data_przeniesienia
            ? executionsFilteredByDateLaterThanCurrentNode[0].data_przeniesienia
            : null
        )
      );
      return;
    }

    allNodes.push(
      createSeparatorNode(
        `separator_${index + 1}`,
        currentItem.data_przeniesienia,
        "nodeSlightSeparator",
        currentPosition,
        null
      )
    );
  }
  function checkIfIsNewMainSeparator(
    allNodes: Node<CustomNodeData>[],
    currentItem: Execution
  ) {
    const lastSeparatorNode = [...allNodes]
      .reverse()
      .find((node) => node.id.startsWith("separator"));

    //if there's no last separator or there's new day compared to last separator
    const lastSeparatorDate = lastSeparatorNode?.data.eventDate
      ?.toISOString()
      .split("T")[0];
    const currentItemDate = currentItem.data_przeniesienia
      .toISOString()
      .split("T")[0];

    return !lastSeparatorNode || currentItemDate !== lastSeparatorDate;
  }
  function createSeparatorNode(
    id: string,
    eventDate: Date,
    separatorType: SeparatorType,
    currentPosition: Position,
    nextDistinctiveDate: Date | null
  ): Node<CustomNodeData> {
    return {
      id: id,
      position: {
        x: currentPosition.currentX - 25,
        y: currentPosition.currentY - 200,
      },
      data: {
        currentAmount: 0,
        eventDate: eventDate,
        movedAmount: 0,
        movedFrom: null,
        movedTo: "",
        localizationLabel: "",
        nextDistinctiveDate: nextDistinctiveDate,
      },
      type: separatorType,
      draggable: false,
    };
  }
  function copyNodesToPreserveLastState(
    currentNodes: Node<CustomNodeData>[],
    previousNodes: Node<CustomNodeData>[]
  ) {
    previousNodes.length = 0;
    currentNodes.forEach((node) => {
      previousNodes.push(node);
    });
  }
  function addInitialNodeWith__Siewnik(
    allNodes: Node<CustomNodeData>[],
    currentNodes: Node<CustomNodeData>[],
    currentPosition: Position,
    executionData: Execution[]
  ) {
    currentNodes.push({
      id: "Siewnik_0",
      position: { x: currentPosition.currentX, y: currentPosition.currentY },
      data: {
        localizationLabel: "Siewnik",
        movedFrom: null,
        movedTo: "Siewnik",
        eventDate: null,
        movedAmount: executionData[0].suma,
        currentAmount: executionData[0].suma,
        nextDistinctiveDate: null,
      },
      type: "nodeItem",
    });

    renderNodes(allNodes, currentNodes);
  }
  function renderNodes(
    allNodes: Node<CustomNodeData>[],
    currentNodes: Node<CustomNodeData>[]
  ) {
    const itemsNumber = currentNodes.length;

    //only one item
    if (itemsNumber === 1) {
      currentNodes.forEach((node) => {
        allNodes.push(node);
      });
    }

    //more items
    else {
      for (let i = 0; i < itemsNumber; i++) {
        const currentItem = currentNodes[i];
        currentItem.position = {
          x: currentItem.position.x,
          y: currentItem.position.y - 110 * i,
        };

        allNodes.push(currentItem);
      }
    }
  }

  //final hook return
  return { resolveJsonData };
};
