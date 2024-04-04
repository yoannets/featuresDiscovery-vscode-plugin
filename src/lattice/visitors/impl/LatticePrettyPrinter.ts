import { IMethod, IType, Signature } from "../../../polyfills/eclipse";
import { Lattice } from "../../model/Lattice";
import { LatticeNode } from "../../model/LatticeNode";
import { Direction, Visitor } from "../Visitor";
import { AbstractVisitor } from "./AbstractVisitor";

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
      return "UNPRINTABLE METHOD SIGNATURE";
    }
  },
  printExtentElement(extentElement: any): string {
    try {
      return (extentElement as IType).getFullyQualifiedParameterizedName();
    } catch (e) {
      console.error(e);
      return "UNIDENTIFIED_TYPE";
    }
  },
};

export class LatticePrettyPrinter extends AbstractVisitor implements Visitor {
  protected printer: ElementPrinter;
  protected nodeIndents: Map<LatticeNode, string>;
  private ids: Map<LatticeNode, string>;
  protected globalCounter: number = 0;

  constructor(printer: ElementPrinter = DEFAULT_ELEMENT_PRINTER) {
    super();
    this.printer = printer;
    this.nodeIndents = new Map<LatticeNode, string>();
    this.ids = new Map<LatticeNode, string>();
  }

  visitLatticeFromTop(aLattice: Lattice): void {
    throw new Error("Method not implemented.");
  }
  visitLatticeFromBottom(aLattice: Lattice): void {
    throw new Error("Method not implemented.");
  }
  getCurrentVisitDirection(): Direction {
    throw new Error("Method not implemented.");
  }
  visitLatticeNode(latticeNode: LatticeNode, direction: Direction): void {
    throw new Error("Method not implemented.");
  }

  static defaultPrettyPrinter(): LatticePrettyPrinter {
    return new LatticePrettyPrinter(DEFAULT_ELEMENT_PRINTER);
  }

  static javaElementsLatticePrettyPrinter(): LatticePrettyPrinter {
    return new LatticePrettyPrinter(JAVA_ELEMENT_PRINTER);
  }

  public getNodeIndents(): Map<LatticeNode, string> {
    return this.nodeIndents;
  }

  public setNodeIndents(ndIndents: Map<LatticeNode, string>): void {
    this.nodeIndents = ndIndents;
  }

  public getIds(): Map<LatticeNode, string> {
    return this.ids;
  }

  public setIds(ids: Map<LatticeNode, string>): void {
    this.ids = ids;
  }

  preprocessChildren(node: LatticeNode): void {
    const nodeIndent = this.getNodeIndents().get(node) || "";
    console.log(nodeIndent + "ITS CHILDREN:=================");
    const childrenIndent = nodeIndent + "\t->";
    for (const child of node.getChildren()) {
      this.getNodeIndents().set(child, childrenIndent);
    }
  }

  processNode(node: LatticeNode): void {
    let nodeId = this.getIds().get(node);
    if (!nodeId) {
      nodeId = "" + this.globalCounter++;
      this.getIds().set(node, nodeId);
    }

    let nodeIndent = this.getNodeIndents().get(node) || "";
    if (!nodeIndent) {
      nodeIndent = "";
      this.getNodeIndents().set(node, nodeIndent);
    }

    console.log(
      `${nodeIndent}${nodeId}[${this.printExtent(node)},${this.printIntent(
        node
      )}]`
    );
  }

  processVisitedNode(node: LatticeNode): void {
    const nodeId = this.getIds().get(node);
    const nodeIndent = this.getNodeIndents().get(node) || "";
    console.log(`${nodeIndent}${nodeId}[...,...]`);
  }

  reset(): void {
    super.reset();
    this.globalCounter = 0;
    this.nodeIndents.clear();
    this.ids.clear();
  }

  protected printIntent(node: LatticeNode): string {
    const printStrings: string[] = Array.from(node.getIntent(), (feature) =>
      this.printer.printIntentElement(feature)
    );
    return printStrings.toString();
  }

  protected printExtent(node: LatticeNode): string {
    const printStrings: string[] = Array.from(node.getExtent(), (object) =>
      this.printer.printExtentElement(object)
    );
    return printStrings.toString();
  }
}
