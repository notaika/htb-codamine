import { useState, useEffect } from "react";

// Anthropic API Response Structure
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

// TODO:
// - summary re-renders each time. need to fix (useEffect)
// - this api call will get moved to extension.ts after testing




  interface SummaryProps {
  commitMsg: string
}


export default function Summary({ commitMsg }: SummaryProps) {
  return (
    <div className="summary">
      {commitMsg && <p className="summary__text">{commitMsg}</p>}
    </div>
  )
}