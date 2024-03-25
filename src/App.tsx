import "./App.css";
import Counter from "./features/counter/Counter";
import Post from "./features/posts/Post";

function App() {
  return (
    <div className="container">
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
      <Post />
    </div>
  );
}

export default App;
