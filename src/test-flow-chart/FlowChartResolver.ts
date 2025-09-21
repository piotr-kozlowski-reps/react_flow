import { MarkerType, type Edge, type Node } from "@xyflow/react";
import type { JsonData } from "./FlowChartData";

export type MapNodeItem = {
  id: string;
  amount: number;
};
export type Localization = {
  name: string;
  amount: number;
};
export type CustomNodeData = {
  localizationLabel: string;
  eventDate: Date | null;
  movedFrom: string | null;
  movedTo: string;
  movedAmount: number;
  currentAmount: number;
};
type Position = {
  currentX: number;
  currentY: number;
};

export function resolveJsonData(
  json: JsonData[]
): [nodes: Node[], edges: Edge[]] {
  //state
  const currentNodes: Node<CustomNodeData>[] = [];
  const previousNodes: Node<CustomNodeData>[] = [];

  const allNodes: Node<CustomNodeData>[] = [];
  const allEdges: Edge[] = [];

  const currentPosition: Position = {
    currentX: 0,
    currentY: 0,
  };

  //initial node with "siewnik"
  currentPosition.currentX = 100;
  currentPosition.currentY = 50;
  addInitialNodeWith__Siewnik(allNodes, currentNodes, currentPosition);

  for (let i = 0; i < json.length; i++) {
    // for (let i = 0; i < 10; i++) {
    const currentItem = json[i];
    copyNodesToPreserveLastState(currentNodes, previousNodes);
    generateCurrentNodes(
      currentItem,
      currentNodes,
      previousNodes,
      currentPosition,
      i
    );
    renderNodes(allNodes, currentNodes);
    renderEdger(allEdges, previousNodes, currentNodes, currentItem);
  }

  //   edges.push(
  //     setArrow(`${previousNodeId}->${lastNodeId}`, previousNodeId, lastNodeId)
  //   );

  // function checkIfOnlyOneUniqueItemInMap(
  //   currentNodesMap: Map<string, MapNodeItem>
  // ): boolean {
  //   const foundIUniqueItems: string[] = [];

  //   for (const [key, _value] of currentNodesMap) {
  //     const hasKeySign_ = key.includes("_");
  //     if (hasKeySign_) {
  //       const splittedString = key.split("-");
  //       if (!foundIUniqueItems.includes(key))
  //         foundIUniqueItems.push(splittedString[0]);
  //     }
  //     if (!hasKeySign_) {
  //       if (!foundIUniqueItems.includes(key)) foundIUniqueItems.push(key);
  //     }
  //   }

  //   console.log({ foundIUniqueItems });

  //   return foundIUniqueItems.length === 1;
  // }

  // function getNextIdNumberSuffix(previousId: string): string {
  //   if (previousId.includes("_")) {
  //     const splittedId = previousId.split("_");
  //     return `${splittedId[0]}_${Number.parseInt(splittedId[1]) + 1}`;
  //   } else {
  //     return `${previousId}_1`;
  //   }
  // }

  // function updateMapToCurrentState(
  //   currentNodesMap: Map<string, MapNodeItem>,
  //   currentItem: JsonData
  // ) {
  //   //update entry according to new quantity
  //   for (const [key, value] of currentNodesMap) {
  //     if (currentItem.name_from === key) {
  //       value.amount -= currentItem.movqty;
  //     }
  //   }

  //   //update or add new entry with name_to
  //   if (currentNodesMap.has(currentItem.name_to)) {
  //     currentNodesMap.set(currentItem.name_to, {
  //       id: currentItem.name_to,
  //       amount:
  //         currentNodesMap.get(currentItem.name_to)!.amount + currentItem.movqty,
  //     });
  //   } else {
  //     currentNodesMap.set(currentItem.name_to, {
  //       id: currentItem.name_to,
  //       amount: currentItem.movqty,
  //     });
  //   }

  //   //delete all localizations with no trays
  //   for (const [key, value] of currentNodesMap) {
  //     if (value.amount <= 0) {
  //       currentNodesMap.delete(key);
  //     }
  //   }
  // }
  // function checkIfCurrentMoveHasSource(
  //   currentItem: JsonData,
  //   currentNodesMap: Map<string, MapNodeItem>
  // ): boolean {
  //   // console.log("checkIfCurrentMoveHasSource");
  //   // console.log("currentItem", currentItem);
  //   // console.log("currentNodesMap", currentNodesMap);

  //   return currentNodesMap.has(currentItem.name_from);
  // }
  // function getAllLocalizations(
  //   currentNodesMap: Map<string, MapNodeItem>
  // ): Localization[] {
  //   const localizations: Localization[] = [];
  //   for (const [key, value] of currentNodesMap) {
  //     localizations.push({
  //       name: key,
  //       amount: value.amount,
  //     });
  //   }

  //   return localizations;
  // }
  // // function updateLocalizationsAccordingToCurrentMove(
  // //   foundLocalizations: Localization[],
  // //   currentMove: JsonData
  // // ): Localization[] {
  // //   const resultLocalizations: Localization[] = [];

  // //   foundLocalizations.forEach((loc) => {
  // //     if (loc.name === currentMove.name_from) {
  // //       const resultAmount = loc.amount - currentMove.movqty;
  // //       if (resultAmount > 0) {
  // //         resultLocalizations.push({ name: loc.name, amount: resultAmount });
  // //       }
  // //     } else {
  // //       resultLocalizations.push(loc);
  // //     }
  // //   });

  // //   return resultLocalizations;
  // // }

  // function addFirstNodeEntryAndEdge(currentItem: JsonData) {
  //   currentNodesMap.set(currentItem.name_to, {
  //     id: currentItem.name_to,
  //     amount: currentItem.movqty,
  //   });
  //   const foundNode = currentNodesMap.get(currentItem.name_to);
  //   if (!foundNode) {
  //     throw new Error(`Node ${currentItem.name_to} not found in map`);
  //   }

  //   currentPosition.currentX = 300;
  //   currentPosition.currentY = 50;
  //   nodes.push({
  //     id: foundNode.id,
  //     position: { x: currentPosition.currentX, y: currentPosition.currentY },
  //     data: {
  //       movedFrom: "Siewnik",
  //       movedTo: foundNode.id,
  //       localizations: getAllLocalizations(currentNodesMap),
  //       eventDate: currentItem.data_przeniesienia,
  //       movedAmount: currentItem.movqty,
  //     },
  //     type: "nodeItem",
  //   });
  //   edges.push(
  //     setArrow(
  //       `Siewnik->${currentItem.name_to}`,
  //       "Siewnik",
  //       currentItem.name_to
  //     )
  //   );
  // }

  function renderEdger(
    allEdges: Edge[],
    previousNodes: Node<CustomNodeData>[],
    currentNodes: Node<CustomNodeData>[],
    currentItem: JsonData
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
      throw new Error("renderEdger -> Index not found");
    }

    const fromNode = previousNodesCopy[indexOfFrom];
    const toNode = currentNodesCopy[indexOfTo];
    previousNodesCopy.splice(indexOfFrom, 1);
    currentNodesCopy.splice(indexOfTo, 1);

    allEdges.push(
      setArrow(`${fromNode.id}->${toNode.id}`, fromNode.id, toNode.id)
    );

    // debugger;
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
    currentItem: JsonData,
    currentNodes: Node<CustomNodeData>[],
    previousNodes: Node<CustomNodeData>[],
    currentPosition: Position,
    index: number
  ) {
    console.log("generateCurrentNodes - start");
    console.log({ currentItem });
    console.log("currentNodes", [...currentNodes]);
    console.log("previousNodes", [...previousNodes]);
    console.log({ currentPosition });

    currentNodes.length = 0;
    currentPosition.currentX += 200;

    //add current move to current nodes
    const newId = `${currentItem.name_to}_${index + 1}`;
    currentNodes.push({
      id: newId,
      position: { x: currentPosition.currentX, y: currentPosition.currentY },
      data: {
        localizationLabel: currentItem.name_to,
        movedFrom: currentItem.name_from,
        movedTo: currentItem.name_to,
        eventDate: currentItem.data_przeniesienia,
        movedAmount: currentItem.movqty,
        currentAmount: currentItem.movqty,
      },
      type: "nodeItem",
    });

    for (let i = 0; i < previousNodes.length; i++) {
      //debug
      // debugger;

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
        // if (index === 8) {
        //   debugger;
        // }

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

    console.log("generateCurrentNodes - end");
    console.log("currentNodes", [...currentNodes]);
    console.log("previousNodes", [...previousNodes]);
    console.log({ currentPosition });
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
    currentPosition: Position
  ) {
    currentNodes.push({
      id: "Siewnik_0",
      position: { x: currentPosition.currentX, y: currentPosition.currentY },
      data: {
        localizationLabel: "Siewnik",
        movedFrom: null,
        movedTo: "Siewnik",
        eventDate: null,
        movedAmount: json[0].suma,
        currentAmount: json[0].suma,
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

  return [allNodes, allEdges];
}
