import * as AST from "../../../ast";
import * as ASTTypes from "../../../ast/types";
import { nodeFromExpression } from "../../create";
import { SingleValuePort } from "../../ports/single";
import { Scope } from "../../scopes/scope";
import * as Types from "../../types";
import { checkType } from "../../types/check";
import * as Values from "../../values";
import { Node } from "../node";

export class FunctionType extends Node {
  private params: Node[];
  private returns: Node[];

  constructor(defintion: ASTTypes.FunctionType, scope: Scope) {
    super("FunctionType");

    this.params = [];
    for (const expression of defintion.params) {
      this.params.push(nodeFromExpression(expression, scope));
    }

    this.returns = [];
    for (const expression of defintion.returns) {
      this.params.push(nodeFromExpression(expression, scope));
    }

    this.addInPorts(this.params);
    this.addInPorts(this.returns);

    this.outPorts = [new SingleValuePort(this.fetchData)];
  }

  public fetchData(type: Types.ReadyType): Values.ReadyValue {
    if (!checkType(new Types.Type(), type)) {
      return new Values.ErrorValue("Incompartible type, not type");
    }

    const params: Types.Type[] = [];
    const returns: Types.Type[] = [];

    for (let i = 0; i < this.params.length; i++) {
      params.push((this.inPorts[i].getData(new Types.Type()) as Values.Type).value);
    }
    for (let i = 0; i < this.returns.length; i++) {
      returns.push(
        (this.inPorts[i + this.params.length].getData(new Types.Type()) as Values.Type).value);
    }

    return new Values.Type(new Types.Function(params, returns));
  }
}
