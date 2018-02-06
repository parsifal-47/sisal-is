export interface Node {
  type: string;
}

export function isNode(node: any): node is Node {
  return node.type !== undefined;
}
