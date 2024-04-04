import { NodeFeatureType } from "../../graph/model/NodeFeatureType";
import { LatticeNode } from "../../model/LatticeNode";
import { FeatureType, FeatureTypeName } from "./FeatureDetectorVisitor";
import {
  JAVA_ELEMENT_PRINTER,
  LatticePrettyPrinter,
} from "./LatticePrettyPrinter";
import { Node } from "../../graph/model/Node";
import { simpleHash } from "../../../polyfills/eclipse";

/**
 * this visitor pretty prints the candidate nodes in a lattice. It starts from either the top (increasing intent/feature size,
 * and decreasing extent/occurrences) or the bottom (decreasing feature/intent size, increasing extent/occurrences number) and
 * only prints the contents of the candidate nodes. This provides a hierarchical printout of candidate features that is easier to read
 * than a simple list.
 *
 * The difference between this visitor and the pretty printer:
 * 1) we only print non-visited AND candidate nodes
 * 2) non-candidate nodes are skipped
 * 3) candidate nodes that are already visited: we print the Node_ID
 * 4) we override the preprocessChildren() method so that it does not print anything since there may be several
 * levels between two consecutive candidate nodes. We will increment the indents to gives us an idea, but we
 * won't print "ITS CHILDREN:================="
 *
 * @author Hafedh
 *
 */
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

  setNodes(nodes: Node[]): void {
    this.nodes = nodes;
  }

  preprocessChildren(node: LatticeNode): void {
    let nodeIndent = this.getNodeIndents().get(node);

    if (typeof nodeIndent !== "string") {
      nodeIndent = "";
      this.getNodeIndents().set(node, nodeIndent);
    }

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
