import { LatticeNode } from "../../model/LatticeNode";
import { Visitor, Direction } from "../Visitor";
import { Lattice } from "../../model/Lattice";

export abstract class AbstractVisitor implements Visitor {
  private visitedNodes: Set<LatticeNode> = new Set<LatticeNode>();
  private currentDirection: Direction = Direction.Undefined;

  visitLatticeFromTop(aLattice: Lattice): void {
    this.currentDirection = Direction.TopDown;
    const top = aLattice.getTop();
    top.acceptVisitor(this, this.currentDirection);
  }

  visitLatticeFromBottom(aLattice: Lattice): void {
    this.currentDirection = Direction.BottomUp;
    const bottom = aLattice.getBottom();
    bottom.acceptVisitor(this, this.currentDirection);
  }

  getCurrentVisitDirection(): Direction {
    return this.currentDirection;
  }

  visitLatticeNode(latticeNode: LatticeNode, direction: Direction): void {
    // first check if node has been visited, in which case
    // call processVisitedNodes and return
    if (this.visitedNodes.has(latticeNode)) {
      this.processVisitedNode(latticeNode);
      return;
    }

    // ELSE
    // first process node
    this.processNode(latticeNode);

    // set the node to visited
    this.visitedNodes.add(latticeNode);

    switch (direction) {
      case Direction.TopDown:
        if (latticeNode.getChildren().size > 0) {
          this.preprocessChildren(latticeNode);
          for (const child of latticeNode.getChildren()) {
            this.visitLatticeNode(child, direction);
          }
        }
        break;
      case Direction.BottomUp:
        if (latticeNode.getParents().size > 0) {
          this.preprocessParents(latticeNode);
          for (const parent of latticeNode.getParents()) {
            this.visitLatticeNode(parent, direction);
          }
        }
        break;
      default:
        console.log(
          "Houston! we have a problem: an alien visitor with no direction!"
        );
        break;
    }
  }

  processNode(node: LatticeNode): void {
    return;
  }

  /**
   * hook method in case I wanted to insert a preprocessing ahead of visiting
   * children. Subclasses my override. Didn't want to make it abstract to not
   * force subclasses to have to supply an implementation since most of the
   * time, there is nothing to put.
   *
   * @param node
   */
  preprocessChildren(node: LatticeNode): void {
    return;
  }

  /**
   * hook method in case I wanted to insert a preprocessing ahead of visiting
   * parents. Subclasses may override. Didn't want to make it abstract to not
   * force subclasses to have to supply an implementation since most of the
   * time, there is nothing to put.
   *
   * @param node
   */
  preprocessParents(node: LatticeNode): void {
    return;
  }

  /**
   * the default implementation does nothing
   */
  processVisitedNode(node: LatticeNode): void {
    return;
  }

  /**
   * the default implementation simply resets the direction and empties the visitedNodes set. Concrete
   * subclasses may do something fancier
   */
  reset(): void {
    this.visitedNodes.clear();
    this.currentDirection = Direction.Undefined;
  }
}
