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
}
