import {
  IJavaProject,
  IType,
  ITypeHierarchy,
  JavaModelException,
} from "../../../polyfills/eclipse";
import { Lattice } from "../../model/Lattice";
import { LatticeNode } from "../../model/LatticeNode";
import { Direction, Visitor } from "../Visitor";

export class PurgeExtentsVisitor implements Visitor {
  private javaProject: IJavaProject;

  constructor(project: IJavaProject) {
    this.javaProject = project;
  }
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

  processNode(node: LatticeNode): void {
    let intersection: Set<Object> | null = null;
    const extent: Set<Object> = node.getExtent();
    const classesToProcess: Object[] = Array.from(extent);

    let typeHierarchy: ITypeHierarchy | null = null;
    while (classesToProcess.length > 0) {
      const nextClass: IType = classesToProcess.shift() as IType;
      try {
        typeHierarchy = nextClass.newTypeHierarchy(null);
        const itsAncestors: IType[] = typeHierarchy.getAllSupertypes(nextClass);

        intersection = new Set<Object>(extent);
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
      } catch (jme: any) {
        if (jme instanceof JavaModelException) {
          console.error(jme);
        }
      }
    }
  }

  getJavaProject(): IJavaProject {
    return this.javaProject;
  }
}
