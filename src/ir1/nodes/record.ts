import * as AST from "../../ast/composite";
import { nodeFromExpression } from "../create";
import { SingleValuePort } from "../ports/single";
import { Scope } from "../scope";
import { ReadyType } from "../types/ready";
import { ErrorValue } from "../values/error";
import { ReadyValue } from "../values/ready";
import { Node } from "./node";

export class RecordValue extends Node {
  private nodes: Node[];

  constructor(record: AST.RecordValue, scope: Scope) {
    super("Record");
    this.nodes = [];

    this.outPorts = [new SingleValuePort(this.fetchData)];
  }

  public fetchData(type: ReadyType): ReadyValue {
    return new ErrorValue("Not implemented, sorry");
  }
}
