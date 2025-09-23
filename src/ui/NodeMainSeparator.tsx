import type { NodeProps, Node } from "@xyflow/react";
import { CgArrowsHAlt } from "react-icons/cg";
import type { CustomNodeData } from "../domain/types";

type Props = Node<CustomNodeData>;

const NodeMainSeparator = (props: NodeProps<Props>) => {
  ////vars
  const { data } = props;
  const { eventDate, nextDistinctiveDate } = data;

  ////tsx
  return (
    <div
      style={{
        height: 500,
        width: 1,
        backgroundColor: "#333",

        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 316,
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          gap: 4,
        }}
      >
        <div
          style={{ textWrap: "nowrap" }}
          className="text-slightly-bigger badge-darker color-white"
        >
          {eventDate ? `${eventDate.toLocaleDateString("pl-PL")}` : "-"}
        </div>
        <div style={{ paddingBottom: 2 }}>
          <CgArrowsHAlt size={10} />
        </div>
        {nextDistinctiveDate ? (
          <div
            style={{ textWrap: "nowrap" }}
            className="text-slightly-bigger badge-darker color-white"
          >
            {nextDistinctiveDate
              ? `${nextDistinctiveDate.toLocaleDateString("pl-PL")}`
              : "-"}
          </div>
        ) : (
          <div
            style={{ textWrap: "nowrap" }}
            className="text-slightly-bigger badge-darker color-white"
          >
            ...
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeMainSeparator;
