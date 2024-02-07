// @TODO: Fixe eclipse types
import { Direction, Visitor } from "../Visitor";
import { LatticeNode } from "../../model/LatticeNode";
import { ReverseInheritanceRelationBuilder } from "../../../input/impl/ReverseInheritanceRelationBuilder";
import { Lattice } from "../../model/Lattice";

/**
 * This visitor traverses the lattice, and for each node, purges the extent of
 * those classes that are not minimal from an inheritance point of view, EXCEPT
 * when the non-minimum in question has the feature (intent) through other means
 * than other nodes of the extent. This means one of two situations:
 *
 * 1) either its local domain interface contains the intent. In which case it
 * is considered as an independent occurrence of the feature from that of its
 * other children of the extent, or
 *
 * 2) the union of its local domain interface AND the cumulative domain interfaces
 * of its children who are NOT in the extent. I don't know how realistic this second
 * is, and how often we are going to encounter it, but for the sake of exhaustiveness,
 * we need to take it into account
 *
 * Instances of the first case are cases where the extent contains an interface and its various
 * implementations. This is a case where a feature was recognized by the developer as such, and
 * expressed it in an interface. The visitor that identifies candidate nodes should mark it as such
 */
export class ComplexPurgeExtentsVisitor implements Visitor {
  private relationBuilder: ReverseInheritanceRelationBuilder;

  constructor(builder: ReverseInheritanceRelationBuilder) {
    this.relationBuilder = builder;
  }

  // @TODO: Fixe not implemented methods
  visitLatticeFromTop(aLattice: Lattice): void {
    throw new Error("Method not implemented.");
  }
  visitLatticeFromBottom(aLattice: Lattice): void {
    throw new Error("Method not implemented.");
  }
  getCurrentVisitDirection(): Direction {
    throw new Error("Method not implemented.");
  }
  visitLatticeNode(latticeNode: LatticeNode, direction: Direction): void {
    throw new Error("Method not implemented.");
  }
  processVisitedNode(node: LatticeNode): void {
    throw new Error("Method not implemented.");
  }
  reset(): void {
    throw new Error("Method not implemented.");
  }
  // END

  public processNode(node: LatticeNode): void {
    // First, if this is the top node, exit
    if (node.intent.isEmpty()) return;

    let intersection: Set<Object> | null = null;
    const extent: Set<Object> = node.extent;
    const intent: Set<Object> = node.intent;

    const classesToProcess: Object[] = [...extent];

    // First, create a type hierarchy to get the inheritance relationships
    let typeHierarchy: ITypeHierarchy | null = null;

    // While there are still classes to process from the extent
    while (classesToProcess.length > 0) {
      // First, remove first element from classesToProcess
      const nextClass: IType = classesToProcess.shift() as IType;

      try {
        typeHierarchy = nextClass.newTypeHierarchy(pMonitor);
        const itsAncestors: IType[] = typeHierarchy.getAllSupertypes(nextClass);

        // Compute the intersection between the extent and the list of ancestors
        intersection = new Set<Object>(extent);
        itsAncestors.forEach((ancestor: IType) => {
          if (extent.has(ancestor)) intersection!.add(ancestor);
        });

        // Now, go over the elements of the intersection.
        // If an element's local interface contains the intent, we should not remove it because it has the intent,
        // NOT by virtue of cumulating the interfaces of its children, but has them independently, and should be counted
        // as an independent occurrence.
        intersection.forEach((element: Object) => {
          const type: IType = element as IType;
          const localDomainInterface: IMethod[] | undefined =
            this.relationBuilder.getLocalDomainInterfaces().get(type);
          const localDomainInterfaceAsSet: Set<Object> = new Set<Object>(
            localDomainInterface
          );
          if (
            ![...node.intent].every((intentElement) =>
              localDomainInterfaceAsSet.has(intentElement)
            )
          ) {
            // Indeed, this is the case where we need to remove the element from the extent
            extent.delete(element);
          } else {
            // Just print a node
            // console.log("Class " + type.getElementName() + " was not purged from a node extent even though it is not a minimum. Is it an interface? "+ type.isInterface());
          }

          // Either way, remove it from classes to process
          classesToProcess.splice(classesToProcess.indexOf(element), 1);
        });
      } catch (jme: any) {
        console.error(jme);
      }
    }
  }
}
