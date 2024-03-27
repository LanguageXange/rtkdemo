import "./App.css";
import Counter from "./features/counter/Counter";
function App() {
  return (
    <div>
      <h1>RTK demo</h1>
      <Counter />

      <div
        style={{
          width: "100%",
          height: "3px",
          background: "#4c0ffb",
          margin: "25px 0",
        }}
      ></div>
    </div>
  );
}

export default App;
