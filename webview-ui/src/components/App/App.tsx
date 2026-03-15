import "./App.css";
import Summary from "../Summary/Summary";
import { Sprite } from "../ForArsen/Arsen";
import Arsen from "../ForArsen/Arsen";
import { useState, useEffect } from "react";
import XPBar from "../XPBar/XPBar";
import LinesWritten from "../LinesWritten/LinesWritten";

declare function acquireVsCodeApi(): {
  postMessage: (message: unknown) => void;
  getState: () => any;
  setState: (state: unknown) => void;
};

const vscode = acquireVsCodeApi();

function App() {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = event.data;

      console.log("message received:", message);

      switch (message.type) {
        case "initializeBar":
          console.log("initializeBar fired, xp:", message.xp);

          setXp(message.xp);
          break;
        case "updateXP":
          console.log("updateXP fired, xp:", message.xp);
          setXp(message.xp);
          vscode.setState({ xp: message.xp });
          break;
        case "levelUp":
          console.log("levelup recieve", message.xpToNext);
          break;
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <>
      <section id="panel" className="dashboard">
        <Summary />
        <Arsen />
        <XPBar xp={xp} />
        <LinesWritten />
      </section>
    </>
  );
}

export default App;
