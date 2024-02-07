class NodeFeatureType {
  featureTypeName: string = "";
  anchor: string = "";
  coverage: number = 0;
}

class FeatureTypeTag {
  name: string = "";
  anchorType: string = "";
  anchorTypeBehaviorCoverage: number = 0;
}

class FeatureType {
  featureTags: FeatureTypeTag[] = [];
}

class LatticeNode {
  extent: string[] = [];
  intent: string[] = [];
  types: NodeFeatureType[] = [];
  children: LatticeNode[] = [];
  parents: LatticeNode[] = [];
  name: string = "";

  constructor(extent: string[], intent: string[]) {
    this.extent = extent;
    this.intent = intent;
  }
}

class LatticeGraphGenerator {
  candidateNodes: Map<LatticeNode, FeatureType>;

  constructor(typedFeatureNodes: Map<LatticeNode, FeatureType>) {
    this.candidateNodes = typedFeatureNodes;
  }

  processNode(node: LatticeNode): void {
    if (this.candidateNodes.has(node)) {
      const types = this.candidateNodes.get(node)!;
      const tags = types.featureTags;

      for (const tag of tags) {
        const nodeType = new NodeFeatureType();
        nodeType.featureTypeName = tag.name;

        if (tag.name !== "ADHOC") {
          nodeType.anchor = tag.anchorType;
          nodeType.coverage = tag.anchorTypeBehaviorCoverage;
        }

        node.types.push(nodeType);
      }
    } else {
      for (const parent of node.parents) {
        const index = parent.children.indexOf(node);
        if (index !== -1) {
          parent.children.splice(index, 1);
        }
      }
    }

    const childToRemove: LatticeNode[] = [];
    for (const child of node.children) {
      if (!this.candidateNodes.has(child)) {
        childToRemove.push(child);
      }
    }

    for (const child of childToRemove) {
      const index = node.children.indexOf(child);
      if (index !== -1) {
        node.children.splice(index, 1);
      }
    }

    node.extent = node.extent.map((extentElement) => {
      let extent = "";
      try {
        extent = extentElement;
      } catch (e) {
        console.error(e);
      }
      return extent;
    });

    node.intent = node.intent.map((intentElement) => {
      let intent = "";
      try {
        intent = intentElement;
      } catch (e) {
        console.error(e);
      }
      return intent;
    });

    node.name = String(
      Objects.hash(node.extent.join(), node.intent.join()) & 0xfffffff
    );
  }
}
