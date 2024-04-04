import { RelationBuilder } from "../../../input/RelationBuilder";
import { Relation } from "../Relation";

export class RelationImpl implements Relation {
  private builder: RelationBuilder;
  private relationStore: Map<any, Set<any>>;

  constructor(aBuilder: RelationBuilder) {
    this.builder = aBuilder;
    this.relationStore = new Map<any, Set<any>>();
  }

  addToDomain(anObject: any): void {
    if (!this.relationStore.has(anObject)) {
      this.relationStore.set(anObject, new Set<any>());
    }
  }

  removeFromDomain(anObject: any): void {
    this.relationStore.delete(anObject);
  }

  addRelation(key: any, value: any): void {
    let image = this.relationStore.get(key);
    if (!image) {
      image = new Set<any>();
      this.relationStore.set(key, image);
    }
    image.add(value);
  }

  removeRelation(key: any, value: any): void {
    if (this.containsRelation(key, value)) {
      const image = this.relationStore.get(key);
      image.delete(value);
    }
  }

  getDomain(): Set<any> {
    return new Set(this.relationStore.keys());
  }

  getImage(domainElement: any): Set<any> {
    const image = this.relationStore.get(domainElement);
    return image ? new Set(image) : new Set();
  }

  domainContains(anObject: any): boolean {
    return this.relationStore.has(anObject);
  }

  containsRelation(key: any, value: any): boolean {
    const image = this.relationStore.get(key);
    return image && image.has(value);
  }

  getAllImages(): Set<any> {
    const allImages = new Set<any>();
    for (const domainElement of this.getDomain()) {
      for (const obj of this.getImage(domainElement)) {
        allImages.add(obj);
      }
    }
    return allImages;
  }

  getRelationBuilder(): RelationBuilder {
    return this.builder;
  }

  printString(): string {
    let buffer = "";
    // Print the images by sorted key values
    const keyMap = new Map<string, any>();
    const sortedKeys = Array.from(this.getDomain())
      .map((key) => {
        const keyString = this.printDomainObject(key);
        keyMap.set(keyString, key);
        return keyString;
      })
      .sort();

    // Iterate through sorted keys
    for (const keyString of sortedKeys) {
      const key = keyMap.get(keyString);
      // Print the image of key
      // -> first the key
      buffer += `${keyString} =====> [`;
      // Then the image of the current element
      const image = this.getImage(key);
      for (const obj of image) {
        buffer += ` ${this.printImageObject(obj)},`;
      }
      // Remove the last character which is the extraneous ","
      buffer = buffer.slice(0, -1);
      buffer += " ]\n";
    }

    return buffer;
  }

  protected printImageObject(obj: any): string {
    return obj.toString();
  }

  protected printDomainObject(key: any): string {
    return key.toString();
  }
}
