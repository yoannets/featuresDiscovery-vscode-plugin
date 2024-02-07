import { IType } from "your-module-path"; // Assurez-vous d'importer correctement IType depuis votre module

class TypeResolver extends AbstractVisitor2 {
  private _context: IType;

  constructor(context: IType) {
    super(true);
    this._context = context;
  }

  protected onNode(node: Node): void {
    const type: Type = node.getType();

    // Si le type est résolu, abandonner
    if (type.isResolved()) {
      return;
    }

    // Extraire l'arborescence
    const subtree: Node = node.asSubTree();

    // Obtenir le nom complet de l'arborescence en l'imprimant joliment (et en la nettoyant)
    const printer: PrettyPrinter = new PrettyPrinter(true, false);
    printer.visit(subtree);
    const full_name: string = printer.getOutput();

    // Résoudre le type en utilisant le contexte
    const resolved: string[][] | null = this._context.resolveType(full_name);

    // Valider la résolution et abandonner si quelque chose s'est mal passé
    if (!resolved) {
      throw new Error("Could not resolve type: " + full_name);
    } else if (resolved.length !== 1) {
      throw new Error("Too many choices for resolved type " + full_name);
    }

    // Recombiner les éléments résolus pour obtenir le nom de type complet
    const resolved_typename: string = resolved[0][0] + "." + resolved[0][1];

    // Analyser le type résolu (pour extraire le nouveau nom de type)
    const parser: Parser = new Parser();
    const root: Node = parser.parse(resolved_typename, true);

    // Mettre à jour le type actuel
    type.updateTypeName(root.getType().getTypename());
  }
}
