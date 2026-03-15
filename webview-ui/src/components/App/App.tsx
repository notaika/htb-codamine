import "./App.css";
import Summary from "../Summary/Summary";
import Arsen from "../ForArsen/Arsen";

function App() {
  return (
    <>
      <section id="panel" className="dashboard">
        <Arsen />
        <Summary />
      </section>
    </>
  );
}

export default App;
