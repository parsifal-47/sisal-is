import { StreamPort } from "../ports/stream";
import { Scope } from "../scopes/scope";
import { ReadyType } from "../types/ready";
import { Node } from "./node";

export class Identifier extends Node {
  public constructor(name: string, scope: Scope) {
    super("Identifier");
    this.outPorts = [new StreamPort(
      (type: ReadyType, offset: number) => scope.resolve(name, type, offset))];
  }
}
