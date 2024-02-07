import { Lattice } from "./Lattice";
import { LatticeNode } from "./LatticeNode";

export enum Direction {
  Undefined,
  TopDown,
  BottomUp,
}

export interface Visitor {
  /**
   * This method will start with the top node, and then recursively descends down visiting the children,
   * until it reaches the bottom. Implementations will call visitLatticeNode(LatticeNode node)
   * and visitChildren(LatticeNode node).
   * @param aLattice
   */
  visitLatticeFromTop(aLattice: Lattice): void;

  /**
   * This method will start with the bottom node, and then recursively goes up visiting the parents,
   * until it reaches the top. Implementations will call visitLatticeNode(LatticeNode node)
   * and visitParent(LatticeNode node).
   * @param aLattice
   */
  visitLatticeFromBottom(aLattice: Lattice): void;

  /**
   * Returns the direction of the current visit. If current visit started with visitLatticeFromTop,
   * then the direction is TopDown. If the current visit started with visitLatticeFromBottom, then the
   * result is BottomUp. Else, it returns Undefined.
   * Watch out. after a visitor has visited a Lattice, it will conserve its direction for the next call
   * unless visitLatticeFromTop or visitLatticeFromBottom is called again.
   * @return
   */
  getCurrentVisitDirection(): Direction;

  /**
   * Does whatever needs to be done on the node (calls processNode), sets visited to true,
   * then, depending on direction, either visits children or parents.
   * This method will be called from either visitLatticeFromTop or visitLatticeFromBottom.
   * @param latticeNode
   * @param direction
   */
  visitLatticeNode(latticeNode: LatticeNode, direction: Direction): void;

  /**
   * This method processes the current node.
   * @param node
   */
  processNode(node: LatticeNode): void;

  /**
   * This method processes visited nodes. Normally, visited nodes are not processed. But in some
   * case, we may want to process them but differently from the first time we came across them.
   * For example, if we are traversing a graph, the first time we come across the node, we print its contents.
   * The second time we "hit it", we simply put a reference to it.
   */
  processVisitedNode(node: LatticeNode): void;

  /**
   * A method used to reset a visitor between visits. If the visitor collects/maintains data during its visits, this is
   * the opportunity to clean that data to prepare it for other visits.
   */
  reset(): void;
}
