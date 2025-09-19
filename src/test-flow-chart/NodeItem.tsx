import { FiChevronRight } from "react-icons/fi";
import { FiArrowRight } from "react-icons/fi";
import type { CustomNodeData } from "./FlowChartResolver";
import { type NodeProps, type Node, Handle, Position } from "@xyflow/react";

type Props = Node<CustomNodeData>;

const NodeItem = (props: NodeProps<Props>) => {
  const { data } = props;
  const { movedFrom, movedTo, localizations, eventDate, movedAmount } = data;

  return (
    <div
      style={{
        backgroundColor: "white",
        width: 140,
        height: 80,
        border: "1.5px solid #6B99CF",
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        paddingLeft: 8,
        borderRadius: 8,
        boxShadow: "3px 4px 5px 1px rgb(0 0 0 / 0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          width: "100%",
        }}
      >
        <div className="text-slightly-bigger">
          {eventDate
            ? `${eventDate.toLocaleDateString(
                "pl-PL"
              )} ${eventDate.toLocaleTimeString("pl-PL")}`
            : "-"}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginTop: 6,
          }}
        >
          <div style={{ marginTop: -2, marginBottom: -2 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
              }}
            >
              <div className="badge text-slightly-bigger color-white">
                {movedFrom ? movedFrom : "-"}
              </div>
              <div className="">
                <FiChevronRight size={10} color="#6b99cf" />
              </div>
              <div className="badge text-slightly-bigger color-white">
                {movedTo}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              paddingRight: 8,
            }}
          >
            <div className="text-default">Ilość:</div>
            <div
              className="badge-darker text-slightly-bigger color-white"
              style={{ marginLeft: 2 }}
            >
              {movedAmount}
            </div>
          </div>
        </div>

        <div className="text-bold" style={{ paddingTop: 6 }}>
          stan na lokalizacjach:
        </div>
        <div style={{ paddingLeft: 8 }}>
          {localizations.map((localization) => (
            <div
              key={localization.name}
              className="text-bold"
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 1,
                justifyContent: "start",
              }}
            >
              <div
                className="badge-small color-white"
                style={{ paddingTop: 2 }}
              >
                {localization.name}
              </div>
              <div
                className="text-bold"
                style={{ marginLeft: 2, marginRight: 2, paddingTop: 2 }}
              >
                :
              </div>
              <div
                className="badge-small-darker color-white"
                style={{ paddingTop: 2 }}
              >
                {localization.amount} (tac)
              </div>
            </div>
          ))}
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};
export default NodeItem;
