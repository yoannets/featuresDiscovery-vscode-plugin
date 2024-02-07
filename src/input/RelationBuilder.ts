import { Relation } from "../lattice/model/Relation";

export interface RelationBuilder {
  buildRelationFrom(aJavaProject: any): Relation;
}
