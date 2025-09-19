import FlowChartTest from "./test-flow-chart/FlowChartTest";

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
      <h1>Flow Chart</h1>
      <FlowChartTest />
    </div>
  );
}

export default App;
