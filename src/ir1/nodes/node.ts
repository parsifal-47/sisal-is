import { Port } from "../ports/port";

export class Node {
  public name: string;
  public location: string;
  public outPorts: Port[];
  public inPorts: Port[];

  constructor(name: string) {
    this.name = name;
    this.location = "unknown";
    this.outPorts = [];
    this.inPorts = [];
  }

  addInPorts(nodes: Node[]): void {
    for (const node of nodes) {
      if (node.outPorts.length !== 1) {
        throw new Error("Each part should produce exactly one output");
      }
      this.inPorts.push(node.outPorts[0]);
    }
  }
}
