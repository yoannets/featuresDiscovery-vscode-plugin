import * as vscode from "vscode";
import path from "path";
import fs from "fs";
import ejs from "ejs";
import getNonce from "./getNonce";
import convertToVisGraph from "./convertToVisGraph";

/**
 * Create a graphview based on the context of vscode and on a json
 * @param context
 * @param jsonToRender
 */
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

  try {
    // Convert the latice json to the vis format
    const convertedJson = convertToVisGraph(jsonToRender);

    const htmlPath = path.join(context.extensionPath, "webviews/graph.ejs");
    panel.webview.html = ejs.render(fs.readFileSync(htmlPath, "utf-8"), {
      nonce,
      jsonToRender: convertedJson,
    });
  } catch (e) {
    console.error(e);
    vscode.window.showErrorMessage(`Please give a valide latice json`);
  }
}

export default createGraphView;
