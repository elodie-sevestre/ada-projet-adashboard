import { useState } from "react";
import Header from "./components/Header";
import Projects from "./components/Projects";
import Skills from "./components/Skills";

function App() {
  // state
  const [refresh, setRefresh] = useState(0);
  return (
    <>
      <Header />
      <Projects refresh={refresh} setRefresh={setRefresh} />
      <Skills refresh={refresh} setRefresh={setRefresh} />
    </>
  );
}

export default App;
