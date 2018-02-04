export interface Port {
  datatype: string;
  edges: Edge[];
}

export interface Node {
  type: string;
  inPorts: Port[];
  outPorts: Port[];
}
