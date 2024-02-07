import { Lattice, LatticeNode } from "./your-lattice-model-path"; // Assurez-vous d'importer correctement Lattice et LatticeNode depuis votre module
import { Visitor } from "./your-visitor-path"; // Assurez-vous d'importer correctement Visitor depuis votre module

class LatticeImpl implements Lattice {
  private top: LatticeNode;
  private bottom: LatticeNode;

  getTop(): LatticeNode {
    return this.top;
  }

  getBottom(): LatticeNode {
    return this.bottom;
  }

  setTop(top: LatticeNode): void {
    this.top = top;
  }

  setBottom(bottom: LatticeNode): void {
    this.bottom = bottom;
  }

  acceptTopVisitor(aVisitor: Visitor): void {
    aVisitor.visitLatticeFromTop(this);
  }

  acceptBottomVisitor(aVisitor: Visitor): void {
    aVisitor.visitLatticeFromBottom(this);
  }
}
