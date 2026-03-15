import "./summary.css";
import { useAiMotivation } from "../../utils/hooks/apiHooks";
import { useState, useEffect } from 'react';

// TODO:
// - summary re-renders each time. need to fix (useEffect)
export default function Summary() {
  const gitMessage = "fix: finally fixed the webview after 5 hours";

  const [summary, setSummary] = useState("");
  
  useEffect(() => {
    const newSummary = useAiMotivation(gitMessage);
    setSummary(newSummary);
    
    // const triggerSummaryEvent = () => {
    // };

    // when should summary pop up? when you do a new commit.

  }, []);

  return (
    <div className="summary">
      <p className="summary__text">{summary}</p>
    </div>
  );
}
