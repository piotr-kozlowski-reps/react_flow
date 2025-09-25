import type { NodeProps, Node } from "@xyflow/react";
import { CgArrowsHAlt } from "react-icons/cg";
import type { CustomNodeData, Position } from "../domain/types";
import useWholeChartPosition from "../domain/stores/useWholeChartPosition";

type Props = Node<CustomNodeData>;

const MainHorizontalSeparator = (props: NodeProps<Props>) => {
  ////vars
  const { data } = props;
  const { localizationLabel } = data;
  const { chartPosition } = useWholeChartPosition();

  ////tsx
  return (
    <div
      style={{
        height: 1,
        width: chartPosition.currentX,
        position: "relative",
        borderTop: "1.5px dashed #aaa",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 10,
          width: 80,
          textAlign: "right",
        }}
      >
        <div
          style={{ textWrap: "nowrap" }}
          className="text-slightly-bigger badge-dark color-white"
        >
          {localizationLabel}
        </div>
        {/* <div style={{ paddingBottom: 2 }}>
          <CgArrowsHAlt size={10} />
        </div> */}
        {/* {nextDistinctiveDate ? (
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
        )} */}
      </div>
    </div>
  );
};

export default MainHorizontalSeparator;
