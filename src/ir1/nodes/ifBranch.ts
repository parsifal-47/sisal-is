import * as AST from "../../ast";
import { nodeFromExpression } from "../create";
import { StreamPort } from "../ports/stream";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import * as Values from "../values";
import { Node } from "./node";

export class IfBranch extends Node {
  private nodes: Node[];

  constructor(condition: AST.Expression, values: AST.Expression[], scope: Scope) {
    super("IfBranch");
    this.nodes = [];
    this.nodes.push(nodeFromExpression(condition, scope));
    for (const expression of values) {
      this.nodes.push(nodeFromExpression(expression, scope));
    }
    this.addInPorts(this.nodes);
  }
}
