import { Token } from "./Token";

export class Input {
  private _tokens: Token[];
  private _index: number;
  private _javaSourceFormat: boolean;

  constructor(input: string, javaSourceFormat: boolean) {
    this._index = 0;
    this._javaSourceFormat = javaSourceFormat;
    this._tokens = this.tokenize(input);
  }

  private tokenize(input: string): Token[] {
    const result: Token[] = [];
    let token = "";

    for (let index = 0; index < input.length; index++) {
      const current = input.charAt(index);

      // If we find a character that is not a valid continuation of the last one
      // let's push the tokens
      if (/[a-zA-Z0-9.]+/.test(current)) {
        // Still a valid character, remember it
        token += current;
      } else {
        // If we already remembered something from previous iterations, push
        if (token !== "") {
          result.push(new Token(token, this._javaSourceFormat));
          token = "";
        }

        // Push the stop character
        result.push(new Token(current, this._javaSourceFormat));
      }
    }

    // Make sure we add any remaining stuff in the buffer
    if (token !== "") {
      result.push(new Token(token, this._javaSourceFormat));
    }

    return result;
  }

  public hasData(): boolean {
    return this._index < this._tokens.length;
  }

  public peek(): Token | null {
    if (this.hasData()) {
      return this._tokens[this._index];
    }
    return null;
  }

  public consume(): Token | null {
    const next = this.peek();
    this._index++;
    return next;
  }
}
