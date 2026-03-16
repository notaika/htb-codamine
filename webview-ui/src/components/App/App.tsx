
import "./App.css";
import Summary from "../Summary/Summary";
import Arsen from "../ForArsen/Arsen";
import { useState, useEffect } from "react";
import XPBar from "../XPBar";
import LinesWritten from "../LinesWritten/LinesWritten";
import Sprite from "../Sprite/Sprite";

declare function acquireVsCodeApi(): {
  postMessage: (message: unknown) => void
  getState: () => unknown
  setState: (state: unknown) => void
}

const vscode = acquireVsCodeApi()


function App() {
  const [xp, setXp] = useState(0)
  const [commitMsg, setCommitMsg] = useState("")
  const [lines, setLines] = useState(0);

  

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = event.data 

      switch (message.type) {
        case 'initializeBar':
          setXp(message.xp)
          break
        case 'updateXP':
          setXp(message.xp)
          vscode.setState({ xp: message.xp })
          break
        case 'levelUp':
          break
        case 'numLines':
          setLines(message.lines)
          break
        case 'commitMessage':
          setCommitMsg(message.commitMsg)
          console.log(message.commitMsg)
          break
        case 'commitSummary':
          setCommitMsg(message.summary)
          setTimeout(() => {
            setCommitMsg("")
          }, 3000)
          break
      }
    }

    window.addEventListener('message', handler)
    return() => window.removeEventListener('message', handler)
  }, [])

  return (
    <>
      <section id="panel" className="dashboard">
        <Arsen />
        <Summary commitMsg={commitMsg} />
        <Sprite />
        <XPBar xp={xp} />
        <LinesWritten lines={lines} />
      </section>
    </>
  );
}

export default App;
