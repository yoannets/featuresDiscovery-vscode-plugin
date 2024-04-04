export interface IAdaptable {
  getAdapter(adapter: any): any;
}

export interface IPropertyDescriptor {
  name: string;
  displayName: string;
  description?: string;
  category?: string;

  getName(): string;
  getDisplayName(): string;
  getDescription(): string;
  getCategory(): string;
}

export class PropertyDescriptor implements IPropertyDescriptor {
  constructor(
    public name: string,
    public displayName: string,
    public description?: string,
    public category?: string
  ) {}

  getName(): string {
    return this.name;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  getDescription(): string {
    return this.description || "";
  }

  getCategory(): string {
    return this.category || "";
  }
}

export interface IPropertySource {
  propertyDescriptors: IPropertyDescriptor[];
  properties: Map<string, any>;

  getPropertyDescriptors(): IPropertyDescriptor[];
  getPropertyValue(propertyId: string): any;
  isPropertySet(propertyId: string): boolean;
  resetPropertyValue(propertyId: string): void;
  setPropertyValue(propertyId: string, value: any): void;
}

export class PropertySource implements IPropertySource {
  propertyDescriptors: IPropertyDescriptor[] = [];
  properties: Map<string, any> = new Map<string, any>();

  getPropertyDescriptors(): IPropertyDescriptor[] {
    return this.propertyDescriptors;
  }

  getPropertyValue(propertyId: string): any {
    return this.properties.get(propertyId);
  }

  isPropertySet(propertyId: string): boolean {
    return this.properties.has(propertyId);
  }

  resetPropertyValue(propertyId: string): void {
    this.properties.delete(propertyId);
  }

  setPropertyValue(propertyId: string, value: any): void {
    this.properties.set(propertyId, value);
  }
}

export interface IMethod {
  name: string;
  returnType: IType;
  parameters: IParameter[];

  getName(): string;
  getReturnType(): IType;
  getParameters(): IParameter[];
  getSignature(): string;
  getElementName(): string;
  getParameterNames(): string[];
}

export interface IParameter {
  name: string;
  type: IType;
}

export interface IType {
  fullyQualifiedName: string;
  methods: IMethod[];
  resolveType(typeName: string): string[][] | null;
  getElementName(): string;
  newTypeHierarchy(monitor: IProgressMonitor | null): ITypeHierarchy;
  getFullyQualifiedName(): string;
  getFullyQualifiedParameterizedName(): string;
}
export interface IProgressMonitor {
  beginTask(taskName: string, totalWork: number): void;
  done(): void;
  isCanceled(): boolean;
  setCanceled(value: boolean): void;
  setTaskName(taskName: string): void;
  subTask(subTaskName: string): void;
  worked(work: number): void;
}

export class JavaModelException {
  constructor(public message: string) {}
}

export class Signature {
  static toString(
    signature: string,
    methodName: string,
    parameterNames: string[],
    fullyQualifiedName: boolean,
    includeReturnType: boolean
  ): string {
    // Découper la signature pour obtenir les types des paramètres et le type de retour
    const regex = /\((.*)\)(.*)/;
    const match = signature.match(regex);
    if (!match) {
      throw new Error("Invalid signature format");
    }

    const paramTypes = match[1]
      .split(";")
      .map((type) => this.getTypeName(type, fullyQualifiedName));
    const returnType = this.getTypeName(match[2], fullyQualifiedName);

    let result = "";

    if (includeReturnType) {
      result += `${returnType} `;
    }

    result += `${methodName}(`;

    // Ajouter les noms des paramètres à 'result'
    result += paramTypes
      .map((type, index) => `${type} ${parameterNames[index] || "arg" + index}`)
      .join(", ");

    result += ")";

    return result;
  }

  private static getTypeName(
    typeSignature: string,
    fullyQualifiedName: boolean
  ): string {
    // Ici, vous devez implémenter la logique pour convertir les signatures de type Java
    // en noms de types lisibles, en tenant compte de `fullyQualifiedName`.
    // Cela peut être assez complexe, car vous devez gérer différents cas comme les types primitifs,
    // les tableaux, les types génériques, etc.
    // Pour simplifier, je vais seulement montrer un traitement basique ici :

    typeSignature = typeSignature.trim();

    if (typeSignature.endsWith(";")) {
      typeSignature = typeSignature.substring(0, typeSignature.length - 1);
    }

    if (typeSignature.startsWith("L") && fullyQualifiedName) {
      // Enlever le 'L' initial et remplacer '/' par '.'
      return typeSignature.substring(1).replace(/\//g, ".");
    } else if (typeSignature.startsWith("L")) {
      // Prendre uniquement le nom simple de la classe
      return typeSignature.substring(typeSignature.lastIndexOf("/") + 2);
    }

    // Ajouter la gestion des autres cas (types primitifs, tableaux, génériques, etc.)

    return typeSignature; // Retourner la signature telle quelle si non gérée
  }
}

export class MethodEntry {
  // Implémentez ici les détails de la classe MethodEntry
}

export interface IJavaProject {
  project: any;
  packageFragmentRoots: IPackageFragment[];

  getProject(): any;
  getPackageFragmentRoots(): IPackageFragment[];
}

export interface IPackageFragment {
  elementName: string;
  compilationUnits: ICompilationUnit[];

  getElementName(): string;
  getCompilationUnits(): ICompilationUnit[];
}

export interface ICompilationUnit {
  types: IType[];

  getTypes(): IType[];
}

export interface ITypeHierarchy {
  getRoot(): IType;
  getSubtypes(type: IType): IType[];
  getSuperTypes(type: IType): IType[];
  contains(type: IType): boolean;
  commonSuperType(types: IType[]): IType | null;
  getAllSupertypes(IType: IType): IType[];
}

export class NullProgressMonitor implements IProgressMonitor {
  private _isCanceled: boolean;

  constructor() {
    this._isCanceled = false;
  }

  setTaskName(taskName: string): void {
    throw new Error("Method not implemented.");
  }

  public beginTask(name: string, totalWork: number): void {
    // Ne fait rien car c'est un moniteur de progression nul
  }

  public done(): void {
    // Ne fait rien car c'est un moniteur de progression nul
  }

  public isCanceled(): boolean {
    return this._isCanceled;
  }

  public setCanceled(value: boolean): void {
    this._isCanceled = value;
  }

  public subTask(name: string): void {
    // Ne fait rien car c'est un moniteur de progression nul
  }

  public worked(work: number): void {
    // Ne fait rien car c'est un moniteur de progression nul
  }
}

export function simpleHash(...args: string[]): number {
  let hash = 0;
  for (let arg of args) {
    for (let i = 0; i < arg.length; i++) {
      const char = arg.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
  }
  return hash & 0xfffffff;
}
