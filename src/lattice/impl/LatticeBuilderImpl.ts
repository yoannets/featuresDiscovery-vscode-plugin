import { RelationBuilder } from "../../input/RelationBuilder";
import { areSetsEqual } from "../../utils/areSetsEqual";
import { LatticeBuilder } from "../LatticeBuilder";
import { Lattice } from "../model/Lattice";
import { Relation } from "../model/Relation";
import { LatticeImpl } from "../model/impl/LatticeImpl";
import { LatticeNodeImpl } from "../model/impl/LatticeNodeImpl";
import { BucketFillerVisitor } from "../visitors/impl/BucketFillerVisitor";

export class LatticeBuilderImpl implements LatticeBuilder {
  buildLattice(aRelation: Relation, aBuilder: RelationBuilder): Lattice {
    const lattice = new LatticeImpl();

    // initialiser le sommet
    this.initializeTopBottom(lattice, aRelation, aBuilder);

    // construire le treillis de manière incrémentielle en ajoutant les éléments de la relation un par un
    for (const domainElement of aRelation.getDomain()) {
      const elementImageSet = aRelation.getImage(domainElement);
      this.add(lattice, domainElement, elementImageSet);
    }

    return lattice;
  }

  initializeTopBottom(
    lattice: Lattice,
    aRelation: Relation,
    aBuilder: RelationBuilder
  ): void {
    const topNode = new LatticeNodeImpl();
    const domain = aRelation.getDomain();

    topNode.addCollectionToExtent(domain);
    lattice.setTop(topNode);

    const bottomNode = new LatticeNodeImpl();
    const allImages = aRelation.getAllImages();
    bottomNode.addCollectionToIntent(allImages);
    lattice.setBottom(bottomNode);

    topNode.addChild(bottomNode);
    bottomNode.addParent(topNode);
  }

  add(lattice: Lattice, entity: any, image: Set<any>): void {
    // 12 C[i] <- {H: ||X'(H)|| = i}; {Class pairs in buckets with same cardinality of the X's sets}
    const currentBucketsVisitor = new BucketFillerVisitor();
    currentBucketsVisitor.visitLatticeFromTop(lattice);

    // 13 C'[i] <- 0; {Initialize the C' sets}
    const newBucketsVisitor = new BucketFillerVisitor();

    // 14 {Treat each bucket in ascending cardinality order}
    // 15 FOR i:0 TO maximum cardinality DO
    const currentSortedCardinalities =
      currentBucketsVisitor.getBucketSizesSorted();
    for (const bucketSize of currentSortedCardinalities) {
      // 16 FOR each pair H in C[i]
      const bucketOfCurrentSize =
        currentBucketsVisitor.getBucketForSize(bucketSize);
      for (const node of bucketOfCurrentSize) {
        // This will be used in step 22 and later
        let intersection: Set<any> | null = null;

        // 17 IF X'(H) <= f({x*}} THEN {modified pair}
        // This is saying, if the image of entity contains the intent of the current node ...
        if (image.has(node.getIntent())) {
          // Then we can add entity to the extent of node, and leave the intent as is
          // 18 Add x* to X(H)
          node.addToExtent(entity);
          // 19 Add H to C'[i]
          // This is, in effect, saying that the modified node will remain with the same intent cardinality.
          // Thus, we will have the newBucketsVisitor process this node, which in our case visits nothing:
          // it just builds the new buckets incrementally
          newBucketsVisitor.processNode(node);

          // 20 IF X'(H) = f({x*}) THEN exit algorithm
          // If, in fact, the image of entity equals the intent of this node, then we are done
          // Because we can test for equality just by testing for cardinality since we already know that image
          // CONTAINS the intent of node
          if (image.size === node.getIntent().size) return;
        } else {
          // 21 ELSE {old pair}
          // 22 int <- X'(H) INTER f({x*})
          // Initialize intersection to image
          intersection = new Set(
            [...image].filter((x) => node.getIntent().has(x))
          );

          // 23 IF NOT EXIST H1 e C'[||int||] such that X'(H1) = Int THEN {H is a generator}
          const intersectionSize = intersection.size;
          const newBucket =
            newBucketsVisitor.getBucketForSize(intersectionSize);
          let nodeIsGenerator = true;
          if (newBucket !== null) {
            for (const newNode of newBucket) {
              if (areSetsEqual(newNode.getIntent(), intersection))
                nodeIsGenerator = false;
            }
          }
          //
          if (nodeIsGenerator) {
            // 24 Create new pair Hn = (X(H) UNION {x*}, int) and add to C'[||int||]
            const newNode = new LatticeNodeImpl();
            // First take care of extension
            newNode.addCollectionToExtent(node.getExtent());
            newNode.addToExtent(entity);

            // Then intent
            newNode.addCollectionToIntent(intersection);

            // Then add to C'[||int||]
            newBucketsVisitor.processNode(newNode);

            // 25 Add edge Hn -> H
            // Link newNode to node
            newNode.addChild(node);
            node.addParent(newNode);

            // 26 {Modify edges}

            // 27 FOR j:0 TO ||int|| -1
            const newSortedCardinalities =
              newBucketsVisitor.getBucketSizesSorted();
            const newSortedCardinalitiesLessThanIntersectionSize =
              newSortedCardinalities.filter((nb) => nb < intersectionSize);

            for (const newBucketSize of newSortedCardinalitiesLessThanIntersectionSize) {
              const newBucketOfCurrentSize =
                newBucketsVisitor.getBucketForSize(newBucketSize);
              // 28 FOR each Ha e C'[j]
              for (const potentialParent of newBucketOfCurrentSize) {
                // 29 IF X'(Ha) <= int {Ha is a potential parent of Hn}
                if (newNode.getIntent().has(potentialParent.getIntent())) {
                  // 30 parent <- true
                  let isParent = true;
                  // 31 FOR each Hd child of Ha
                  for (const childOfPotentialParent of potentialParent.getChildren()) {
                    // 32 IF X'(Hd) <= Int parent <- false; exit FOR END IF
                    // ... except that we are not exiting FOR in this case
                    if (
                      newNode
                        .getIntent()
                        .has(childOfPotentialParent.getIntent())
                    ) {
                      // It is not a parent since one of its children qualifies as a parent
                      isParent = false;
                    }
                  }
                  // 33 END FOR

                  // 34 IF parent
                  if (isParent) {
                    // 35 IF Ha is a parent of H
                    if (node.hasParent(potentialParent)) {
                      // 36 Eliminate edge Ha -> H END IF
                      node.removeParent(potentialParent);
                      potentialParent.removeChild(node);
                    }

                    // 37 Add edge Ha -> Hn
                    newNode.addParent(potentialParent);
                    potentialParent.addChild(newNode);
                  }

                  // 38 END IF {IF parent}
                }
                // 39 END IF {IF X'(Ha) <= int}, i.e. potential parent
              }
              // 40 END FOR {FOR each Ha e C'[j]}
            }
            // 41 END FOR {FOR j:0 TO ||int|| -1 }

            // 42 IF Int=f*({x*}) THEN exit algorithm END IF
            if (areSetsEqual(intersection, image)) return;
          }
          // 43 END IF {IF X'(H) <= f({x*})
        }
      }
      // 44 END FOR {FOR each pair H in C[i]}
    }
    // 45 END FOR {FOR i:0 TO maximum cardinality DO}
  }
}
