import { RiScissorsCutLine } from "react-icons/ri";

const Cut = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "start",
        alignItems: "start",
      }}
    >
      <div className="cut-icon">
        <RiScissorsCutLine color="white" size={12} />
      </div>
      <div
        className="text-slightly-bigger"
        style={{ paddingLeft: 8, paddingTop: 2 }}
      >
        <div>17.09.2025</div>
        <div className="text-default">
          <span>Cięcie GRU:</span> 9mm
        </div>
      </div>
    </div>
  );
};
export default Cut;
