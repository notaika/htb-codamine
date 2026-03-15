import { useState, useEffect } from "react";

export default function Summary(commitDiff: string) {
  const [summary, setSummary] = useState("");

  useEffect(() => {
    // pass git message from API into useAiMotivation
    setSummary(commitDiff);
  }, []);

  return (
    <div className="summary">
      <p className="summary__text">{summary}</p>
    </div>
  );
}
