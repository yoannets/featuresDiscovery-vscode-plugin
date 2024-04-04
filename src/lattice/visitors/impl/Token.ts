export class Token {
  private _chars: string;
  private _java_source_format: boolean;

  constructor(chars: string, java_source_format: boolean) {
    this._chars = chars;
    this._java_source_format = java_source_format;
  }

  public getChars(): string {
    return this._chars;
  }

  public isArray(): boolean {
    return this._chars === "[";
  }

  public isGenericSeparator(): boolean {
    if (this._java_source_format) {
      return this._chars === ",";
    } else {
      return this._chars === ";";
    }
  }

  public isGenericStart(): boolean {
    return this._chars === "<";
  }

  public isGenericStop(): boolean {
    return this._chars === ">";
  }

  public isTypeName(): boolean {
    return /[a-zA-Z0-9.]+/.test(this._chars);
  }
}
