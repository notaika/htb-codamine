import * as vscode from "vscode";

const pressesKey = "keypresses";
const levelKey = "level";
const initLocKey = 'initLoc';
const curLocKey = 'curLoc';

export function activate(context: vscode.ExtensionContext) {


  // 1. REGISTER THE SIDEBAR PROVIDER
  const provider = new BruceViewProvider(context.extensionUri);
  context.subscriptions.push(vscode.window.registerWebviewViewProvider("bruce.window", provider));

  // 2. COMMANDS
  const openPanel = vscode.commands.registerCommand("bruce.start", () => {
    vscode.window.createWebviewPanel("bruce", "brucey loosey", vscode.ViewColumn.One, {});
  });

  const motivationMsg = vscode.commands.registerCommand("bruce.getRoasted", () => {
    vscode.window.showInformationMessage("@#$%^you suck at coding!!@#$%^&");
  });

  // 3. SET UP EVENT LISTENERS
  //
  //
  initializeXPTracking(context, provider);
  vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor | undefined) => {
    initializeXPTracking(context, provider);
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
		// const initialLoc : number = context.workspaceState.get(locKey) ?? 0;

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

const gitExtension = vscode.extensions.getExtension('vscode.git')

if (gitExtension) {
  gitExtension.activate().then(() => {
    const git = gitExtension.exports.getAPI(1)

    // wait for repositories to load
    const onDidOpenRepo = git.onDidOpenRepository(() => {
      console.log('git repos found:', git.repositories.length)

      if (git.repositories.length > 0) {
        console.log('watching repo:', git.repositories[0].rootUri.path)

        let lastCommitSha: string | undefined = git.repositories[0].state.HEAD?.commit


        git.repositories[0].state.onDidChange(async () => {
          console.log('git state change')
          const head = git.repositories[0].state.HEAD
          if (head?.commit) {
            if(head.commit === lastCommitSha) return
            lastCommitSha = head.commit

            const commit = await git.repositories[0].getCommit(head.commit)
            const commitMsg = commit.message
            console.log('commit message:', commitMsg)
            if (commitMsg) {
              provider.sendCommitSummary(commitMsg)
            }
          }
        })

        onDidOpenRepo.dispose() // stop listening once first repo is found <--then only 1 repo can be open at a time???????
      }
      })

    // also check if repos already exist
    if (git.repositories.length > 0) {
      let lastCommitSha: string | undefined = git.repositories[0].state.HEAD?.commit
      git.repositories[0].state.onDidChange(async () => {
        const head = git.repositories[0].state.HEAD
        if (head?.commit) {

          //only fire if commit SHA is different from last time
          if(head.commit === lastCommitSha) return

          lastCommitSha = head.commit //update last known SHA

          const commit = await git.repositories[0].getCommit(head.commit)
          const commitMsg = commit.message
          console.log('new commit', commitMsg)
          if (commitMsg) {
            provider.sendCommitSummary(commitMsg)
              }
            }
          })
        }
      })
    }

  context.subscriptions.push(openPanel, motivationMsg);
}

// THE SIDEBAR PROVIDER CLASS
class BruceViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "bruce.window";
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView, _context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken) {
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
        type: "initializeBar",
        xp: xp,
        level: level,
        xpToNext: xpToNext,
      });
    }
  }

  public sendXPMessage(xp: number) {
    if (this._view) {
      this._view.webview.postMessage({
        type: "updateXP",
        xp: xp,
      });
    }
  }

  public sendLevelUpMessage(xpToNext: number) {
    if (this._view) {
      this._view.webview.postMessage({
        type: "levelUp",
        xpToNext: xpToNext,
      });
    }
  }

  public sendNumLinesMessage(lines: number) {
    if (this._view) {
      this._view.webview.postMessage({
        type: "numLines",
        lines: lines,
      });
    }
  }

public async sendCommitSummary(commitMsg: string) {
  try {
    const response = await fetch('http://127.0.0.1:3001/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'bruce-save-us'
      },
      body: JSON.stringify({
        model: 'bcit-AIModel-67',
        max_tokens: 1024,
        messages: [{ role: 'user', content: commitMsg }]
      })
    }) 
    const data = await response.json() as {
      content: { type: string; text: string } []
    }
    const summary = data.content?.[0]?.text ?? ''

    if (this._view) {
      this._view.webview.postMessage({
        type: 'commitSummary',
        summary: summary
      })
    }
  } catch {
    console.log('Mock API offline')
  }
}

  private _getHtmlForWebview(webview: vscode.Webview) {
    // We only need the bundled JS. esbuild handles PNGs as dataurls.
    const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "webview.js"));

    //const apiUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "src", "app", "test-api.js"));

    const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "out", "webview.css"));

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
            connect-src http://127.0.0.1:3001 http://localhost:3001 ws://localhost:3001;">                      
    <meta name="viewport" content="width=device-width, initial-scale=1.0">          
    <meta http-equiv="Permissions-Policy" content="local-network-access=*">         
    <link href="${styleUri}" rel="stylesheet">                                               
    <title>Brucey Loosey</title>                                                             
  </head>                                                                                    
  <body>                                                                                     
    <div id="root">Loading Brucey Loosey...</div>                                            
    <script nonce="${nonce}" src="${scriptUri}"></script>                                                                          
  </body>                                                                                    
  </html>`;
  }
}

function initializeXPTracking(context: vscode.ExtensionContext, provider: BruceViewProvider) {
  const workspacePresses: number = context.workspaceState.get(pressesKey) ?? 0;
  const xp: number = workspacePresses / 10;
  let workspaceLevel: number | undefined = context.workspaceState.get(levelKey);

  if (workspaceLevel === undefined) {
    context.workspaceState.update(levelKey, 1);
    workspaceLevel = 1;
  }

  const xpToNext: number = xpForLevel(workspaceLevel);
  provider.sendInitMessage(xp, workspaceLevel, xpToNext);
}

function xpForLevel(level: number): number {
  if (level <= 0) {
    return 100;
  } else {
    return 100 * 1.15 ** level + xpForLevel(level - 1);
  }
}

function getNonce() {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// DEACTIVATE EXTENSION
export function deactivate() {}
