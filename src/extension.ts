import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("ipad kids extension is active!");

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "dopamine-feeder.helloWorld",
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello VS Code");
    },
  );

  const motivationMsg = vscode.commands.registerCommand(
    "ipadKids.getRoasted",
    () => {
      vscode.window.showInformationMessage("@#$%^you suck at coding!!@#%$^&");
    },
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(motivationMsg);
}

// This method is called when your extension is deactivated
export function deactivate() {}
