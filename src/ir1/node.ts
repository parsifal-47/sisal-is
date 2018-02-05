import { Subscriber } from "./subscriber"
import { Publisher } from "./publisher"

export interface Node {
  name: string;
  location: string;
  inPorts: Subscriber[];
  outPorts: Publisher[];
}
