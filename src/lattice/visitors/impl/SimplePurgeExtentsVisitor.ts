import {
  IProgressMonitor,
  IType,
  ITypeHierarchy,
  NullProgressMonitor,
} from "../../../polyfills/eclipse";
import { LatticeNode } from "../../model/LatticeNode";
import { Visitor } from "../Visitor";
import { AbstractVisitor } from "./AbstractVisitor";

/**
 * This visitor traverses the lattice, and for each node, purges the extent of
 * those classes that are not minimal from an inheritance point of view
 *
 * For example, consider a lattice node with extent {C1, C2, C3} and intent
 * {Method1, Method2, Method3, Method4}. If any of the three classes are
 * hierarchically related, the higher one is removed from the extent.
 *
 * For example, if C1 extends ... C2 extends ... C3, then we leave only C1 in
 * the extent.
 *
 * If C1 extends ... C2, but C3 belongs to a different branch, then we remove
 * C2, and we leave C1 and C3
 *
 * If none of the nodes is a parent of the others, then the purge leaves all
 * three.
 *
 * @author Hafedh
 *
 */
export class SimplePurgeExtentsVisitor
  extends AbstractVisitor
  implements Visitor
{
  processNode(node: LatticeNode): void {
    let intersection: Set<any> | null = null;
    const extent: Set<any> = node.getExtent();
    const classesToProcess: any[] = Array.from(extent);

    let typeHierarchy: ITypeHierarchy | null = null;
    const pMonitor: IProgressMonitor = new NullProgressMonitor();

    while (classesToProcess.length > 0) {
      const nextClass: IType = classesToProcess.shift() as IType;
      try {
        typeHierarchy = nextClass.newTypeHierarchy(pMonitor);
        const itsAncestors: IType[] = typeHierarchy.getAllSupertypes(nextClass);

        intersection = new Set<any>(extent);
        itsAncestors.forEach((ancestor) => {
          if (intersection!.has(ancestor)) {
            intersection!.delete(ancestor);
          }
        });

        extent.forEach((cls) => {
          if (intersection!.has(cls)) {
            extent.delete(cls);
            classesToProcess.splice(classesToProcess.indexOf(cls), 1);
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  }
}
