import { LatticeNode } from "your-module-path";
import { Visitor } from "your-module-path";

interface Lattice {
  getTop(): LatticeNode;
  getBottom(): LatticeNode;
  setTop(top: LatticeNode): void;
  setBottom(bottom: LatticeNode): void;
  acceptTopVisitor(aVisitor: Visitor): void;
  acceptBottomVisitor(aVisitor: Visitor): void;
}
