import Header from "./components/Header";
import Projects from "./components/Projects";

function App() {
  return (
    <>
      <Header />
      {/* <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
      </div> */}
      <Projects />
    </>
  );
}

export default App;
