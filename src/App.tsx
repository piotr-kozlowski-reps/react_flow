import FlowChartEntry from "./ui/FlowChart";

function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <FlowChartEntry />
    </div>
  );
}

export default App;
