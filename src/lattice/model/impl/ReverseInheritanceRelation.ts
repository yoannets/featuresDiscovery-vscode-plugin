import { RelationBuilder } from "../../../input/RelationBuilder";
import { IMethod, IType, JavaModelException } from "your-eclipse-jdt-core-path";
import { RelationImpl } from "./RelationImpl";

export class ReverseInheritanceRelation extends RelationImpl {
  constructor(aBuilder: RelationBuilder) {
    super(aBuilder);
  }

  getAllImages(): Set<Object> {
    const relationBuilder =
      this.getRelationBuilder() as ReverseInheritanceRelationBuilder;
    return relationBuilder.getAllMethods() as Set<Object>;
  }

  protected printImageObject(obj: Object): string {
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
      if (e instanceof JavaModelException) {
        console.error(e);
        return "UNPRINTABLE METHOD SIGNATURE (Java Model Exception)";
      } else {
        throw e;
      }
    }
  }

  protected printDomainObject(key: Object): string {
    const type = key as IType;
    try {
      return type.getFullyQualifiedParameterizedName();
    } catch (e) {
      if (e instanceof JavaModelException) {
        console.error(e);
        return "UNIDENTIFIED_TYPE (JavaModelException)";
      } else {
        throw e;
      }
    }
  }
}
