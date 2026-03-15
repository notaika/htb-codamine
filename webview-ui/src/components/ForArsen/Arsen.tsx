import { useState, useEffect, useRef } from "react";
import "./Arsen.css";
import { generateMotivationQuips } from "../../utils/utils";

export default function Arsen() {
  const [quip, setQuip] = useState<string | null>(null);
  const [phase, setPhase] = useState<"hidden" | "enter" | "visible" | "exit">(
    "hidden",
  );
  const phaseRef = useRef(phase);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const showQuip = () => {
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    const newQuip = generateMotivationQuips();
    setQuip(newQuip);
    setPhase("enter");
    exitTimerRef.current = setTimeout(() => setPhase("exit"), 5000);
    hideTimerRef.current = setTimeout(() => {
      setPhase("hidden");
      setQuip(null);
    }, 6000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (phaseRef.current === "hidden") showQuip();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(
    () => () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    },
    [],
  );

  return (
    <div className="companion-container">
      <div className="mushroom-idle-animation" onClick={showQuip} />
      <div
        className={`bubble-wrapper ${phase === "hidden" ? "bubble-invisible" : "bubble-visible"}`}
      >
        <div
          className={`quip-bubble ${phase === "enter" ? "bubble-enter" : phase === "exit" ? "bubble-exit" : ""}`}
        >
          <p className="quip-text">{quip}</p>
        </div>
      </div>
    </div>
  );
}
