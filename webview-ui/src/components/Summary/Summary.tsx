import { useState, useEffect } from 'react';

export function Summary() {

  const [summary, setSummary] = useState("");

    function handleSetSummary(newSummary: string) {
      setSummary(newSummary);
    };
  
    useEffect(() => {
      window.addEventListener('message', event => {
        const message = event.data;
  
        if (message == undefined)
          return;
        
        switch (message.type) {
          case "aikaThing":
            handleSetSummary(message.lines);
            break;
        }
      })
    });

  return (
    <div>
      <h1>Summary</h1>
      <p>{summary}</p>
    </div>
  );
}