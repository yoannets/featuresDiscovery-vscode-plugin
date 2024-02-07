import { RelationBuilder } from "../../input/RelationBuilder";

export interface Relation {
  addToDomain(anObject: any): void;
  removeFromDomain(anObject: any): void;
  addRelation(key: any, value: any): void;
  removeRelation(key: any, value: any): void;
  getDomain(): Set<any>;
  getImage(domainElement: any): Set<any> | null;
  domainContains(anObject: any): boolean;
  containsRelation(key: any, value: any): boolean;
  getAllImages(): Set<any>;
  getRelationBuilder(): RelationBuilder;
  printString(): string;
}
