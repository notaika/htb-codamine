import { useState, useEffect } from "react";
import "./Arsen.css";
import { generateMotivationQuips } from "../../utils/utils";

export default function Arsen() {
  const [quip, setQuip] = useState<string | null>(null);

  useEffect(() => {
    const triggerQuipEvent = () => {
      const newQuip = generateMotivationQuips();
      setQuip(newQuip);

      // make it disappear after 5 seconds (maybe a fade out?)
      setTimeout(() => {
        setQuip(null);
      }, 5000);
    };

    // pop up every 10 seconds for now while testing
    const popUpInterval = setInterval(triggerQuipEvent, 10000);

    // clear interval when it unmounts
    return () => clearInterval(popUpInterval);
  }, []);

  return (
    <div className={`quip-bubble ${quip ? "showQuip" : "hideQuip"}`}>
      {quip && <p className="quip">{quip}</p>}
    </div>
  );
}
