// @TODO: Fixe eclipse types
import { Relation } from "../../lattice/model/Relation";
import {
  IJavaProject,
  MethodEntry,
  IType,
  IMethod,
  IPackageFragment,
  ICompilationUnit,
} from "../../polyfills/eclipse";
import { RelationBuilder } from "../RelationBuilder";

export class ReverseInheritanceRelationBuilder implements RelationBuilder {
  private javaProject: IJavaProject | null;
  private methodImplementations: Map<string, MethodEntry>;
  private definedTypes: Set<IType> | null;
  private localDomainInterfaces: Map<IType, IMethod[]> | null;
  private subhierarchyDomainInterfaces: Map<IType, IMethod[]> | null;

  constructor() {
    this.javaProject = null;
    this.methodImplementations = new Map<string, MethodEntry>();
    this.definedTypes = null;
    this.localDomainInterfaces = null;
    this.subhierarchyDomainInterfaces = null;
  }

  public getJavaProject(): IJavaProject | null {
    return this.javaProject;
  }

  public getMethodImplementations(): Map<string, MethodEntry> {
    return this.methodImplementations;
  }

  public getDefinedTypes(): Set<IType> | null {
    return this.definedTypes;
  }

  public getLocalDomainInterfaces(): Map<IType, IMethod[]> | null {
    return this.localDomainInterfaces;
  }

  public setLocalDomainInterfaces(
    localDomainInterfaces: Map<IType, IMethod[]>
  ): void {
    this.localDomainInterfaces = localDomainInterfaces;
  }

  public getSubhierarchyDomainInterfaces(): Map<IType, IMethod[]> | null {
    return this.subhierarchyDomainInterfaces;
  }

  public setSubhierarchyDomainInterfaces(
    subhierarchyDomainInterfaces: Map<IType, IMethod[]>
  ): void {
    this.subhierarchyDomainInterfaces = subhierarchyDomainInterfaces;
  }

  public getAllMethods(): Set<IMethod> {
    const allMethods = new Set<IMethod>();
    for (const [_, entry] of this.methodImplementations) {
      allMethods.add(entry.method);
    }
    return allMethods;
  }

  public buildRelationFrom(aProject: IProject): Relation | null {
    try {
      if (!aProject.hasNature(JavaCore.NATURE_ID)) return null;

      this.javaProject = JavaCore.create(aProject);
      this.definedTypes = new Set<IType>();
      let numberCompilationUnits = 0;

      const packages: IPackageFragment[] =
        this.javaProject.getPackageFragments();
      for (const myPackage of packages) {
        if (myPackage.getKind() === IPackageFragmentRoot.K_SOURCE) {
          const compUnits: ICompilationUnit[] = myPackage.getCompilationUnits();
          for (const compUnit of compUnits) {
            numberCompilationUnits++;
            const compUnitTypes: IType[] = compUnit.getAllTypes();
            for (const nextType of compUnitTypes) {
              this.definedTypes.add(nextType);
            }
            console.log(
              "processing compilation unit: " + compUnit.getElementName()
            );
          }
        }
      }

      console.log(
        "Project " +
          aProject.getName() +
          " has : " +
          numberCompilationUnits +
          " compilation units, and " +
          this.definedTypes.size +
          " defined types"
      );

      const unpurgedDomainInterfaces: Map<IType, IMethod[]> = new Map<
          IType,
          IMethod[]
        >(),
        purgedDomainInterfaces: Map<IType, IMethod[]> = new Map<
          IType,
          IMethod[]
        >();

      const excludeAccessors = false;
      for (const type of this.definedTypes) {
        const typeLocalDomainInterface = this.localDomainInterface(
          this.definedTypes,
          type,
          excludeAccessors
        );
        if (typeLocalDomainInterface === null) {
          console.log("Type " + type + " has null domain interface");
        }
        unpurgedDomainInterfaces.set(type, typeLocalDomainInterface);
      }

      for (const type of unpurgedDomainInterfaces.keys()) {
        const typeLocalDomainInterface = unpurgedDomainInterfaces.get(type);
        if (typeLocalDomainInterface !== null) {
          purgedDomainInterfaces.set(type, typeLocalDomainInterface);
        }
      }

      this.setLocalDomainInterfaces(purgedDomainInterfaces);

      const image = this.buildImagesFrom(purgedDomainInterfaces);
      const cumulativeDomainInterfaces = this.cumulativeDomainInterfaces(
        purgedDomainInterfaces
      );
      this.setSubhierarchyDomainInterfaces(cumulativeDomainInterfaces);

      console.log(
        "ReverseInheritanceRelationBuilder.buildRelationFrom: Done building images"
      );
      console.log(
        "ReverseInheritanceRelationBuilder.buildRelationFrom: Done building relation"
      );
      return image;
    } catch (e) {
      console.log("Caught exception: " + e);
      e.printStackTrace();
      return null;
    }
  }

  private localDomainInterface(
    types: Set<IType>,
    theType: IType,
    excludeAccessors: boolean
  ): IMethod[] | null {
    const typeMethods: IMethod[] = theType.getMethods();

    const resultMethods: IMethod[] = [];
    for (const method of typeMethods) {
      if (excludeAccessors && this.isAccessor(method)) continue;
      resultMethods.push(method);
    }

    return resultMethods.length > 0 ? resultMethods : null;
  }

  private isAccessor(method: IMethod): boolean {
    const name = method.getElementName();
    return name.startsWith("get") || name.startsWith("set");
  }

  private cumulativeDomainInterfaces(
    purgedDomainInterfaces: Map<IType, IMethod[]>
  ): Map<IType, IMethod[]> {
    const cumulativeDomainInterfaces: Map<IType, IMethod[]> = new Map<
      IType,
      IMethod[]
    >();

    for (const currentType of purgedDomainInterfaces.keys()) {
      const typeCumulativeDomainInterface: IMethod[] = [];
      const currentTypeMethods = purgedDomainInterfaces.get(currentType);

      if (currentTypeMethods !== undefined) {
        typeCumulativeDomainInterface.push(...currentTypeMethods);
        const supertypes = currentType
          .newSupertypeHierarchy(null)
          .getAllSupertypes(currentType);
        for (const st of supertypes) {
          const domainMethods = purgedDomainInterfaces.get(st);
          if (domainMethods !== undefined) {
            typeCumulativeDomainInterface.push(...domainMethods);
          }
        }
      }

      cumulativeDomainInterfaces.set(
        currentType,
        typeCumulativeDomainInterface
      );
    }

    return cumulativeDomainInterfaces;
  }

  private buildImagesFrom(
    purgedDomainInterfaces: Map<IType, IMethod[]>
  ): Relation {
    const image = new Relation();
    for (const currentType of purgedDomainInterfaces.keys()) {
      const typeCumulativeDomainInterface =
        purgedDomainInterfaces.get(currentType);
      if (typeCumulativeDomainInterface !== undefined) {
        for (const method of typeCumulativeDomainInterface) {
          const methodEntry = new MethodEntry(currentType, method);
          this.methodImplementations.set(method.toString(), methodEntry);
          image.put(method, currentType);
        }
      }
    }
    return image;
  }
}
