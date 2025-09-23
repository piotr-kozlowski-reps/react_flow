import { useEffect } from "react";
import { resolveJsonData } from "../domain/FlowChartResolver";
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

const FlowChartEntry = () => {
  const [nodes, setNodes, _onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, _onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    getDataFromApi();

    async function getDataFromApi() {
      try {
        const [initialNodes, initialEdges] = await resolveJsonData();
        setNodes(initialNodes);
        setEdges(initialEdges);
      } catch (error) {
        console.log(error);
      }
    }
  }, [setNodes, setEdges]);

  return (
    <div
      style={{
        width: "95%",
        height: "95%",
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

export default FlowChartEntry;
