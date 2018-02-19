import * as AST from "../../../ast";
import * as ASTTypes from "../../../ast/types";
import { nodeFromExpression } from "../../create";
import { SingleValuePort } from "../../ports/single";
import { Scope } from "../../scopes/scope";
import * as Types from "../../types";
import { checkType } from "../../types/check";
import * as Values from "../../values";
import { Node } from "../node";
import { SomeType } from "./some";

export class RecordType extends Node {
  private nodes: Node[];
  private names: string[];

  constructor(defintion: ASTTypes.RecordType, scope: Scope) {
    super("RecordType");
    this.nodes = [];
    this.names = [];

    for (const field of defintion.fields) {
      this.names.push(field.name);
      if (field.dataType) {
        this.nodes.push(nodeFromExpression(field.dataType, scope));
      } else {
        this.nodes.push(new SomeType());
      }
    }
    this.addInPorts(this.nodes);

    this.outPorts = [new SingleValuePort(this.fetchData)];
  }

  public fetchData(type: Types.ReadyType): Values.ReadyValue {
    if (!checkType(new Types.Type(), type)) {
      return new Values.ErrorValue("Incompartible type, not type");
    }

    const params = new Map<string, Types.Type>();

    for (let i = 0; i < this.names.length; i++) {
      params.set(this.names[i],
        (this.inPorts[i].getData(new Types.Type()) as Values.Type).value);
    }

    return new Values.Type(new Types.Record(params));
  }
}
