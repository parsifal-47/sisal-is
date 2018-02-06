import { Subscriber } from "../streams/subscriber"
import { Publisher } from "../streams/publisher"

export class Node {
  name: string;
  location: string;
  inPorts: Subscriber[];
  outPorts: Publisher[];

  constructor(name: string) {
    this.name = name;
    this.location = "unknown";
    this.inPorts = [];
    this.outPorts = [];
  }
}
