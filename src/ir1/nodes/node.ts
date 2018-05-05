import { Port } from "../ports/port";

export class Node {
  private static lastId: number = 0;

  public name: string;
  public location: string;
  public outPorts: Port[];
  public inPorts: Port[];
  public siblings: Node[];
  public id: number;

  constructor(name: string) {
    Node.lastId++;

    this.name = name;
    this.location = "unknown";
    this.outPorts = [];
    this.inPorts = [];
    this.siblings = [];
    this.id = Node.lastId;
  }

  public requestPorts(portNum: number): number {
    return this.outPorts.length;
  }

  public addInPorts(nodes: Node[]): void {
    for (const node of nodes) {
      if (node.requestPorts(1) !== 1) {
        throw new Error("Each part should produce exactly one output");
      }
      this.siblings.push(node);
      this.inPorts.push(node.outPorts[0]);
    }
  }

  public getInEdges(): Array<[Node, number]> {
    const edges: Array<[Node, number]> = [];
    for (const node of this.siblings) {
      edges.push([node, 0]);
    }
    return edges;
  }
}
