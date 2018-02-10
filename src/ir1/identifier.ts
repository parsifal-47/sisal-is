import { Node } from "./node"
import { Scope } from "./scope"
import { StreamPort } from "./ports/stream";
import { ReadyType } from "./types/ready";

export class Identifier extends Node {
  public constructor(name: string, scope: Scope) {
    super("Identifier");
    this.outPorts = [new StreamPort(
      (type: ReadyType, offset: number) => scope.resolve(name, type, offset))];
  }
}
