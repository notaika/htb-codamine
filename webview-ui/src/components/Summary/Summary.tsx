interface SummaryProps {
  summary: string;
}

/**
 * Summary component that represents the difference between the user's current commit
 * and last commit. 
 * 
 * @param summary React summary prop passed in that contains the new summary (a String) 
 * @returns a paragraph containing the new summary or the default summary if the new
 *          summary doesn't exist
 */
export default function Summary({ summary }: SummaryProps) {
  return (
    <div className="summary">
      <p className="summary__text">
        {summary || "I hope you all don't sleep tonight..."}
      </p>
    </div>
  );
}
