import {
  IMethod,
  IType,
  Signature,
  simpleHash,
} from "../../../polyfills/eclipse";
import { NodeFeatureType } from "../../graph/model/NodeFeatureType";
import { LatticeNode } from "../../model/LatticeNode";
import { Visitor } from "../Visitor";
import { AbstractVisitor } from "./AbstractVisitor";
import { FeatureType, FeatureTypeName } from "./FeatureDetectorVisitor";

export class LatticeGraphGenerator extends AbstractVisitor implements Visitor {
  candidateNodes: Map<LatticeNode, FeatureType>;

  constructor(typedFeatureNodes: Map<LatticeNode, FeatureType>) {
    super();
    this.candidateNodes = typedFeatureNodes;
  }

  processNode(node: LatticeNode): void {
    if (this.candidateNodes.has(node)) {
      const types = this.candidateNodes.get(node);
      const tags = types.featureTags;

      for (const tag of tags) {
        const nodeType = new NodeFeatureType();
        nodeType.setFeatureTypeName(tag.name.toString());

        if (tag.name !== FeatureTypeName.ADHOC) {
          nodeType.setAnchor(tag.anchorType.getFullyQualifiedName());
          nodeType.setCoverage(tag.anchorTypeBehaviorCoverage);
        }

        node.getTypes().push(nodeType);
      }
    } else {
      for (const parent of node.getParents()) {
        parent.getChildren().delete(node);
      }
    }

    const childToRemove: LatticeNode[] = [];
    for (const child of node.getChildren()) {
      if (!this.candidateNodes.has(child)) {
        childToRemove.push(child);
      }
    }

    for (const child of childToRemove) {
      const index = node.getChildren().delete(child);
    }
    const stringExtents = new Set<string>();
    for (const extentElement of node.getExtent()) {
      let extent: string = "";
      try {
        extent = (extentElement as IType).getFullyQualifiedParameterizedName();
      } catch (e) {
        console.error(e);
      }
      stringExtents.add(extent);
    }
    node.setExtent(stringExtents);

    const stringIntents = new Set<string>();
    for (const intentElement of node.getIntent()) {
      let intent: string = "";
      const method: IMethod = intentElement as IMethod;
      try {
        intent = Signature.toString(
          method.getSignature(),
          method.getElementName(),
          method.getParameterNames(),
          true,
          true
        );
      } catch (e) {
        console.error(e);
      }
      stringIntents.add(intent);
    }
    node.setIntent(stringIntents);
    node.setName(
      simpleHash(...node.getExtent(), ...node.getIntent()).toString()
    );
  }
}
