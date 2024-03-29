type Lattice = {
  name: string;
  intent: string[];
  extent: string[];
  children: Lattice[];
  types: {
    FeatureTypeName: TYPE;
    coverage: number;
    anchor?: string;
  }[];
};

type Data = {
  id: number;
  nodes: {
    id: number;
    label: string;
    color: string;
    childrensId: number[];
    areChildsHiden: boolean;
    lattice: Lattice;
    hidden: boolean;
  }[];
  edges: {
    from: number;
    to: number;
  }[];
};

enum TYPE {
  ADHOC = "red",
  EXPLICIT_INTERFACE_IMPLEMENTATIONS = "yellow",
  EXPLICIT_CLASS_SUBCLASS_REDEFINITIONS = "orange",
  DEFAULT = "#8b0000",
}

const TYPES_SUFIXES_TO_REMOVE = [
  "PARTIAL_EXTENT_PARTIAL_BEHAVIOR_",
  "PARTIAL_EXTENT_FULL_BEHAVIOR_",
  "FULL_EXTENT_PARTIAL_BEHAVIOR_",
  "FULL_EXTENT_FULL_BEHAVIOR_",
] as const;

/**
 * Get the color based on the type of the node
 * @param type
 * @returns
 */
function getColor(type: string) {
  const parsedType = type.replace(
    new RegExp(TYPES_SUFIXES_TO_REMOVE.join("|"), "g"),
    ""
  );

  switch (parsedType) {
    case "ADHOC":
      return TYPE.ADHOC;
    case "EXPLICIT_INTERFACE_IMPLEMENTATIONS":
      return TYPE.EXPLICIT_INTERFACE_IMPLEMENTATIONS;
    case "EXPLICIT_CLASS_SUBCLASS_REDEFINITIONS":
      return TYPE.EXPLICIT_CLASS_SUBCLASS_REDEFINITIONS;
  }
  return TYPE.DEFAULT;
}

/**
 * Convert a lattice graph to a vis graph
 * @param json
 * @returns
 */
function convertToVisGraph(
  json: Lattice,
  ID_GENERATOR: Generator<number, void, unknown>
): Data | null {
  const id = ID_GENERATOR.next().value as number;

  const data: Data = {
    id,
    nodes: [],
    edges: [],
  };

  // Skip the node id the types is empty
  if (json.types.length === 0 && id !== 0) return null;

  // We had the node
  const currentNode: Data["nodes"][number] = {
    id,
    color: id === 0 ? "white" : getColor(json.types[0].FeatureTypeName),
    label: json.name,
    lattice: json,
    childrensId: [],
    areChildsHiden: true,
    hidden: id !== 0,
  };
  data.nodes.push(currentNode);

  // Recusion and children visiting
  for (const children of json.children) {
    const childrenData = convertToVisGraph(children, ID_GENERATOR);

    if (childrenData === null) continue;

    currentNode.childrensId.push(childrenData.id);

    data.nodes = [...data.nodes, ...childrenData.nodes];
    data.edges = [
      ...data.edges,
      ...childrenData.edges,
      { from: id, to: childrenData.id },
    ];
  }

  return data;
}

export default convertToVisGraph;
