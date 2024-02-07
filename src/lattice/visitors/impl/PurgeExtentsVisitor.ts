// @TODO: Fixe eclipse types
import { LatticeNode } from "../../model/LatticeNode";
import { Visitor } from "../Visitor";

export class PurgeExtentsVisitor implements Visitor {
  private javaProject: IJavaProject;

  constructor(project: IJavaProject) {
    this.javaProject = project;
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
