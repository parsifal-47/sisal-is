import * as AST from "../../ast";
import { StreamPort } from "../ports/stream";
import { Scope } from "../scopes/scope";
import { ReadyType } from "../types/ready";
import { Node } from "./node";

export class OldValue extends Node {
  public constructor(definition: AST.OldValue, scope: Scope) {
    super("OldValue", definition);
    this.outPorts = [new StreamPort(
      (type: ReadyType, offset: number) => scope.resolve(definition.id, type, offset - 1))];
  }
}
