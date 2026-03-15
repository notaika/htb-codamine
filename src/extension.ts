import * as vscode from "vscode";

const pressesKey = 'keypresses';
const levelKey = 'level';
const timestampKey = 'locTimestamp';
const initLocKey = 'initLoc';
const curLocKey = 'curLoc';

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
  //
  //
	initializeXPTracking(context, provider);
  vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor | undefined) => {
	initializeXPTracking(context, provider);
  });

  vscode.workspace.onDidOpenTextDocument((e: vscode.TextDocument) => {
	const uriString = e.uri.toString();

	const currentTime = new Date();
	const locTimestamp : number | undefined = context.workspaceState.get(`${uriString}.${timestampKey}`)
	const locDate : Date | undefined = locTimestamp == undefined ? undefined : new Date(locTimestamp)

	if (
		locDate == undefined || 
		(locDate.getDate() != currentTime.getDate()) ||
		(locDate.getFullYear() != currentTime.getFullYear())
	) {
		context.workspaceState.update(`${uriString}.${timestampKey}`, currentTime.getTime());
		context.workspaceState.update(`${uriString}.${initLocKey}`, e.lineCount);
	}
  });

  vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
		const currentWorkspacePresses : number = context.workspaceState.get(pressesKey) ?? 0;
		context.workspaceState.update(pressesKey, currentWorkspacePresses + 1);

		const currentGlobalPresses : number = context.globalState.get(pressesKey) ?? 0;
		context.globalState.update(pressesKey, currentGlobalPresses + 1);

		const xp = (currentWorkspacePresses + 1)/10;
		const level : number = context.workspaceState.get(levelKey) ?? 1;

		provider.sendXPMessage(xp);
		if (xp >= xpForLevel(level + 1)) {
			context.workspaceState.update(levelKey, level + 1)
			provider.sendLevelUpMessage(xpForLevel(level + 1));
		}

		// Lines of code stuff
		const locKey = `${e.document.uri.toString()}.${initLocKey}`;
		const initialLoc : number = context.workspaceState.get(locKey) ?? 0;

		context.workspaceState.update(`${e.document.uri.toString()}.${curLocKey}`, e.document.lineCount);

		// tally up total lines of code
		let totalLoc : number = 0;
		for (const doc of vscode.workspace.textDocuments) {
			const docInitLoc : number = context.workspaceState.get(`${doc.uri.toString()}.${initLocKey}`) ?? 0;
			const docLoc : number = context.workspaceState.get(`${doc.uri.toString()}.${curLocKey}`) ?? 0;

			totalLoc += docLoc - docInitLoc;
		}

		provider.sendNumLinesMessage(totalLoc);
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
			xp: xp,
		});
	}
  }

  public sendLevelUpMessage(xpToNext: number) {
	if (this._view) {
		this._view.webview.postMessage({
			type: 'levelUp',
			xpToNext: xpToNext
		});
	}
  }

  public sendNumLinesMessage(lines: number) {
	if (this._view) {
		this._view.webview.postMessage({
			type: 'numLines',
			lines: lines
		});
	}
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // We only need the bundled JS. esbuild handles PNGs as dataurls.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "webview.js"),
    );
    const nonce = getNonce();

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; img-src ${webview.cspSource} data:; script-src 'nonce-${nonce}' 'unsafe-eval';">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Brucey Loosey</title>
    </head>
    <body>
      <div id="root">If you see this, React hasn't loaded yet!</div>
      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
  }
}

function initializeXPTracking(context: vscode.ExtensionContext, provider: BruceViewProvider) {
	const workspacePresses : number = context.workspaceState.get(pressesKey) ?? 0;
	const xp : number = workspacePresses / 10;
	let workspaceLevel : number | undefined = context.workspaceState.get(levelKey);

	if (workspaceLevel === undefined) {
		context.workspaceState.update(levelKey, 1);
		workspaceLevel = 1;
	}

	const xpToNext : number = xpForLevel(workspaceLevel);
	provider.sendInitMessage(xp, workspaceLevel, xpToNext);
}
	
function xpForLevel(level: number): number {
	if (level <= 0) {
		return 100;
	} else {
		return 100 * (1.15)**(level) + xpForLevel(level - 1);
	}
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
