import { Node } from "./node"
import * as AST from "../ast/composite";
import { SingleValuePort } from "./ports/single"
import { nodeFromExpression } from "./create";
import { Scope } from "./scope"
import { ReadyType } from "./types/ready";
import { ReadyValue } from "./values/ready";
import { ErrorValue } from "./values/error";

export class RecordValue extends Node {
  private nodes: Node[];

  constructor(record: AST.RecordValue, scope: Scope) {
    super("Record");
    this.nodes = [];
    for (let defintion in record.contents) {
    }

    this.outPorts = [new SingleValuePort(this.fetchData)];
  }

  public fetchData(type: ReadyType): ReadyValue {
    return new ErrorValue("Not implemented, sorry");
  }
}
