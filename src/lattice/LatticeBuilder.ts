import { RelationBuilder } from "./RelationBuilder";
import { Lattice } from "./Lattice";
import { Relation } from "./Relation";

export interface LatticeBuilder {
  /**
   * Builds a lattice from a relation. We pass the relation builder along because it may carry
   * some information that is useful during the lattice generation.
   * @param aRelation
   * @param builder
   * @return
   */
  buildLattice(aRelation: Relation, builder: RelationBuilder): Lattice;

  /**
   * This method initializes the top and bottom of the lattice using aRelation and any relevant/useful information
   * found in aBuilder.
   * @param lattice
   * @param aRelation
   * @param aBuilder
   */
  initializeTopBottom(
    lattice: Lattice,
    aRelation: Relation,
    aBuilder: RelationBuilder
  ): void;

  /**
   * This method implements Godin et al.'s incremental algorithm.
   * @param entity
   * @param image
   */
  add(lattice: Lattice, entity: any, image: Set<any>): void;
}
