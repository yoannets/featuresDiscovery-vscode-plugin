import { Visitor } from "your-visitor-path"; // Assurez-vous d'importer correctement Visitor depuis votre module

interface LatticeNode {
  getExtent(): Set<any>;
  addToExtent(anObject: any): void;
  addCollectionToExtent(objects: Collection<any>): void;
  addCollectionToIntent(properties: Collection<any>): void;
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
  acceptVisitor(aVisitor: Visitor, direction: VisitorDirection): void;
  copy(): LatticeNode;
  takePlaceOf(another: LatticeNode): void;
  setIntent(intent: Set<any>): void;
  setExtent(extent: Set<any>): void;
  getName(): string;
  setName(name: string): void;
  getTypes(): Array<NodeFeatureType>;
  setTypes(types: Array<NodeFeatureType>): void;
}
