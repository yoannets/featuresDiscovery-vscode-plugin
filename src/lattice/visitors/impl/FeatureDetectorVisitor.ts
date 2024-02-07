import { Visitor } from "../Visitor";
import { LatticeNode } from "../../model/LatticeNode";
import { ReverseInheritanceRelationBuilder } from "../../../input/impl/ReverseInheritanceRelationBuilder";
import {
  IType,
  IField,
  IMethod,
  ITypeHierarchy,
  JavaModelException,
} from "eclipse";

export enum FeatureTypeName {
  ADHOC = "ADHOC",
  FULL_EXTENT_FULL_BEHAVIOR_EXPLICIT_INTERFACE_IMPLEMENTATIONS = "FULL_EXTENT_FULL_BEHAVIOR_EXPLICIT_INTERFACE_IMPLEMENTATIONS",
  PARTIAL_EXTENT_FULL_BEHAVIOR_EXPLICIT_INTERFACE_IMPLEMENTATIONS = "PARTIAL_EXTENT_FULL_BEHAVIOR_EXPLICIT_INTERFACE_IMPLEMENTATIONS",
  FULL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_INTERFACE_IMPLEMENTATIONS = "FULL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_INTERFACE_IMPLEMENTATIONS",
  PARTIAL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_INTERFACE_IMPLEMENTATIONS = "PARTIAL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_INTERFACE_IMPLEMENTATIONS",
  FULL_EXTENT_FULL_BEHAVIOR_EXPLICIT_AGGREGATIONS = "FULL_EXTENT_FULL_BEHAVIOR_EXPLICIT_AGGREGATIONS",
  PARTIAL_EXTENT_FULL_BEHAVIOR_EXPLICIT_AGGREGATIONS = "PARTIAL_EXTENT_FULL_BEHAVIOR_EXPLICIT_AGGREGATIONS",
  FULL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_AGGREGATIONS = "FULL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_AGGREGATIONS",
  PARTIAL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_AGGREGATIONS = "PARTIAL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_AGGREGATIONS",
  FULL_EXTENT_FULL_BEHAVIOR_EXPLICIT_CLASS_SUBCLASS_REDEFINITIONS = "FULL_EXTENT_FULL_BEHAVIOR_EXPLICIT_CLASS_SUBCLASS_REDEFINITIONS",
  PARTIAL_EXTENT_FULL_BEHAVIOR_EXPLICIT_CLASS_SUBCLASS_REDEFINITIONS = "PARTIAL_EXTENT_FULL_BEHAVIOR_EXPLICIT_CLASS_SUBCLASS_REDEFINITIONS",
  FULL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_CLASS_SUBCLASS_REDEFINITIONS = "FULL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_CLASS_SUBCLASS_REDEFINITIONS",
  PARTIAL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_CLASS_SUBCLASS_REDEFINITIONS = "PARTIAL_EXTENT_PARTIAL_BEHAVIOR_EXPLICIT_CLASS_SUBCLASS_REDEFINITIONS",
}

export class FeatureTypeTag {
  name: FeatureTypeName;
  configurationBehaviorCoverage: number;
  anchorTypeBehaviorCoverage: number;
  anchorType?: IType;
  relatedTypes?: IType[];

  constructor(
    name: FeatureTypeName,
    anchorType?: IType,
    anchorTypeBehaviorCoverage?: number,
    relatedTypes?: IType[],
    configurationBehaviorCoverage?: number
  ) {
    this.name = name;
    this.configurationBehaviorCoverage = configurationBehaviorCoverage || 0;
    this.anchorTypeBehaviorCoverage = anchorTypeBehaviorCoverage || 0;
    this.anchorType = anchorType;
    this.relatedTypes = relatedTypes;
  }

  toString(): string {
    let output = this.name.toString();

    if (this.anchorType) {
      output += `; ANCHOR: [${this.anchorType.getElementName()}]`;
      output += `; ANCHOR TYPE BEHAVIOR COVERAGE: [${this.anchorTypeBehaviorCoverage}]`;
    }

    if (this.configurationBehaviorCoverage > 0) {
      output += `; CONFIGURATION BEHAVIOR COVERAGE: [${this.configurationBehaviorCoverage}]`;
    }

    if (this.relatedTypes) {
      output += `; RELATED TYPES: ${this.printStringRelatedTypes()}`;
    }

    return output;
  }

  private printStringRelatedTypes(): string {
    const printStrings = (this.relatedTypes || [])
      .map((type) => type.getElementName())
      .join(", ");
    return `[${printStrings}]`;
  }
}

export class FeatureType {
  featureTags: FeatureTypeTag[];

  constructor(tag?: FeatureTypeTag) {
    this.featureTags = tag ? [tag] : [];
  }

  toString(): string {
    return this.featureTags.map((tag) => tag.toString()).join(" ## ");
  }
}

export class FeatureDetectorVisitor implements Visitor {
  private relationBuilder: ReverseInheritanceRelationBuilder;
  private candidateFeatureNodes: Map<LatticeNode, FeatureType>;

  constructor(builder: ReverseInheritanceRelationBuilder) {
    this.relationBuilder = builder;
    this.candidateFeatureNodes = new Map<LatticeNode, FeatureType>();
  }

  processNode(node: LatticeNode): void {
    const currentNodeExtentSize = node.extent.size;
    if (currentNodeExtentSize > 1) {
      let isCandidate = true;
      for (const child of node.children) {
        if (child.extent.size === currentNodeExtentSize) {
          isCandidate = false;
          break;
        }
      }
      if (isCandidate && node.intent.size > 0) {
        this.addCandidateFeatureNode(node, this.classifyFeature(node));
      }
    }
  }

  classifyFeature(candidateFeatureNode: LatticeNode): FeatureType {
    const featureType = new FeatureType();
    this.findInterfaceImplementationTags(candidateFeatureNode, featureType);
    this.findClassSubclassRedefinitionTags(candidateFeatureNode, featureType);
    this.findAggregationTags(candidateFeatureNode, featureType);
    if (featureType.featureTags.length === 0) {
      featureType.featureTags.push(new FeatureTypeTag(FeatureTypeName.ADHOC));
    }
    return featureType;
  }

  findAggregationTags(
    candidateFeatureNode: LatticeNode,
    featureType: FeatureType
  ): void {
    // Implement aggregation tag finding logic
  }

  findInterfaceImplementationTags(
    candidateFeatureNode: LatticeNode,
    featureType: FeatureType
  ): void {
    // Implement interface implementation tag finding logic
  }

  findClassSubclassRedefinitionTags(
    candidateFeatureNode: LatticeNode,
    featureType: FeatureType
  ): void {
    // Implement class-subclass redefinition tag finding logic
  }

  commonBehaviorBetweenAnchorAndRelatedTypes(
    componentType: IType,
    relatedTypes: IType[]
  ): IMethod[] {
    // Implement common behavior logic
    return [];
  }

  addCandidateFeatureNode(e: LatticeNode, type: FeatureType): void {
    this.candidateFeatureNodes.set(e, type);
  }

  containsCandidateFeatureNode(o: LatticeNode): boolean {
    return this.candidateFeatureNodes.has(o);
  }

  removeCandidateFeatureNode(o: LatticeNode): FeatureType | undefined {
    const removedType = this.candidateFeatureNodes.get(o);
    this.candidateFeatureNodes.delete(o);
    return removedType;
  }

  getCandidateFeatureNodes(): Map<LatticeNode, FeatureType> {
    return this.candidateFeatureNodes;
  }
}
