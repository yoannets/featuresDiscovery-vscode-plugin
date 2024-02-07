import { LatticeNode } from "../../model/LatticeNode";
import { Visitor, Direction } from "../Visitor";
import { Lattice } from "../../model/Lattice";

export abstract class AbstractVisitor implements Visitor {
  private visitedNodes: Set<LatticeNode> = new Set<LatticeNode>();
  private currentDirection: Direction = Direction.Undefined;

  abstract processNode(node: LatticeNode): void;

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
    if (this.visitedNodes.has(latticeNode)) {
      this.processVisitedNode(latticeNode);
      return;
    }

    this.processNode(latticeNode);
    this.visitedNodes.add(latticeNode);

    switch (direction) {
      case Direction.TopDown:
        if (latticeNode.children.length > 0) {
          this.preprocessChildren(latticeNode);
          for (const child of latticeNode.children) {
            this.visitLatticeNode(child, direction);
          }
        }
        break;
      case Direction.BottomUp:
        if (latticeNode.parents.length > 0) {
          this.preprocessParents(latticeNode);
          for (const parent of latticeNode.parents) {
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

  abstract preprocessChildren(node: LatticeNode): void;

  abstract preprocessParents(node: LatticeNode): void;

  processVisitedNode(node: LatticeNode): void {
    // Default implementation does nothing
  }

  reset(): void {
    this.visitedNodes.clear();
    this.currentDirection = Direction.Undefined;
  }
}
