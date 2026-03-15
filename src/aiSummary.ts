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

// replace later
const API_URL = "http://127.0.0.1:3001/v1/messages";

export async function getAiSummary(commitDiff: string): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "bruce-save-us",
      },
      body: JSON.stringify({
        model: "bcit-AIModel-67",
        max_tokens: 67,
        messages: [
          {
            role: "user",
            content: `You are a savage coding buddy. Look at this code diff and summarize what the developer just built or changed in 1-2 fun sentences. Be funny, encouraging and duolingo-like humour:\n\n"${commitDiff}"`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return "AI Summary Error: " + response.statusText;
    }

    const data: AnthropicApiResponse =
      (await response.json()) as AnthropicApiResponse;
    return data.content[0].text;
  } catch (error) {
    console.error("Could not fetch summary:", error);
    throw error;
  }
}
