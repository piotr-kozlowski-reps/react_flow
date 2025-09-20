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
  eventDate: Date | null;
  movedFrom: string | null;
  movedTo: string;
  movedAmount: number;
  localizations: Localization[];
};
type Position = {
  currentX: number;
  currentY: number;
};
type MoveUpSignal = {
  isCounterStarted: boolean;
};

export function resolveJsonData(
  json: JsonData[]
): [nodes: Node[], edges: Edge[]] {
  //state
  const currentNodesMap = new Map<string, MapNodeItem>();
  const nodes: Node<CustomNodeData>[] = [];
  const edges: Edge[] = [];
  const currentPosition: Position = {
    currentX: 0,
    currentY: 0,
  };
  const moveUpCounter: MoveUpSignal = {
    isCounterStarted: false,
  };

  //initial node with "siewnik"
  addInitialNodeWith__Siewnik();

  // for (let i = 0; i < json.length; i++) {
  for (let i = 0; i < 3; i++) {
    const currentItem = json[i];

    // log values
    console.log("---------start loop---------");
    console.log("currentNodesMap", currentNodesMap);
    console.log("nodes", nodes);
    console.log("edges", edges);
    console.log("currentItem", currentItem);

    /**  first move push everything from "Siewnik" to first localization */
    if (i === 0) {
      addFirstNodeEntryAndEdge(currentItem);
      currentPosition.currentX = 300;
      currentPosition.currentY = 50;
      continue;
    }

    /** all other steps despite first */
    if (!checkIfCurrentMoveHasSource(currentItem, currentNodesMap))
      throw new Error(
        `Node ${currentItem.name_from} has source that was not found in sources map.`
      );

    //update map
    updateMapToCurrentState(currentNodesMap, currentItem);

    //change position
    updatePosition(currentNodesMap, moveUpCounter, currentPosition);

    console.log(JSON.stringify(moveUpCounter));
    console.log(JSON.stringify(currentPosition));

    //add new node and edge
    const foundNodeThatHasAlreadyNodeId = [...nodes.reverse()].find((node) =>
      node.id.startsWith(currentItem.name_to)
    );
    const nodeId = foundNodeThatHasAlreadyNodeId
      ? `${getNextIdNumberSuffix(foundNodeThatHasAlreadyNodeId.id)}`
      : currentItem.name_to;

    nodes.push({
      id: nodeId,
      position: { x: currentPosition.currentX, y: currentPosition.currentY },
      data: {
        movedFrom: currentItem.name_from,
        movedTo: nodeId,
        eventDate: currentItem.data_przeniesienia,
        localizations: getAllLocalizations(currentNodesMap),
        movedAmount: currentItem.movqty,
      },
      type: "nodeItem",
    });

    const previousNodeId = nodes[nodes.length - 2].id;
    const lastNodeId = nodeId;

    console.log(previousNodeId, ">", lastNodeId);

    edges.push(
      setArrow(`${previousNodeId}->${lastNodeId}`, previousNodeId, lastNodeId)
    );

    // log values
    console.log("--------- end loop---------");
    console.log("currentNodesMap", currentNodesMap);
    console.log("nodes", nodes);
    console.log("edges", edges);

    if (i >= 7) {
      // debugger;
    }

    // //////logs
    // console.log("--------- end loop---------");
    // console.log("currentNodesMap", currentNodesMap);
    // console.log("nodes", nodes);
    // console.log("edges", edges);
  }

  // function getLastNodeWithDesiredLocalizationId(
  //   nodes: Node<CustomNodeData>[],
  //   name_to: string
  // ): string {
  //   const foundLastNode = [...nodes]
  //     .reverse()
  //     .find((el) => el.id.startsWith(name_to));

  //   if (!foundLastNode) {
  //     throw new Error(
  //       "getLastNodeWithDesiredLocalizationId -> found no node with desired id"
  //     );
  //   }

  //   return foundLastNode.id;
  // }

  function updatePosition(
    currentNodesMap: Map<string, MapNodeItem>,
    moveUpCounter: MoveUpSignal,
    currentPosition: Position
  ) {
    if (
      !checkIfOnlyOneUniqueItemInMap(currentNodesMap) &&
      !moveUpCounter.isCounterStarted
    )
      moveUpCounter.isCounterStarted = true;

    if (checkIfOnlyOneUniqueItemInMap(currentNodesMap))
      moveUpCounter.isCounterStarted = false;

    currentPosition.currentX += 200;
    // currentPosition.currentY = moveUpCounter.isCounterStarted
    //   ? (currentPosition.currentY -= 80)
    //   : 50;
  }

  function checkIfOnlyOneUniqueItemInMap(
    currentNodesMap: Map<string, MapNodeItem>
  ): boolean {
    const foundIUniqueItems: string[] = [];

    for (const [key, _value] of currentNodesMap) {
      const hasKeySign_ = key.includes("_");
      if (hasKeySign_) {
        const splittedString = key.split("-");
        if (!foundIUniqueItems.includes(key))
          foundIUniqueItems.push(splittedString[0]);
      }
      if (!hasKeySign_) {
        if (!foundIUniqueItems.includes(key)) foundIUniqueItems.push(key);
      }
    }

    console.log({ foundIUniqueItems });

    return foundIUniqueItems.length === 1;
  }

  function getNextIdNumberSuffix(previousId: string): string {
    if (previousId.includes("_")) {
      const splittedId = previousId.split("_");
      return `${splittedId[0]}_${Number.parseInt(splittedId[1]) + 1}`;
    } else {
      return `${previousId}_1`;
    }
  }

  function updateMapToCurrentState(
    currentNodesMap: Map<string, MapNodeItem>,
    currentItem: JsonData
  ) {
    //update entry according to new quantity
    for (const [key, value] of currentNodesMap) {
      if (currentItem.name_from === key) {
        value.amount -= currentItem.movqty;
      }
    }

    //update or add new entry with name_to
    if (currentNodesMap.has(currentItem.name_to)) {
      currentNodesMap.set(currentItem.name_to, {
        id: currentItem.name_to,
        amount:
          currentNodesMap.get(currentItem.name_to)!.amount + currentItem.movqty,
      });
    } else {
      currentNodesMap.set(currentItem.name_to, {
        id: currentItem.name_to,
        amount: currentItem.movqty,
      });
    }

    //delete all localizations with no trays
    for (const [key, value] of currentNodesMap) {
      if (value.amount <= 0) {
        currentNodesMap.delete(key);
      }
    }
  }
  function checkIfCurrentMoveHasSource(
    currentItem: JsonData,
    currentNodesMap: Map<string, MapNodeItem>
  ): boolean {
    // console.log("checkIfCurrentMoveHasSource");
    // console.log("currentItem", currentItem);
    // console.log("currentNodesMap", currentNodesMap);

    return currentNodesMap.has(currentItem.name_from);
  }
  function getAllLocalizations(
    currentNodesMap: Map<string, MapNodeItem>
  ): Localization[] {
    const localizations: Localization[] = [];
    for (const [key, value] of currentNodesMap) {
      localizations.push({
        name: key,
        amount: value.amount,
      });
    }

    return localizations;
  }
  // function updateLocalizationsAccordingToCurrentMove(
  //   foundLocalizations: Localization[],
  //   currentMove: JsonData
  // ): Localization[] {
  //   const resultLocalizations: Localization[] = [];

  //   foundLocalizations.forEach((loc) => {
  //     if (loc.name === currentMove.name_from) {
  //       const resultAmount = loc.amount - currentMove.movqty;
  //       if (resultAmount > 0) {
  //         resultLocalizations.push({ name: loc.name, amount: resultAmount });
  //       }
  //     } else {
  //       resultLocalizations.push(loc);
  //     }
  //   });

  //   return resultLocalizations;
  // }
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
  function addFirstNodeEntryAndEdge(currentItem: JsonData) {
    currentNodesMap.set(currentItem.name_to, {
      id: currentItem.name_to,
      amount: currentItem.movqty,
    });
    const foundNode = currentNodesMap.get(currentItem.name_to);
    if (!foundNode) {
      throw new Error(`Node ${currentItem.name_to} not found in map`);
    }

    currentPosition.currentX = 300;
    currentPosition.currentY = 50;
    nodes.push({
      id: foundNode.id,
      position: { x: currentPosition.currentX, y: currentPosition.currentY },
      data: {
        movedFrom: "Siewnik",
        movedTo: foundNode.id,
        localizations: getAllLocalizations(currentNodesMap),
        eventDate: currentItem.data_przeniesienia,
        movedAmount: currentItem.movqty,
      },
      type: "nodeItem",
    });
    edges.push(
      setArrow(
        `Siewnik->${currentItem.name_to}`,
        "Siewnik",
        currentItem.name_to
      )
    );
  }
  function addInitialNodeWith__Siewnik() {
    nodes.push({
      id: "Siewnik",
      position: { x: 100, y: 50 },
      data: {
        movedFrom: null,
        movedTo: "Siewnik",
        localizations: [{ name: "Siewnik", amount: json[0].suma }],
        eventDate: null,
        movedAmount: json[0].suma,
      },
      type: "nodeItem",
    });
  }

  return [nodes, edges];
}
