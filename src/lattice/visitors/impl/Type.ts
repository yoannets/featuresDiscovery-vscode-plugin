export class Type {
  private _typename: string;
  private _type_is_array: boolean;

  constructor(typename: string, type_is_array?: boolean) {
    this._typename = typename;
    this._type_is_array = type_is_array || false;
  }

  public getTypename(): string {
    return this._typename;
  }

  public isArray(): boolean {
    return this._type_is_array;
  }

  public updateTypeName(new_typename: string): void {
    this._typename = new_typename;
  }

  public isResolved(): boolean {
    return this._typename.charAt(0) !== "Q";
  }
}
