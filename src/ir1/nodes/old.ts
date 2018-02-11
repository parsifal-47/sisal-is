import * as AST from "../../ast";
import { StreamPort } from "../ports/stream";
import { Scope } from "../scope";
import { ReadyType } from "../types/ready";
import { Node } from "./node";

export class OldValue extends Node {
  public constructor(definition: AST.OldValue, scope: Scope) {
    super("OldValue");
    this.outPorts = [new StreamPort(
      (type: ReadyType, offset: number) => scope.resolveOld(definition.id, type, offset))];
  }
}
