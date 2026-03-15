

interface LinesWrittenProps{
  lines: number
}


export default function LinesWritten({ lines }: LinesWrittenProps) {

  return (
      <p>You've written {lines} lines of code today!</p>
  );
}
