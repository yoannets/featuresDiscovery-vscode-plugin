import {
  IJavaProject,
  IProgressMonitor,
  IType,
  ITypeHierarchy,
  NullProgressMonitor,
} from "../../../polyfills/eclipse";
import { LatticeNode } from "../../model/LatticeNode";
import { Visitor } from "../Visitor";
import { AbstractVisitor } from "./AbstractVisitor";

export class PurgeExtentsVisitor extends AbstractVisitor implements Visitor {
  private javaProject: IJavaProject;

  constructor(project: IJavaProject) {
    super();
    this.javaProject = project;
  }

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
      } catch (jme: any) {
        console.error(jme);
      }
    }
  }

  getJavaProject(): IJavaProject {
    return this.javaProject;
  }
}
