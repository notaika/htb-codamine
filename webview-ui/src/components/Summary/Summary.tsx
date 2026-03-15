import "./summary.css";
import { useAiMotivation } from "../../utils/hooks/apiHooks";

// TODO:
// - summary re-renders each time. need to fix (useEffect)
export default function Summary() {
  const gitMessage = "fix: finally fixed the webview after 5 hours";
  const aiSummary = useAiMotivation(gitMessage);

  return (
    <div className="summary">
      <p className="summary__text">{aiSummary}</p>
    </div>
  );
}
