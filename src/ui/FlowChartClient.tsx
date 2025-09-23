import {
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "@xyflow/react";
import NodeItem from "./NodeItem";
import NodeItemNotCurrent from "./NodeItemNotCurrent";
import NodeSlightSeparator from "./NodeSlightSeparator";
import NodeMainSeparator from "./NodeMainSeparator";
import NodeEventsInfo from "./NodeEventsInfo";

const nodeTypes = {
  nodeItem: NodeItem,
  nodeItemNotCurrent: NodeItemNotCurrent,
  nodeSlightSeparator: NodeSlightSeparator,
  nodeMainSeparator: NodeMainSeparator,
  nodeEventsInfo: NodeEventsInfo,
};

const FlowChartClient = (props: Props) => {
  const { initialNodes, initialEdges } = props;
  const [nodes, _setNodes, _onNodesChange] = useNodesState(initialNodes);
  const [edges, _setEdges, _onEdgesChange] = useEdgesState(initialEdges);
  return (
    <div
      style={{
        marginTop: "24px",
        width: "90%",
        height: "80%",
        border: "1px dashed gray",
      }}
    >
      <ReactFlow nodes={nodes} edges={edges} fitView nodeTypes={nodeTypes}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FlowChartClient;
