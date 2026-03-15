import { useState, useEffect } from "react";

interface AnthropicApiResponse {
  id: string;
  type: string;
  role: string;
  content: {
    type: string;
    text: string;
  }[];
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export function useAiMotivation(commitMsg: string) {
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
        // ?. means optional
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
