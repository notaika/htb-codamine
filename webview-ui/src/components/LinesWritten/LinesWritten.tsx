import { useState, useEffect } from 'react';

export default function LinesWritten() {

  const [numLines, setNumLines] = useState(0);

  function handleLinesUpdate(newNumLines: number) {
    setNumLines(newNumLines);
  };

  useEffect(() => {
    window.addEventListener('message', event => {
      const message = event.data;

      if (message == undefined)
        return;
      
      switch (message.type) {
        case "numLines":
          handleLinesUpdate(message.lines);
          break;
      }
    })
  }, []);

  return (
      <p>You've written {numLines} lines of code today!</p>
  );
}
