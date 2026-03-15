import { LinesWritten } from "../LinesWritten/LinesWritten";

import "./App.css";
import Summary from "../Summary/Summary";
import Arsen from "../ForArsen/Arsen";

function App() {
  return (
    <>
      <section id="panel" className="dashboard">
        <Arsen />
        <Summary />
        <LinesWritten />
      </section>
    </>
  );
}

export default App;
