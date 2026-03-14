import * as vscode from "vscode";

const pressesKey = 'keypresses';
const levelKey = 'level';

export function activate(context: vscode.ExtensionContext) {
  console.log("Brucey Loosey is active!");

  // 1. REGISTER THE SIDEBAR PROVIDER
  const provider = new BruceViewProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("bruce.window", provider),
  );

  // 2. COMMANDS
  const openPanel = vscode.commands.registerCommand("bruce.start", () => {
    vscode.window.createWebviewPanel(
      "bruce",
      "brucey loosey",
      vscode.ViewColumn.One,
      {},
    );
  });

  const motivationMsg = vscode.commands.registerCommand(
    "bruce.getRoasted",
    () => {
      vscode.window.showInformationMessage("@#$%^you suck at coding!!@#$%^&");
    },
  );

  // 3. SET UP EVENT LISTENERS
  vscode.workspace.onDidOpenTextDocument((e: vscode.TextDocument) => {
	const workspacePresses : number = context.workspaceState.get(pressesKey) ?? 0;
	const xp : number = workspacePresses / 10;
	let workspaceLevel : number | undefined = context.workspaceState.get(levelKey);

	if (workspaceLevel == undefined) {
		context.workspaceState.update(levelKey, 0);
		workspaceLevel = 0;
	}

	const xpToNext : number = xpForLevel(workspaceLevel + 1) - xp;
	provider.sendInitMessage(xp, workspaceLevel, xpToNext);
  });

  vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
		const currentWorkspacePresses : number = context.workspaceState.get(pressesKey) ?? 0;
		context.workspaceState.update(pressesKey, currentWorkspacePresses + 1);

		const currentGlobalPresses : number = context.globalState.get(pressesKey) ?? 0;
		context.globalState.update(pressesKey, currentGlobalPresses + 1);

		const xp = (currentWorkspacePresses + 1)/10;
		const level : number = context.workspaceState.get(levelKey) ?? 0;

		provider.sendXPMessage(xp);
		if (xp >= xpForLevel(level)) {
			context.workspaceState.update(levelKey, level + 1)
			provider.sendLevelUpMessage(xpForLevel(level + 1) - xp);
		}
	});

  context.subscriptions.push(openPanel, motivationMsg);
}

// THE SIDEBAR PROVIDER CLASS
class BruceViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "bruce.window";
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  public sendInitMessage(xp: number, level: number, xpToNext: number) {
	if (this._view) {
		this._view.webview.postMessage({
			type: 'initializeBar',
			xp: xp,
			level: level,
			xpToNext: xpToNext
		})
	}
  }

  public sendXPMessage(xp: number) {
	if (this._view) {
		this._view.webview.postMessage({
			type: 'updateXP',
			xp: xp
		});
	}
  }

  public sendLevelUpMessage(xpToNext: number) {
	if (this._view) {
		this._view.webview.postMessage({
			type: 'levelUp',
			xpToNext: xpToNext
		})
	}
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(this._extensionUri, "webview-ui", "dist", "assets", "index.js")
  );
  const styleMainUri = webview.asWebviewUri(
    vscode.Uri.joinPath(this._extensionUri, "webview-ui", "dist", "assets", "index.css")
  );
  const nonce = getNonce();

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${styleMainUri}" rel="stylesheet">
      <title>Dopamine Feeder</title>
    </head>
    <body>
      <div id="root"></div>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
  }
}

function xpForLevel(level: number): number {
	return level == 0 ? 0 : 100 * (1.15)**(level);
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// DEACTIVATE EXTENSION
export function deactivate() {}
