import React from "react";
import "./CodeBuddy.css";
import codeBuddy from "../../assets/idle.gif";

export default function CodeBuddy() {
  return (
    <div className="panel">
      <img src={codeBuddy} alt="capybara" className="codeBuddy" />
    </div>
  );
}
