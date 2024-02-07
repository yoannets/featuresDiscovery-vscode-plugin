import { LatticeNode } from "./LatticeNode";
import { Visitor } from "../visitors/Visitor";

export interface Lattice {
  getTop(): LatticeNode;
  getBottom(): LatticeNode;
  setTop(top: LatticeNode): void;
  setBottom(bottom: LatticeNode): void;
  acceptTopVisitor(aVisitor: Visitor): void;
  acceptBottomVisitor(aVisitor: Visitor): void;
}
