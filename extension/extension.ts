import * as vscode from "vscode";
import SidebarProvider from "./SidebarProvider";
import createGraphView from "./createGraphView";

export function activate(context: vscode.ExtensionContext) {
  // Graph View command
  const graphViewCommand = vscode.commands.registerCommand(
    "extension.featureDiscovery",
    () => createGraphView(context, {})
  );

  // Sidebar actions
  const sidebar = vscode.window.registerWebviewViewProvider(
    "featureDiscovery-sidebar",
    new SidebarProvider(context)
  );

  // Adding to the context
  context.subscriptions.push(sidebar);
  context.subscriptions.push(graphViewCommand);
}
