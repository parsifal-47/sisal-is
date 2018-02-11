import * as AST from "../../ast";
import { nodeFromExpression } from "../create";
import { StreamPort } from "../ports/stream";
import { Scope } from "../scope";
import * as Types from "../types";
import * as Values from "../values";
import { Node } from "./node";

export class LetExpression extends Node {
  private scope: Scope;
  private nodes: Node[];

  constructor(definition: AST.LetExpression, scope: Scope) {
    super("Let");
    this.scope = new Scope(scope);
    this.scope.addFromAST(definition.defintions);

    this.nodes = [];
    for (const expression of definition.expressions) {
      this.nodes.push(nodeFromExpression(expression, this.scope));
    }

    for (const node of this.nodes) {
      for (const port of node.outPorts) {
        this.outPorts.push(port);
      }
    }
  }
}
