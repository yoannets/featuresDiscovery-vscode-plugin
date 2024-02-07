import { LatticeNode } from "./LatticeNode";

/**
 * This visitor constructs the set C[i] in line 12 of the algorithm named Algorithm 1
 * in the paper by Godin et al. that appeared in Comûtational Intelligence (1995),
 * vol. 11, no. 2, pp. 246-267.
 *
 * It creates buckets of lattice nodes grouped by size of intent.
 *
 * The bucket structure will be stored in a Map<number, Set<LatticeNode>>.
 *
 * We can get the list of bucket sizes sorted. We can also get the bucket (set of lattice nodes)
 * for a particular size.
 */
export class BucketFillerVisitor {
  private bucketsPerSize: Map<number, Set<LatticeNode>> = new Map<
    number,
    Set<LatticeNode>
  >();

  public processNode(node: LatticeNode): void {
    // Get size of intent
    const intentSize: number = node.getIntent().size;

    // Check if we already have a bucket for this size
    let bucket: Set<LatticeNode> | undefined =
      this.bucketsPerSize.get(intentSize);

    // If no bucket, create one and insert it into bucketsPerSize
    if (!bucket) {
      bucket = new Set<LatticeNode>();
      this.bucketsPerSize.set(intentSize, bucket);
    }

    // Add current node to bucket
    bucket.add(node);
  }

  /**
   * Returns the bucket containing lattice nodes whose intent has cardinality size.
   * @param size Size of the intent
   * @returns Bucket containing lattice nodes
   */
  public getBucketForSize(size: number): Set<LatticeNode> | undefined {
    return this.bucketsPerSize.get(size);
  }

  /**
   * Returns a sorted set of bucket sizes.
   * @returns Sorted set of bucket sizes
   */
  public getBucketSizesSorted(): number[] {
    return [...this.bucketsPerSize.keys()].sort((a, b) => a - b);
  }
}
