import { LatticeNode } from "../LatticeNode";
import { Direction, Visitor } from "../../visitors/Visitor";
import { NodeFeatureType } from "../../graph/model/NodeFeatureType";

export class LatticeNodeImpl implements LatticeNode {
  private name: string;
  private intent: Set<Object>;
  private extent: Set<Object>;
  parents: Set<LatticeNode>;
  children: Set<LatticeNode>;
  private types: NodeFeatureType[];

  constructor() {
    this.intent = new Set<Object>();
    this.extent = new Set<Object>();
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

  getExtent(): Set<Object> {
    return this.extent;
  }

  addToExtent(anObject: Object): void {
    this.extent.add(anObject);
  }

  removeFromExtent(anObject: Object): void {
    this.extent.delete(anObject);
  }

  removeFromIntent(anObject: Object): void {
    this.intent.delete(anObject);
  }

  addToIntent(anObject: Object): void {
    this.intent.add(anObject);
  }

  getIntent(): Set<Object> {
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

  addCollectionToExtent(objects: Object[]): void {
    objects.forEach((obj) => this.extent.add(obj));
  }

  addCollectionToIntent(properties: Object[]): void {
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
    return Math.abs(this.extent.size * 31 + this.intent.size);
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }
}
