// @TODO: Called Node in past

class Type {
  // Define Type class properties and methods as needed
}

class TreeNode {
  private _parent: Node | null;
  private _childs: Node[];
  private _type: Type;

  constructor(type: Type, parent: Node | null = null) {
    this._childs = [];
    this._type = type;
    this._parent = parent;

    if (parent !== null) {
      parent.appendChild(this);
    }
  }

  appendChild(child: Node): void {
    this._childs.push(child);
  }

  getChilds(): Node[] {
    return this._childs;
  }

  getType(): Type {
    return this._type;
  }

  isRoot(): boolean {
    return this._parent === null;
  }

  getParent(): Node | null {
    return this._parent;
  }

  isParentFirstChild(): boolean {
    return (
      this._parent !== null && this._parent.getChilds().indexOf(this) === 0
    );
  }

  isParentLastChild(): boolean {
    return (
      this._parent !== null &&
      this._parent.getChilds().lastIndexOf(this) ===
        this._parent.getChilds().length - 1
    );
  }

  asSubTree(): Node {
    if (this.isRoot()) {
      return this;
    }

    const newRoot = new Node(this._type);

    for (const child of this._childs) {
      const newSubNode = new Node(child.getType(), newRoot);
    }

    return newRoot;
  }

  toString(): string {
    return `${super.toString()} [${this._childs.length} childs]`;
  }
}
