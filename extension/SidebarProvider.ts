import * as vscode from "vscode";
import ejs from "ejs";
import fs from "fs";
import path from "path";
import getNonce from "./getNonce";
import createGraphView from "./createGraphView";

/**
 * Provide sidebar implementation for the extension
 */
class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _context: vscode.ExtensionContext) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._context.extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(
      async (data: { type: string; value: any }) => {
        switch (data.type) {
          case "error":
            vscode.window.showErrorMessage(data.value);
            break;
          case "load-graph":
            createGraphView(this._context, data.value);
            break;
        }
      }
    );
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "css", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._context.extensionUri, "css", "vscode.css")
    );

    return ejs.render(
      fs.readFileSync(
        path.resolve(this._context.extensionPath, "webviews/sidebar.ejs"),
        "utf-8"
      ),
      {
        nonce,
        webview,
        styleResetUri,
        styleVSCodeUri,
      }
    );
  }
}

export default SidebarProvider;
