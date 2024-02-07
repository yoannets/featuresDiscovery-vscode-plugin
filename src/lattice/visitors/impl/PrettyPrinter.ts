class PrettyPrinter extends AbstractVisitor2 {
  private _output: string;
  private _cleanOutput: boolean;
  private _outputSignatureFormat: boolean;

  constructor(cleanOutput: boolean, outputSignatureFormat: boolean) {
    super();
    this._cleanOutput = cleanOutput;
    this._outputSignatureFormat = outputSignatureFormat;
    this._output = "";
  }

  onNode(node: Node): void {
    let typename = node.getType().getTypename();
    if (this._cleanOutput && typename !== "" && typename.charAt(0) === "Q") {
      typename = typename.substring(1);
    }
    this._output += typename;
  }

  beforeNode(node: Node): void {
    const parent = node.getParent();
    if (parent !== null) {
      if (node.isParentFirstChild()) {
        this._output += "<";
      } else {
        if (this._outputSignatureFormat) {
          this._output += ";";
        } else {
          this._output += ",";
        }
      }
    }
  }

  afterNode(node: Node): void {
    const parent = node.getParent();
    if (parent !== null && node.isParentLastChild()) {
      if (this._outputSignatureFormat) {
        this._output += ";>";
      } else {
        this._output += ">";
      }
    }
  }

  onVisitStart(node: Node): void {
    this._output = "";
    if (!node.isRoot()) {
      throw new Error("Can't start visit in PrettyPrinter with non-root node");
    }
  }

  getOutput(): string {
    return this._output;
  }
}
