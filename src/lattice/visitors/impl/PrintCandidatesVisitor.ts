import { NodeFeatureType } from "../../graph/model/NodeFeatureType";
import { LatticeNode } from "../../model/LatticeNode";
import { FeatureType, FeatureTypeName } from "./FeatureDetectorVisitor";
import {
  JAVA_ELEMENT_PRINTER,
  LatticePrettyPrinter,
} from "./LatticePrettyPrinter";
import { Node } from "./Node";

export class PrintCandidatesVisitor extends LatticePrettyPrinter {
  private candidateNodes: Map<LatticeNode, FeatureType>;

  private nodes: Node[];

  constructor(typedFeatureNodes: Map<LatticeNode, FeatureType>) {
    super();
    this.printer = JAVA_ELEMENT_PRINTER;
    this.candidateNodes = typedFeatureNodes;
    this.nodes = [];
  }

  getNodes(): Node[] {
    return this.nodes;
  }

  public getNodeIndents(): Map<LatticeNode, String> {
    return this.nodeIndents;
  }

  preprocessChildren(node: LatticeNode): void {
    let nodeIndent = this.getNodeIndents().get(node) || "";
    if (this.candidateNodes.has(node)) {
      nodeIndent = nodeIndent.replace(/->/g, "  ");
      console.log(
        `${nodeIndent}FEATURE TYPE: ${this.candidateNodes.get(node)}`
      );
    }
    const childrenIndent = nodeIndent + "\t->";
    for (const child of node.getChildren()) {
      this.getNodeIndents().set(child, childrenIndent);
    }
  }

  processNode(node: LatticeNode): void {
    const graphNode = new Node(this.getIds().get(node) || "");
    let findNode = this.nodes.findIndex((n) => n.getID() === graphNode.getID());
    if (findNode >= 0) {
      graphNode = this.nodes[findNode];
    } else {
      this.nodes.push(graphNode);
    }
    for (const child of node.getChildren()) {
      let childId = this.getIds().get(child) || "";
      if (!childId) {
        childId = `${++this.globalCounter}`;
        this.getIds().set(child, childId);
      }
      let graphChild = new Node(childId);
      const index = this.nodes.findIndex(
        (n) => n.getID() === graphChild.getID()
      );
      if (index === -1) {
        this.nodes.push(graphChild);
      } else {
        graphChild = this.nodes[index];
      }
      graphNode.addChild(graphChild);
    }

    if (this.candidateNodes.has(node)) {
      super.processNode(node);
      const types = this.candidateNodes.get(node);
      for (const tag of types.featureTags) {
        const nodeType = new NodeFeatureType();
        nodeType.setFeatureTypeName(tag.name.toString());
        if (tag.name !== FeatureTypeName.ADHOC) {
          nodeType.setAnchor(tag.anchorType.getFullyQualifiedName());
          nodeType.setCoverage(tag.anchorTypeBehaviorCoverage);
        }
        graphNode.getTypes().add(nodeType);
      }
      graphNode.setExtent(super.printExtent(node));
      graphNode.setIntent(super.printIntent(node));
      graphNode.setID(
        Objects.hash(super.printExtent(node), super.printIntent(node)) &
          0xfffffff
      );
      console.log(`###########feature ${this.candidateNodes.get(node)}`);
    }
  }

  processVisitedNode(node: LatticeNode): void {
    if (this.candidateNodes.has(node)) {
      super.processVisitedNode(node);
    }
  }
}
