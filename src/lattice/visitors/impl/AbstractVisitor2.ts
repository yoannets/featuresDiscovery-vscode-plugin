abstract class TreeNode {
  abstract getChilds(): TreeNode[];
}

abstract class AbstractVisitor2 {
  private _depth_first: boolean;

  constructor(depth_first: boolean) {
    this._depth_first = depth_first;
  }

  visit(node: TreeNode): void {
    this.onVisitStart(node);
    this._visit(node);
    this.onVisitEnd();
  }

  private _visit(node: TreeNode): void {
    this.beforeNode(node);

    if (this._depth_first) {
      this.onPushLevel();
      for (const child of node.getChilds()) {
        this._visit(child);
      }
      this.onPopLevel();
      this.onNode(node);
    } else {
      this.onNode(node);
      this.onPushLevel();
      for (const child of node.getChilds()) {
        this._visit(child);
      }
      this.onPopLevel();
    }

    this.afterNode(node);
  }

  protected beforeNode(node: TreeNode): void {
    // Default implementation does nothing
  }

  protected afterNode(node: TreeNode): void {
    // Default implementation does nothing
  }

  protected onPushLevel(): void {
    // Default implementation does nothing
  }

  protected onPopLevel(): void {
    // Default implementation does nothing
  }

  protected onVisitStart(node: TreeNode): void {
    // Default implementation does nothing
  }

  protected onVisitEnd(): void {
    // Default implementation does nothing
  }

  protected abstract onNode(node: TreeNode): void;
}
