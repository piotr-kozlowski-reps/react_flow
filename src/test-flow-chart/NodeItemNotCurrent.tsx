import { FiChevronRight } from "react-icons/fi";
import { FiArrowRight } from "react-icons/fi";
import type { CustomNodeData } from "./FlowChartResolver";
import {
  type NodeProps,
  type Node,
  Handle,
  Position,
  MarkerType,
} from "@xyflow/react";

type Props = Node<CustomNodeData>;

const NodeItemNotCurrent = (props: NodeProps<Props>) => {
  const { data } = props;
  const {
    eventDate,
    localizationLabel,
    movedFrom,
    movedTo,
    movedAmount,
    currentAmount,
  } = data;

  return (
    <div
      style={{
        backgroundColor: "white",
        width: 140,
        height: 94,
        border: "1.5px dashed #ccc",
        display: "flex",
        alignItems: "center",
        justifyContent: "start",
        paddingLeft: 8,
        borderRadius: 8,
        boxShadow: "3px 4px 5px 1px rgb(0 0 0 / 0.2)",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -1,
          right: -1,
          backgroundColor: "#3870b5",
          paddingLeft: 8,
          paddingRight: 8,
          paddingBottom: 6,
          paddingTop: 6,
          borderRadius: 8,
        }}
        className="text-slightly-bigger color-white"
      >
        {localizationLabel}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            className="text-slightly-bigger"
            style={{ marginTop: 6, opacity: 0.25 }}
          >
            {eventDate
              ? `${eventDate.toLocaleDateString(
                  "pl-PL"
                )} ${eventDate.toLocaleTimeString("pl-PL")}`
              : "-"}
          </div>
        </div>

        <div className="text-default" style={{ marginTop: 12, opacity: 0.25 }}>
          transport:
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginTop: -2,
          }}
        >
          <div style={{ marginTop: -2, marginBottom: -2, opacity: 0.25 }}>
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
              opacity: 0.25,
            }}
          >
            <div className="text-default" style={{ paddingTop: 3 }}>
              Ilość:
            </div>
            <div
              className="badge text-slightly-bigger color-white"
              style={{ marginLeft: 2 }}
            >
              {movedAmount}
            </div>
          </div>
        </div>

        <div className="text-default" style={{ marginTop: 10 }}>
          stan na lokalizacji:
        </div>

        <div style={{ display: "flex", justifyContent: "start" }}>
          <div
            className="badge-darker text-slightly-bigger color-white"
            style={{ marginTop: 2 }}
          >
            {currentAmount} (tac)
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};
export default NodeItemNotCurrent;
