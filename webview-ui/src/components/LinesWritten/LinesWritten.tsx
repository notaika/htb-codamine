import { useState, useEffect } from 'react';

/**
 * Adds an event listener to the window that listens for a message from the webview ui.
 * If the message "numLines" is sent, the number of lines is updated (React's useEffect
 * and useState). Is a React component.
 * @returns a <p> that tells the user how many lines of code they've written today
 */
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
