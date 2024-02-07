import { NodeFeatureType } from "../graph/model/NodeFeatureType";
import { Visitor, Direction } from "../visitors/Visitor";

export interface LatticeNode {
  parents: Set<LatticeNode>;
  children: Set<LatticeNode>;
  getExtent(): Set<any>;
  addToExtent(anObject: any): void;
  addCollectionToExtent(objects: Array<any>): void;
  addCollectionToIntent(properties: Array<any>): void;
  removeFromExtent(anObject: any): void;
  removeFromIntent(anObject: any): void;
  addToIntent(anObject: any): void;
  getIntent(): Set<any>;
  getParents(): Set<LatticeNode>;
  getChildren(): Set<LatticeNode>;
  addChild(childNode: LatticeNode): void;
  addParent(parentNode: LatticeNode): void;
  removeChild(childNode: LatticeNode): void;
  hasParent(parentNode: LatticeNode): boolean;
  hasChild(childNode: LatticeNode): boolean;
  removeParent(parentNode: LatticeNode): void;
  acceptVisitor(aVisitor: Visitor, direction: Direction): void;
  copy(): LatticeNode;
  takePlaceOf(another: LatticeNode): void;
  setIntent(intent: Set<any>): void;
  setExtent(extent: Set<any>): void;
  getName(): string;
  setName(name: string): void;
  getTypes(): Array<NodeFeatureType>;
  setTypes(types: Array<NodeFeatureType>): void;
}
