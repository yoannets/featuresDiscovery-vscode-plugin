import { NodeFeatureType } from "../../graph/model/NodeFeatureType";
import { LatticeNode } from "../../model/LatticeNode";
import { FeatureType, FeatureTypeName } from "./FeatureDetectorVisitor";
import {
  JAVA_ELEMENT_PRINTER,
  LatticePrettyPrinter,
} from "./LatticePrettyPrinter";
import { Node } from "../../graph/model/Node";
import { simpleHash } from "../../../polyfills/eclipse";

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
    // adding the visited node to list of node graph
    let graphNode = new Node(this.getIds().get(node) || "");
    let findNode = this.nodes.indexOf(graphNode);

    if (findNode >= 0) graphNode = this.nodes[findNode];
    else this.nodes.push(graphNode);

    for (let child of node.getChildren()) {
      // get the id of the child or create it
      let childId = this.getIds().get(child);
      if (childId === null) {
        // hiding the word node to display only the id in the graph node
        childId = "" + this.globalCounter++;
        this.getIds().set(child, childId);
      }

      let graphChild = new Node(childId || "");

      if (!this.nodes.includes(graphChild)) {
        this.nodes.push(graphChild);
      }
      graphNode.addChild(graphChild);
    }

    // check if candidate node:
    if (this.candidateNodes.has(node)) {
      // then call inherited version
      super.processNode(node);
      // assign the type, extent and intent of the node

      let types = this.candidateNodes.get(node);
      let tags = types!.featureTags;
      for (let tag of tags) {
        let nodeType = new NodeFeatureType();
        nodeType.setFeatureTypeName(tag.name.toString());

        if (tag.name !== FeatureTypeName.ADHOC) {
          nodeType.setAnchor(tag.anchorType!.getFullyQualifiedName());
          nodeType.setCoverage(tag.anchorTypeBehaviorCoverage);
        }

        graphNode.getTypes().push(nodeType);
      }

      graphNode.setExtent(super.printExtent(node));
      graphNode.setIntent(super.printIntent(node));
      graphNode.setID(
        simpleHash(super.printExtent(node), super.printIntent(node))
      );

      console.log("###########feature " + this.candidateNodes.get(node));
    }
  }

  processVisitedNode(node: LatticeNode): void {
    if (this.candidateNodes.has(node)) {
      super.processVisitedNode(node);
    }
  }
}
