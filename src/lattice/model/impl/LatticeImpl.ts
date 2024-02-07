import { Visitor } from "../../visitors/Visitor";
import { Lattice } from "../Lattice";
import { LatticeNode } from "../LatticeNode";

export class LatticeImpl implements Lattice {
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
