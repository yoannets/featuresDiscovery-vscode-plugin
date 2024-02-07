import { RelationBuilder } from "./your-relation-builder-path";

class RelationImpl implements Relation {
  private builder: RelationBuilder;
  private relationStore: Map<Object, Set<Object>>;

  constructor(aBuilder: RelationBuilder) {
    this.builder = aBuilder;
    this.relationStore = new Map<Object, Set<Object>>();
  }

  addToDomain(anObject: Object): void {
    if (!this.relationStore.has(anObject)) {
      this.relationStore.set(anObject, new Set<Object>());
    }
  }

  removeFromDomain(anObject: Object): void {
    this.relationStore.delete(anObject);
  }

  addRelation(key: Object, value: Object): void {
    let image = this.relationStore.get(key);
    if (!image) {
      image = new Set<Object>();
      this.relationStore.set(key, image);
    }
    image.add(value);
  }

  removeRelation(key: Object, value: Object): void {
    const image = this.relationStore.get(key);
    if (image) {
      image.delete(value);
    }
  }

  getDomain(): Set<Object> {
    return new Set(this.relationStore.keys());
  }

  getImage(domainElement: Object): Set<Object> {
    const image = this.relationStore.get(domainElement);
    return image ? new Set(image) : new Set();
  }

  domainContains(anObject: Object): boolean {
    return this.relationStore.has(anObject);
  }

  containsRelation(key: Object, value: Object): boolean {
    const image = this.relationStore.get(key);
    return !!image && image.has(value);
  }

  getAllImages(): Set<Object> {
    const allImages = new Set<Object>();
    for (const image of this.relationStore.values()) {
      for (const obj of image) {
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
    const sortedKeys = Array.from(this.getDomain()).sort();
    for (const key of sortedKeys) {
      buffer += `${this.printDomainObject(key)} =====> [`;
      const image = Array.from(this.getImage(key))
        .map((obj) => this.printImageObject(obj))
        .join(", ");
      buffer += ` ${image} ]\n`;
    }
    return buffer;
  }

  protected printImageObject(obj: Object): string {
    return obj.toString();
  }

  protected printDomainObject(key: Object): string {
    return key.toString();
  }
}
