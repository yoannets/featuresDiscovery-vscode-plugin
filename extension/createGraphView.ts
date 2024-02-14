import * as vscode from "vscode";
import path from "path";
import fs from "fs";
import ejs from "ejs";
import getNonce from "./getNonce";

function createGraphView(context: vscode.ExtensionContext, jsonToRender: any) {
  const panel = vscode.window.createWebviewPanel(
    "webview",
    "Feature Discovery Graph View",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
    }
  );

  // Use a nonce to only allow a specific script to be run.
  const nonce = getNonce();

  const htmlPath = path.join(context.extensionPath, "webviews/graph.ejs");
  panel.webview.html = ejs.render(fs.readFileSync(htmlPath, "utf-8"), {
    nonce,
    jsonToRender,
  });
}

export default createGraphView;
