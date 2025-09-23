import { IoWaterOutline } from "react-icons/io5";

const WaterIrrigation = () => {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "start",
        alignItems: "start",
        marginTop: 4,
      }}
    >
      <div className="water-irrigation-icon ">
        <IoWaterOutline color="white" size={12} />
      </div>
      <div
        className="text-slightly-bigger"
        style={{ paddingLeft: 8, paddingTop: 2 }}
      >
        <div>17.09.2025</div>
        <div className="text-default">
          <span>Podlewanie</span>
        </div>
      </div>
    </div>
  );
};
export default WaterIrrigation;
