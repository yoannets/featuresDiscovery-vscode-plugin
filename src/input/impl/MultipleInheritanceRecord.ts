export class MultipleInheritanceRecord {
  private extendsTypes: string[] = [];
  private implementsInterfaces: string[] = [];
  private name: string;

  constructor(className: string, superTypes?: string[], impTypes?: string[]) {
    this.name = className;
    if (superTypes) {
      this.extendsTypes = superTypes;
    }
    if (impTypes) {
      this.implementsInterfaces = impTypes;
    }
  }

  public addSupertype(type: string): void {
    this.extendsTypes.push(type);
  }

  public addAllSupertypes(types: string[]): void {
    this.extendsTypes.push(...types);
  }

  public removeSupertype(type: string): void {
    const index = this.extendsTypes.indexOf(type);
    if (index !== -1) {
      this.extendsTypes.splice(index, 1);
    }
  }

  public numberSupertypes(): number {
    return this.extendsTypes.length;
  }

  public addImplementedInterface(type: string): void {
    this.implementsInterfaces.push(type);
  }

  public addAllImplementationInterfaces(types: string[]): void {
    this.implementsInterfaces.push(...types);
  }

  public removeImplementedInterface(type: string): void {
    const index = this.implementsInterfaces.indexOf(type);
    if (index !== -1) {
      this.implementsInterfaces.splice(index, 1);
    }
  }

  public numberImplementedInterfaces(): number {
    return this.implementsInterfaces.length;
  }

  public getName(): string {
    return this.name;
  }

  public getSuperTypes(): string[] {
    return [...this.extendsTypes];
  }

  public getImplementedTypes(): string[] {
    return [...this.implementsInterfaces];
  }
}
