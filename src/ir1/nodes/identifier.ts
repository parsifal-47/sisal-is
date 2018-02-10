import { Node } from "./node";
import { StreamPort } from "../ports/stream";
import { Scope } from "../scope";
import { ReadyType } from "../types/ready";

export class Identifier extends Node {
  public constructor(name: string, scope: Scope) {
    super("Identifier");
    this.outPorts = [new StreamPort(
      (type: ReadyType, offset: number) => scope.resolve(name, type, offset))];
  }
}
