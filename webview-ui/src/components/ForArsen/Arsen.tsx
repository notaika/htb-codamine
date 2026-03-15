import { useState, useEffect } from "react";
import "./Arsen.css";
import { generateMotivationQuips } from "../../utils/utils";

export default function Arsen() {
  const [quip, setQuip] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const triggerQuipEvent = () => {
      const newQuip = generateMotivationQuips();
      setQuip(newQuip);
      setVisible(true);

      setTimeout(() => setVisible(false), 4500);
      setTimeout(() => setQuip(null), 5000);
    };

    const popUpInterval = setInterval(triggerQuipEvent, 10000);
    return () => clearInterval(popUpInterval);
  }, []);

  return (
    <div className={`quip-bubble ${visible ? "showQuip" : "hideQuip"}`}>
      <p className="quip">{quip}</p>
    </div>
  );
}
