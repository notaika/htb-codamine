// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

const pressesKey = 'presses';
const timestampKey = 'locTimestamp';
const initLocKey = 'initLoc';
const curLocKey = 'curLoc';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "dopamine-feeder" is now active!');

	// Tell VSCode to sync the value of globalState.presses across machines
	context.globalState.setKeysForSync([pressesKey]);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('dopamine-feeder.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from dopamine-feeder!');
	});

	const keyCountTest = vscode.commands.registerCommand('dopamine-feeder.keyCountTest', () => {
		// Goal: store in globalState a key-value map of filenames to when that file was last opened
		// with its linecount at that point in time. At midnight local time, linecount 'resets' to zero. That is,
		// the displayed linecount to the user of 'current progress' will be the # of lines in the file - the # of lines
		// in the file as of the first access of that file after midnight local time.
		//
		// Alg whenever a file is opened would be:
		// - Check globalState.fileUri.locTimestamp (or whatever we call it)
		// - If undefined, write the current time, and write current loc in file to globalState.fileUri.loc
		// - If timestamp is in the previous day in local time, do the same as above, overwriting the previous values
		// - Otherwise, leave them be.
		// - Whenever a file is updated, update the 'progress' loc to be current loc - globalState.fileUri.loc
		// 
		vscode.workspace.onDidOpenTextDocument((e: vscode.TextDocument | undefined) => {
			if (e == undefined) {
				return;
			}

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

		// Whenever the document being edited changes:
		// - increase 'keypress'/'xp' count
		// - display xp
		// - display loc written for this doc
		vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
			const currentWorkspacePresses : number = context.workspaceState.get(pressesKey) ?? 0;
			context.workspaceState.update(pressesKey, currentWorkspacePresses + 1);

			const currentGlobalPresses : number = context.globalState.get(pressesKey) ?? 0;
			context.globalState.update(pressesKey, currentGlobalPresses + 1);

			const locKey = `${e.document.uri.toString()}.${initLocKey}`;
			const initialLoc : number = context.workspaceState.get(locKey) ?? 0;

			// Set lines of code progres for this document
			context.workspaceState.update(`${e.document.uri.toString()}.${curLocKey}`, e.document.lineCount);

			// tally up total lines of code
			let totalLoc : number = 0;
			for (const doc of vscode.workspace.textDocuments) {
				const docInitLoc : number = context.workspaceState.get(`${doc.uri.toString()}.${initLocKey}`) ?? 0;
				const docLoc : number = context.workspaceState.get(`${doc.uri.toString()}.${curLocKey}`) ?? 0;

				totalLoc += docLoc - docInitLoc;
			}

			console.clear();
			console.log(`xp: ${currentGlobalPresses + 1 }`);
			console.log(`doc lines: ${e.document.lineCount - initialLoc}`);
			console.log(`workspace lines: ${totalLoc}`);
		});
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(keyCountTest);
}

// This method is called when your extension is deactivated
export function deactivate() {}
