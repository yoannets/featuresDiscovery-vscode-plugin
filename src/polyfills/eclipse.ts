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
  // Implémentez ici les détails de la classe Signature
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
}
