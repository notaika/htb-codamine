import * as vscode from "vscode"; // give access to VS Code API
import { exec } from "child_process"; // gives exec() to run terminal commands?

/**
 * Gets the most recent commit message from git.
 *
 * @param folder folder to run the git command in
 * @returns commit message
 */
const getCommitMessage = (folder: string): Promise<string> => {
  /*
   *  Promise is just async/await
   *  resolve = call when it works -> pass result
   *  reject = call when it fails -> pass error
   *  returns a Promise<string> because exec() is async
   */
  return new Promise((resolve, reject) => {
    /*
     *  exec() runs the terminal command
     *  1st arg: flags makes it get full message ONLY
     *  2nd arg = call when it fails -> pass error
     *  3rd arg = callback that runs when command finishes
     */
    exec("git log -1 --pretty=%B", { cwd: folder }, (error, output) => {
      if (error) {
        reject(error); // send error to catch()
      } else {
        resolve(output); // send text to then()
      }
    });
  });
};

/**
 * Returns the changes between the previous and most recent commit.
 *
 * @param folder folder to run the git command in
 * @returns commit changes as a strinf
 */
const getCommitChanges = (folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec("git diff HEAD~1 HEAD", { cwd: folder }, (error, output) => {
      if (error) {
        resolve("No changes were made.");
      } else {
        resolve(output);
      }
    });
  });
};

/**
 * A listener that gets triggered everytime a user makes a commit.
 * See: https://github.com/microsoft/vscode/blob/main/extensions/git/src/api/git.constants.ts
 * See: https://github.com/microsoft/vscode/blob/main/extensions/git/src/api/extension.ts
 * See: https://github.com/microsoft/vscode/blob/main/extensions/git/src/api/api1.ts#L24
 * See: https://github.com/microsoft/vscode/blob/main/extensions/git/src/api/git.d.ts
 *
 * @param context manages cleanup (given by VS Code in activate())
 * @param onCommit the callback event listener that watches for a commit
 */
export function watchForCommits(
  context: vscode.ExtensionContext,
  onCommit: (data: { diff: string; message: string }) => void,
) {
  // Kept getting "possibly 'undefined'"", so... safety check
  const gitExtension = vscode.extensions.getExtension("vscode.git");

  if (!gitExtension) {
    console.error("Git extension is undefined.");
    return;
  }

  const git = gitExtension.exports.getAPI(1);

  for (const repo of git.repositories) {
    const folder = repo.rootUri.fsPath; // The folder path as a string

    // Basically when a commit happens on the repo, get the commit message on folder path.
    const commitListener = repo.onDidCommit(() => {
      getCommitChanges(folder)
        .then((diff) => {
          return getCommitMessage(folder).then((message) => {
            onCommit({ diff, message });
            //        ^ shorthand for { diff: diff, message: message }
          });
        })
        .catch((error) => {
          console.error("Could not grab commit message: ", error);
        });
    });

    // Remove event listener when extension deactivates
    context.subscriptions.push(commitListener);
  }
}

// I am going in circles.. someone please send help what is this documentation :( where's my wiki links?!!?

/*
const git = gitExtension.getAPI(1); -> returns and API instance
git.repositories; -> a Repository[];

a Repository instance has:
    instance variables:
        - readonly rootUri: Uri;

    functions:
    - getCommit(ref: string): Promise<Commit> <- ??? need a hash :(
    - readonly onDidCommit: Event<void>; 
    - commit(message: string, opts?: CommitOptions): Promise<void>;
    - readonly onDidCommit: Event<void>;
    - add(paths: string[]): Promise<void>;
*/
