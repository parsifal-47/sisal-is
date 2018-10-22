import * as AST from "../../ast";
import { nodeFromExpression } from "../create";
import { StreamPort } from "../ports/stream";
import { LoopScope } from "../scopes/loop";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import * as Values from "../values";
import { IfBranch } from "./ifBranch";
import { Node } from "./node";

export class LoopExpression extends Node {
  private nodes: Node[];
  private scope: LoopScope;

  constructor(definition: AST.LoopExpression, scope: Scope) {
    super("LoopExpression", definition);
    this.scope = new LoopScope(scope, definition.body, definition.range, definition.init,
                               definition.preCondition, definition.postCondition);

    this.nodes = [];
    for (const expression of definition.returns) {
      this.nodes.push(nodeFromExpression(expression, this.scope));
    }

    for (const node of this.nodes) {
      node.requestPorts(1);
      for (const port of node.outPorts) {
        this.outPorts.push(port);
      }
    }
  }
}
