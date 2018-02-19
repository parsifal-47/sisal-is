import * as AST from "../../ast/expression";
import { nodeFromExpression } from "../create";
import { SingleValuePort } from "../ports/single";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import { checkType } from "../types/check";
import * as Values from "../values";
import { Node } from "./node";

export class RecordAccess extends Node {
  private nodes: Node[];
  private field: string;

  constructor(recordSource: Node, defintion: AST.RecordAccess, scope: Scope) {
    super("RecordAccess");
    this.nodes = [];
    this.nodes.push(recordSource);
    this.addInPorts(this.nodes);
    this.field = defintion.field;

    this.outPorts = [new SingleValuePort((type: Types.ReadyType) => this.fetchData(type))];
  }

  public fetchData(type: Types.ReadyType): Values.ReadyValue {
    const record = this.inPorts[0].getData(new Types.Record(new Map()));

    if (record instanceof Values.ErrorValue) {
      return new Values.ErrorValue("Cannot fetch record field, not a record given");
    }
    const recordValue = record as Values.Record;

    if (!recordValue.values.has(this.field)) {
      return new Values.ErrorValue("Record has no field " + this.field);
    }
    const fieldValue = recordValue.values.get(this.field)!;

    if (!checkType(fieldValue.type, type)) {
      return new Values.ErrorValue("Incompartible type: " +
                        fieldValue.type.toString() + ", " + type.toString());
    }

    return fieldValue;
  }
}
