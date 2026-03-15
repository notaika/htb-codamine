interface SummaryProps {
  summary: string;
}

export default function Summary({ summary }: SummaryProps) {
  return (
    <div className="summary">
      <p className="summary__text">
        {summary || "I hope you all don't sleep tonight..."}
      </p>
    </div>
  );
}
