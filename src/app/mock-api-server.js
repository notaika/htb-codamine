const http = require("http");

const PORT = 3001;

/**
 * Takes in a commit message and gives it to AI that generates a duolingo-like humour summary/comment.
 * This is a Mock API that follows the Anthropic req/res structure - takes a commit message, searches
 * for a matching substring, and returns a random summary from a pool.
 *
 * @param {string} userCommit
 * @returns the AI generated message
 */
const generateMockSummary = (userCommit) => {
  const msg = userCommit.toLowerCase();

  if (msg.includes("feat") || msg.includes("feature") || msg.includes("add")) {
    const summaries = [
      '"A new feature? Bold of you to assume it works."',
      '"Oh, adding features before the last one works. Classic."',
      '"New feature detected. New bugs incoming. Godspeed."',
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  if (msg.includes("fix") || msg.includes("bug") || msg.includes("patch")) {
    const summaries = [
      '"A fix. For the bug you introduced yesterday. Heroic."',
      '"You broke it, you fixed it. That\'s called a net zero. Not impressive."',
      '"Bug fixed. Three more created in the process. You\'re on a roll."',
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  if (
    msg.includes("refactor") ||
    msg.includes("clean") ||
    msg.includes("style") ||
    msg.includes("lint")
  ) {
    const summaries = [
      '"Refactoring code that barely worked in the first place. Brave."',
      '"You cleaned up the code. The logic is still a disaster, but it\'s a tidy disaster."',
      '"Moving deck chairs on the Titanic, but sure, the indentation looks great."',
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  if (
    msg.includes("docs") ||
    msg.includes("readme") ||
    msg.includes("comment")
  ) {
    const summaries = [
      '"Documentation. For code no one will read, written by someone who barely understood it."',
      '"Oh, you commented your code. Too bad the comments are also wrong."',
      '"A README. The last refuge of someone who knows their code can\'t speak for itself."',
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  if (msg.includes("test") || msg.includes("spec") || msg.includes("expect")) {
    const summaries = [
      '"Writing tests. At a hackathon. I don\'t know whether to be impressed or concerned."',
      '"Tests! So you can watch them fail in an organized fashion."',
      '"A test suite. Cute. Does it test for bad decisions? Because you\'d have full coverage."',
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  if (
    msg.includes("revert") ||
    msg.includes("undo") ||
    msg.includes("rollback")
  ) {
    const summaries = [
      '"Reverting. The most honest commit message is admitting you were wrong."',
      '"Back to square one. At least it\'s a square you recognize."',
      '"A revert. The coding equivalent of pretending the last hour never happened."',
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  if (
    msg.includes("merge") ||
    msg.includes("pull") ||
    msg.includes("conflict")
  ) {
    const summaries = [
      '"Merge conflict. Two people, one codebase, zero communication. Classic."',
      '"Merging branches. May your conflicts be few and your teammates be employed elsewhere."',
      '"A pull request. Congratulations on asking someone else to review your mistakes."',
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  if (
    msg.includes("deploy") ||
    msg.includes("release") ||
    msg.includes("prod")
  ) {
    const summaries = [
      '"Deploying to prod on a Friday. I\'ll remember you fondly."',
      '"A release. You\'re either very confident or very unaware. Unclear which."',
      '"Shipping to production. The users are about to become your QA team."',
    ];
    return summaries[Math.floor(Math.random() * summaries.length)];
  }

  // Generic fallbacks
  const fallbacks = [
    '"Now why would you do that?"',
    '"I will hunt you all for sport."',
    '"They are orphans. They\'re basically equivalent to garbage."',
    "\"Bold move. Let's see if it pays off. It won't.\"",
    '"I\'ve seen things. This commit is now one of them."',
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

/**
 * Server creation.
 *
 * @param req request to server
 * @param res response from server
 */
const server = http.createServer((req, res) => {
  // CORS headers to allow calling from localhost:5173
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, x-api-key, anthropic-version",
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Handle POST to /v1/messages
  if (req.method === "POST" && req.url === "/v1/messages") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);
        const userMessage = parsed.messages?.[0]?.content || "";

        // Simulate a small delay like a real API would have
        setTimeout(
          () => {
            // Response matches the exact Anthropic API format
            const response = {
              id: "msg_mock_" + Date.now(),
              type: "message",
              role: "assistant",
              content: [
                {
                  type: "text",
                  text: generateMockSummary(userMessage),
                },
              ],
              model: parsed.model || "bruceOpus-999999",
              stop_reason: "end_turn",
              usage: {
                input_tokens: 42,
                output_tokens: 69,
              },
            };

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(response));
          },
          300 + Math.random() * 700,
        );
      } catch (e) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: { type: "invalid_request", message: "Bad JSON" },
          }),
        );
      }
    });
    return;
  }

  // Health check
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("BCIT AI API running. POST to /v1/messages");
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

/**
 * Listener.
 */
server.listen(PORT, () => {
  console.log(
    `\n  BCIT AI API running at http://127.0.0.1:${PORT}/v1/messages`,
  );
  console.log(`  POST to http://127.0.0.1:${PORT}/v1/messages`);
});
