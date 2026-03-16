import "./WebviewPanel.css";
import CodeBuddy from "../CodeBuddy/CodeBuddy";

export const WebviewPanel = () => {
  return (
    <div className="webview-container">
      {/* <header className="webview-header">
        <h1>Webview Panel Mock</h1>
      </header>

      <main className="webview-content">
        <section className="section">
          <h2>Actions</h2>
          <div className="button-group">
            <button onClick={() => console.log("Action 1 clicked")}>
              Action 1
            </button>
            <button onClick={() => console.log("Action 2 clicked")}>
              Action 2
            </button>
          </div>
        </section>

        <section className="section">
          <h2>Status</h2>
          <div className="status-card">
            <span className="status-label">Ready</span>
          </div>
        </section>
      </main> */}
      <div className="view">
        <CodeBuddy />
      </div>
    </div>
  );
};
