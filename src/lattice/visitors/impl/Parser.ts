import { Input } from "./Input";
import { Token } from "./Token";
import { Type } from "./Type";

export class Parser {
  private _array_as_node: boolean;

  constructor(array_as_node: boolean = false) {
    this._array_as_node = array_as_node;
  }

  private parseGeneric(input: Input, parent: Node): void {
    let next_token: Token = input.consume();
    if (!next_token.isGenericStart()) {
      throw new Error("Unexpected token");
    }

    let valid: boolean = true;
    while (valid) {
      next_token = input.peek();

      if (next_token.isGenericSeparator()) {
        // Eat the separator
        input.consume();

        // Check the next one right now, it could be the end
        next_token = input.peek();
        if (next_token.isGenericStop()) {
          input.consume();
          valid = false;
        }
      } else if (next_token.isGenericStop()) {
        input.consume();
        valid = false;
      } else if (next_token.isTypeName() || next_token.isArray()) {
        this.parseType(input, parent);
      } else {
        throw new Error("Unexpected token while parsing generic");
      }
    }
  }

  private parseType(input: Input, parent: Node): Node {
    let next_token: Token = input.peek();
    let type_is_array: boolean = false;
    if (next_token.isArray()) {
      // Eat the token
      input.consume();

      if (this._array_as_node) {
        // We want the 'array' information as a separate node; create it
        parent = new Node(new Type("***", true), parent);
      } else {
        // No special nodes, simply remember that this type is an array
        type_is_array = true;
      }
    }

    // Generate the node for the current type
    let current: Node = new Node(
      new Type(input.consume().getChars(), type_is_array),
      parent
    );

    // Check if there is anything after the type
    next_token = input.peek();
    if (next_token !== null) {
      if (next_token.isGenericStart()) {
        this.parseGeneric(input, current);
      } else if (next_token.isGenericSeparator()) {
        // Simply ignore, it'll be handled somewhere else
        // assuming correct format
      } else if (next_token.isGenericStop()) {
        // Simply ignore, it'll be handled somewhere else
        // assuming correct format
      } else {
        throw new Error("Unexpected token after type");
      }
    }

    // All done
    return current;
  }

  public parse(string: string, java_source_format: boolean): Node {
    // Tokenize the input
    let input: Input = new Input(string, java_source_format);

    // Take the first token, assume its a type and create the root node
    let root: Node = this.parseType(input, null);

    return root;
  }
}
