import * as AST from "../../ast";
import { nodeFromExpression } from "../create";
import { StreamPort } from "../ports/stream";
import { FlatScope } from "../scopes/flat";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import * as Values from "../values";
import { Node } from "./node";

export class LetExpression extends Node {
  private scope: FlatScope;
  private nodes: Node[];

  constructor(definition: AST.LetExpression, scope: Scope) {
    super("Let", definition);
    this.scope = new FlatScope(scope);
    this.scope.addFromAST(definition.definitions);

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
