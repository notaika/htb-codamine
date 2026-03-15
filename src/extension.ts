import * as vscode from "vscode";

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

  private _getHtmlForWebview(webview: vscode.Webview) {
    // We only need the bundled JS. esbuild handles PNGs as dataurls.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "webview.js"),
    );

    const apiUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "src", "app", "test-api.js"),
    );

    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "webview.css"),
    );

    const nonce = getNonce();

    return `<!DOCTYPE html>                                                                    
    <html lang="en">                                                                           
    <head>                                                                                     
    <meta charset="UTF-8">                                                                   
    <meta http-equiv="Content-Security-Policy"                                               
    content="default-src 'none';                                                             
            style-src ${webview.cspSource} 'unsafe-inline';                                 
            img-src ${webview.cspSource} data: vscode-webview-resource:;                    
            script-src 'nonce-${nonce}' 'unsafe-eval' ${webview.cspSource};                 
            connect-src http://127.0.0.1:3001 http://localhost:3001;">                      
    <meta name="viewport" content="width=device-width, initial-scale=1.0">                   
    <link href="${styleUri}" rel="stylesheet">                                               
    <title>Brucey Loosey</title>                                                             
  </head>                                                                                    
  <body>                                                                                     
    <div id="root">Loading Brucey Loosey...</div>                                            
    <script nonce="${nonce}" src="${scriptUri}"></script>                                    
    <script nonce="${nonce}" src="${apiUri}"></script>                                       
  </body>                                                                                    
  </html>`;
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
