import {
  IAdaptable,
  IPropertyDescriptor,
  IPropertySource,
} from "some-library-path"; // Chemin fictif, remplacez-le par le chemin réel
import { NodeFeatureType } from "./NodeFeatureType";

export class Node implements IAdaptable, IPropertySource {
  private name: string;
  private types: Array<NodeFeatureType> = [];
  private extent: string | undefined;
  private intent: string | undefined;
  private children: Array<Node> = [];

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  setName(name: string): void {
    this.name = name;
  }

  getChildren(): Array<Node> {
    return this.children;
  }

  addChild(connection: Node): void {
    this.children.push(connection);
  }

  getExtent(): string | undefined {
    return this.extent;
  }

  setExtent(extent: string): void {
    this.extent = extent;
  }

  getIntent(): string | undefined {
    return this.intent;
  }

  setIntent(intent: string): void {
    this.intent = intent;
  }

  getPropertyDescriptors(): IPropertyDescriptor[] {
    // Implémentez la méthode getPropertyDescriptors si nécessaire
    throw new Error("Method not implemented.");
  }

  getPropertyValue(id: any): any {
    if (id === "name") {
      return this.name;
    } else {
      return "unknown";
    }
  }

  isPropertySet(id: any): boolean {
    // Implémentez la méthode isPropertySet si nécessaire
    throw new Error("Method not implemented.");
  }

  resetPropertyValue(id: any): void {
    // Implémentez la méthode resetPropertyValue si nécessaire
    throw new Error("Method not implemented.");
  }

  setPropertyValue(id: any, value: any): void {
    if (id === "name") {
      this.name = value;
    }
  }

  getEditableValue(): any {
    // Implémentez la méthode getEditableValue si nécessaire
    throw new Error("Method not implemented.");
  }

  getAdapter<T>(adapter: new (...args: any[]) => T): T | null {
    // Implémentez la méthode getAdapter si nécessaire
    throw new Error("Method not implemented.");
  }

  toString(): string {
    return `Node [name=${this.name}, types=${this.types}, extent=${
      this.extent
    }, intent=${this.intent}, children=${this.children}], hashcode ${
      this.extent && this.intent ? this.extent + this.intent : "undefined"
    }`;
  }

  getID(): number {
    return this.ID;
  }

  setID(ID: number): void {
    this.ID = ID;
  }
}
