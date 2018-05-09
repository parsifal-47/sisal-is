import * as AST from "../../ast";
import { nodeFromExpression } from "../create";
import { StreamPort } from "../ports/stream";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import * as Values from "../values";
import { IfBranch } from "./ifBranch";
import { Node, subGraphML } from "./node";

export class IfExpression extends Node {
  private branches: IfBranch[];

  constructor(definition: AST.IfExpression, scope: Scope) {
    super("If");
    this.branches = [];
    this.branches.push(new IfBranch(definition.condition, definition.thenBranch, scope));

    for (const branch of definition.elseIfs) {
      this.branches.push(new IfBranch(branch.condition, branch.branch, scope));
    }
    this.branches.push(new IfBranch({type: "BooleanLiteral", value: true} as AST.Expression,
                                    definition.elseBranch, scope));

    for (let i = 0; i < definition.thenBranch.length; i++) {
      this.outPorts.push(new StreamPort(
        (type: Types.ReadyType, offset: number) => this.fetchPort(i, type, offset)));
    }
  }

  public graphML(): string {
    return subGraphML(this.branches);
  }

  private fetchPort(portNum: number, dataType: Types.ReadyType, offset: number): Values.ReadyValue {
    for (const branch of this.branches) {
      const condition = branch.inPorts[0].getData(new Types.Boolean()) as Values.Boolean;
      if (condition.value) {
        return branch.inPorts[portNum + 1].getData(dataType, offset);
      }
    }
    throw new Error("This should never happen");
  }
}
