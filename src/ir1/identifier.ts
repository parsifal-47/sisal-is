import { Node } from "./node"
import { Scope } from "./scope"
import { StreamPort } from "./ports/stream";

export class Identifier extends Node {
  private scope: Scope;

  public constructor(name: string, scope: Scope) {
    super("Identifier");
    this.outPorts = [new StreamPort(
      (type: ReadyType, offset: number) => this.scope.resolve(name, type, offset))];
  }
}
