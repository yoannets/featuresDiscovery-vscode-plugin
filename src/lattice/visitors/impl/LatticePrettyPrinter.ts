import { IMethod, IType, Signature } from "../../../polyfills/eclipse";
import { LatticeNode } from "../../model/LatticeNode";
import { Visitor } from "../Visitor";

export interface ElementPrinter {
  printIntentElement(intentElement: any): string;
  printExtentElement(extentElement: any): string;
}

export const DEFAULT_ELEMENT_PRINTER: ElementPrinter = {
  printIntentElement(intentElement: any): string {
    return intentElement.toString();
  },
  printExtentElement(extentElement: any): string {
    return extentElement.toString();
  },
};

export const JAVA_ELEMENT_PRINTER: ElementPrinter = {
  printIntentElement(intentElement: any): string {
    const method = intentElement as IMethod;
    try {
      return Signature.toString(
        method.getSignature(),
        method.getElementName(),
        method.getParameterNames(),
        true,
        true
      );
    } catch (e) {
      console.error(e);
      return "UNPRINTABLE METHOD SIGNATURE(Java Model Exception)";
    }
  },
  printExtentElement(extentElement: any): string {
    try {
      return (extentElement as IType).getFullyQualifiedParameterizedName();
    } catch (e) {
      console.error(e);
      return "UNIDENTIFIED_TYPE(JavaModelException)";
    }
  },
};

export class LatticePrettyPrinter implements Visitor {
  protected printer: ElementPrinter;
  protected nodeIndents: Map<LatticeNode, string>;
  private ids: Map<LatticeNode, string>;
  private globalCounter: number = 0;

  constructor(printer: ElementPrinter = DEFAULT_ELEMENT_PRINTER) {
    this.printer = printer;
    this.nodeIndents = new Map<LatticeNode, string>();
    this.ids = new Map<LatticeNode, string>();
  }

  static defaultPrettyPrinter(): LatticePrettyPrinter {
    return new LatticePrettyPrinter(DEFAULT_ELEMENT_PRINTER);
  }

  static javaElementsLatticePrettyPrinter(): LatticePrettyPrinter {
    return new LatticePrettyPrinter(JAVA_ELEMENT_PRINTER);
  }

  preprocessChildren(node: LatticeNode): void {
    const nodeIndent = this.nodeIndents.get(node) || "";
    const childrenIndent = nodeIndent + "\t->";
    for (const child of node.getChildren()) {
      this.nodeIndents.set(child, childrenIndent);
    }
  }

  processNode(node: LatticeNode): void {
    let nodeId = this.ids.get(node);
    if (!nodeId) {
      nodeId = "" + this.globalCounter++;
      this.ids.set(node, nodeId);
    }

    let nodeIndent = this.nodeIndents.get(node) || "";
    if (!nodeIndent) {
      nodeIndent = "";
      this.nodeIndents.set(node, nodeIndent);
    }

    console.log(
      `${nodeIndent}${nodeId}[${this.printExtent(node)},${this.printIntent(
        node
      )}]`
    );
  }

  processVisitedNode(node: LatticeNode): void {
    const nodeId = this.ids.get(node);
    const nodeIndent = this.nodeIndents.get(node) || "";
    console.log(`${nodeIndent}${nodeId}[...,...]`);
  }

  reset(): void {
    this.globalCounter = 0;
    this.nodeIndents.clear();
    this.ids.clear();
  }

  private printIntent(node: LatticeNode): string {
    const printStrings: string[] = Array.from(node.getIntent(), (feature) =>
      this.printer.printIntentElement(feature)
    );
    return printStrings.sort().toString();
  }

  private printExtent(node: LatticeNode): string {
    const printStrings: string[] = Array.from(node.getExtent(), (object) =>
      this.printer.printExtentElement(object)
    );
    return printStrings.sort().toString();
  }
}
