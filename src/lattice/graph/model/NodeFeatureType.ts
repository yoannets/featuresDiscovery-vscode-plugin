export class NodeFeatureType implements Serializable {
  private featureTypeName: string;
  private anchor: string;
  private coverage: number;

  getFeatureTypeName(): string {
    return this.featureTypeName;
  }

  setFeatureTypeName(featureTypeName: string): void {
    this.featureTypeName = featureTypeName;
  }

  getAnchor(): string {
    return this.anchor;
  }

  setAnchor(anchor: string): void {
    this.anchor = anchor;
  }

  getCoverage(): number {
    return this.coverage;
  }

  setCoverage(coverage: number): void {
    this.coverage = coverage;
  }

  toString(): string {
    return `NodeFeatureType [FeatureTypeName=${this.featureTypeName}, anchor=${this.anchor}, coverage=${this.coverage}]`;
  }
}
