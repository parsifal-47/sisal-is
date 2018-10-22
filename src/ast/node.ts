export interface Position {
  offset: number;
  line: number;
  column: number;
}

export interface Location {
  start: Position;
  end: Position;
}

export interface Node {
  type: string;
  location: Location;
}

export function isNode(node: any): node is Node {
  return node.type !== undefined;
}
