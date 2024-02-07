import { IMethod, IType } from "your-eclipse-jdt-core-module"; // Assurez-vous d'importer correctement ces types depuis votre module Eclipse JDT Core.

export class DelegationRecord {
  private mainType: IType;
  private mainTypeDomainInterface: IMethod[];
  private fieldName: string;
  private fieldType: IType;
  private fieldDomainInterface: IMethod[];
  private coveragePercentage: number;
  private perfectDelegationCase: boolean;

  constructor(
    mainType: IType,
    typeDomInterface: IMethod[],
    fName: string,
    fType: IType,
    fDomInterface: IMethod[]
  ) {
    this.mainType = mainType;
    this.mainTypeDomainInterface = typeDomInterface;
    this.fieldName = fName;
    this.fieldType = fType;
    this.fieldDomainInterface = fDomInterface;
  }

  public getCoveragePercentage(): number {
    return this.coveragePercentage;
  }

  public setCoveragePercentage(coveragePercentage: number): void {
    this.coveragePercentage = coveragePercentage;
  }

  public isPerfectDelegationCase(): boolean {
    return this.perfectDelegationCase;
  }

  public setPerfectDelegationCase(perfectDelegationCase: boolean): void {
    this.perfectDelegationCase = perfectDelegationCase;
  }

  public getMainType(): IType {
    return this.mainType;
  }

  public getMainTypeDomainInterface(): IMethod[] {
    return this.mainTypeDomainInterface;
  }

  public getFieldName(): string {
    return this.fieldName;
  }

  public getFieldType(): IType {
    return this.fieldType;
  }

  public getFieldDomainInterface(): IMethod[] {
    return this.fieldDomainInterface;
  }

  public toString(): string {
    let printable = `Delegation candidate with percentage coverage: ${this.coveragePercentage}\n`;
    printable += `\tClass: ${this.mainType.getFullyQualifiedName()}\n`;
    printable += `\tAttribute: ${
      this.fieldName
    } with type: ${this.fieldType.getFullyQualifiedName()}\n`;
    printable += `\t\t and domain interface:`;
    for (let i = 0; i < this.fieldDomainInterface.length; i++) {
      printable += `${this.fieldDomainInterface[i]}, `;
    }
    return printable;
  }
}
