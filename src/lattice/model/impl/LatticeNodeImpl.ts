import { LatticeNode } from "../LatticeNode";
import { Direction, Visitor } from "../../visitors/Visitor";
import { NodeFeatureType } from "../../graph/model/NodeFeatureType";
import { simpleHash } from "../../../polyfills/eclipse";

export class LatticeNodeImpl implements LatticeNode {
  private name: string;
  intent: Set<any>;
  extent: Set<any>;
  parents: Set<LatticeNode>;
  children: Set<LatticeNode>;
  private types: NodeFeatureType[];

  constructor() {
    this.intent = new Set<any>();
    this.extent = new Set<any>();
    this.parents = new Set<LatticeNode>();
    this.children = new Set<LatticeNode>();
    this.types = [];
  }

  setIntent(intent: Set<any>) {
    this.intent = intent;
  }

  setExtent(extent: Set<any>) {
    this.extent = extent;
  }

  getExtent(): Set<any> {
    return this.extent;
  }

  addToExtent(anObject: any): void {
    this.extent.add(anObject);
  }

  removeFromExtent(anObject: any): void {
    this.extent.delete(anObject);
  }

  removeFromIntent(anObject: any): void {
    this.intent.delete(anObject);
  }

  addToIntent(anObject: any): void {
    this.intent.add(anObject);
  }

  getIntent(): Set<any> {
    return this.intent;
  }

  getParents(): Set<LatticeNode> {
    return this.parents;
  }

  getChildren(): Set<LatticeNode> {
    return this.children;
  }

  addChild(childNode: LatticeNode): void {
    this.children.add(childNode);
  }

  setTypes(types: NodeFeatureType[]): void {
    this.types = types;
  }

  getTypes(): NodeFeatureType[] {
    return this.types;
  }

  addParent(parentNode: LatticeNode): void {
    this.parents.add(parentNode);
  }

  removeChild(childNode: LatticeNode): void {
    this.children.delete(childNode);
  }

  removeParent(parentNode: LatticeNode): void {
    this.parents.delete(parentNode);
  }

  acceptVisitor(aVisitor: Visitor, direction: Direction): void {
    aVisitor.visitLatticeNode(this, direction);
  }

  addCollectionToExtent(objects: any[]): void {
    objects.forEach((obj) => this.extent.add(obj));
  }

  addCollectionToIntent(properties: any[]): void {
    properties.forEach((prop) => this.intent.add(prop));
  }

  hasParent(parentNode: LatticeNode): boolean {
    return this.parents.has(parentNode);
  }

  hasChild(childNode: LatticeNode): boolean {
    return this.children.has(childNode);
  }

  copy(): LatticeNode {
    const copy = new LatticeNodeImpl();
    copy.addCollectionToExtent(Array.from(this.extent));
    copy.addCollectionToIntent(Array.from(this.intent));
    return copy;
  }

  takePlaceOf(another: LatticeNode): void {
    another.getChildren().forEach((child) => {
      this.addChild(child);
      child.addParent(this);

      another.removeChild(child);
      child.removeParent(another);
    });

    another.getParents().forEach((parent) => {
      this.addParent(parent);
      parent.addChild(this);

      another.removeParent(parent);
      parent.removeChild(another);
    });
  }

  hashCode(): number {
    return simpleHash(...this.extent, ...this.intent);
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}
