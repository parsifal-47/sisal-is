import { DataSource } from "../streams/source"

export class Node {
  name: string;
  location: string;
  outPorts: Port[];
  inPorts: Port[];

  constructor(name: string) {
    this.name = name;
    this.location = "unknown";
    this.outPorts = [];
    this.inPorts = [];
  }
}
