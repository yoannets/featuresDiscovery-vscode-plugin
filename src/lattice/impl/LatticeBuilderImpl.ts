import { RelationBuilder } from "../../input/RelationBuilder";
import { LatticeBuilder } from "../LatticeBuilder";
import { Lattice } from "../model/Lattice";
import { Relation } from "../model/Relation";
import { LatticeImpl } from "../model/impl/LatticeImpl";
import { LatticeNodeImpl } from "../model/impl/LatticeNodeImpl";

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
    // Implémentez votre logique ici
  }
}
