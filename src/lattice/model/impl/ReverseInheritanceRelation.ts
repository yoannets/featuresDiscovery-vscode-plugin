import { RelationBuilder } from "../../../input/RelationBuilder";
import { RelationImpl } from "./RelationImpl";
import { ReverseInheritanceRelationBuilder } from "../../../input/impl/ReverseInheritanceRelationBuilder";
import {
  IMethod,
  Signature,
  JavaModelException,
  IType,
} from "../../../polyfills/eclipse";

export class ReverseInheritanceRelation extends RelationImpl {
  constructor(aBuilder: RelationBuilder) {
    super(aBuilder);
  }

  getAllImages(): Set<any> {
    const relationBuilder =
      this.getRelationBuilder() as ReverseInheritanceRelationBuilder;
    return relationBuilder.getAllMethods() as Set<any>;
  }

  protected printImageObject(obj: any): string {
    const method = obj as IMethod;
    try {
      return Signature.toString(
        method.getSignature(),
        method.getElementName(),
        method.getParameterNames(),
        true,
        true
      );
    } catch (e) {
      console.error(e);
      return "UNPRINTABLE METHOD SIGNATURE";
    }
  }

  protected printDomainObject(key: any): string {
    const type = key as IType;
    try {
      return type.getFullyQualifiedParameterizedName();
    } catch (e) {
      console.error(e);
      return "UNIDENTIFIED_TYPE";
    }
  }
}
