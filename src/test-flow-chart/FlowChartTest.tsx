import {
  Background,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { json } from "./FlowChartData";
import { resolveJsonData } from "./FlowChartResolver";
import NodeItem from "./NodeItem";

const nodeTypes = {
  nodeItem: NodeItem,
};

const FlowChartTest = () => {
  const [initialNodes, initialEdges] = resolveJsonData(json);
  const [nodes, _setNodes, _onNodesChange] = useNodesState(initialNodes);
  const [edges, _setEdges, _onEdgesChange] = useEdgesState(initialEdges);

  // console.log({ initialNodes });

  return (
    <div
      style={{
        marginTop: "24px",
        width: "90%",
        height: "80%",
        border: "1px dashed gray",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        // onNodesChange={onNodesChange}
        fitView
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default FlowChartTest;
