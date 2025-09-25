import { type Edge, type Node } from "@xyflow/react";

export type Execution = {
  id____: string;
  ordnmb: string;
  name_to: string;
  suma: number;
  twr_kod: string;
  sordid: number;
  data_przeniesienia: Date;
  fullnm: string;
  movfrm: null | number;
  optime: string | null;
  mov_to: number;
  name_from: string;
  ile_wz: number;
  ile_wz_status: number;
  movqty: number;
  keyval: number;
  clsnam: string;
  prc_id: number;
};
export type ExecutionDTO = {
  id____: string;
  ordnmb: string;
  name_to: string;
  suma: string;
  twr_kod: string;
  sordid: string;
  data_przeniesienia: string;
  fullnm: string;
  movfrm: null | string;
  optime: string | null;
  mov_to: string;
  name_from: string;
  ile_wz: string;
  ile_wz_status: string;
  movqty: string;
  keyval: string;
  clsnam: string;
  prc_id: string;
};

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
  nextDistinctiveDate: Date | null;
  movedFrom: string | null;
  movedTo: string;
  movedAmount: number;
  currentAmount: number;
};

export type Position = {
  currentX: number;
  currentY: number;
};
export type SeparatorType = "nodeSlightSeparator" | "nodeMainSeparator";

export type SeparatorNodeData = {
  allNodes: Node<CustomNodeData>[];
  currentPosition: Position;
  currentItem: Execution;
  index: number;
  executionData: Execution[];
};

export type TransportData = {
  allNodes: Node<CustomNodeData>[];
  allEdges: Edge[];
  currentPosition: Position;
  executionData: Execution[];
};

export type CutsData = {
  allNodes: Node<CustomNodeData>[];
  cutsData: Cut[];
  allInformationNodesPerLocalization: Map<Node<CustomNodeData>, Cut>;
};

export type Cut = {
  ordnmb: string;
  zlecajacy: string;
  wykonujacy: string | null;
  plndat: Date | null;
  stkcnt: number;
  cutdat: null | Date;
  height: number | null;
  height_done: number | null;
  adddat: Date | null;
  planam_done: string | null;
};
export type CutDTO = {
  ordnmb: string;
  zlecajacy: string;
  wykonujacy: string | null;
  plndat: string | null;
  stkcnt: string;
  cutdat: null | string;
  height: string | null;
  height_done: string | null;
  adddat: string | null;
  planam_done: string | null;
};
