import { useState, useEffect } from "react";

export default function Summary(commitDiff: string) {
  const [summary, setSummary] = useState("");
  interface AnthropicApiResponse {
    content?: {
      text: string;
    }[];
  }

  function useAiMotivation(commitMsg: string) {
    const [aiSummary, setAiSummary] = useState("");

    useEffect(() => {
      const fetchMotivation = async () => {
        try {
          const response = await fetch("http://127.0.0.1:3001/v1/messages", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "bruce-save-us",
            },
            body: JSON.stringify({
              model: "bcit-AIModel-67",
              max_tokens: 1024,
              messages: [{ role: "user", content: commitMsg }],
            }),
          });

          const data: AnthropicApiResponse = await response.json();
          if (data.content?.[0]) {
            setAiSummary(data.content[0].text);
          }
        } catch {
          setAiSummary(
            "BCIT AI API Offline. Run 'node src/test/mock-api-server.js' to start.",
          );
        }
      };

      fetchMotivation();
    }, [commitMsg]);
    return aiSummary;
  }

  const newSummary = useAiMotivation(commitDiff);

  useEffect(() => {
    // pass git message from API into useAiMotivation
    setSummary(newSummary);
  }, [newSummary]);

  return (
    <div className="summary">
      <h1>This is the summary</h1>
      <p className="summary__text">{summary}</p>
    </div>
  );
}
