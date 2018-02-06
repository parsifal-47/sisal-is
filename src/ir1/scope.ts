import { Node } from "./node";
import { nodeFromExpression } from "./create";
import * as AST from "../ast";

interface NodeWithPort {
  node: Node;
  port: number;
}

export class Scope {
  private parentScope?: Scope;
  private defintions: Map<string, NodeWithPort>;

  public constructor(parent: Scope | undefined) {
    this.parentScope = parent;
    this.defintions = new Map();
  }
  public resolve(name: string, type: Type): Node | undefined {
    if (this.defintions.has(name)) {
      return this.defintions.get(name).node;
    }
    if (!this.parentScope) {
      return undefined;
    }
    return this.parentScope.resolve(name);
  }
}

export class ProgramScope extends Scope {
  constructor(parent: Scope, definitions: AST.Definition[]) {
    super(parent);
    for (let d in definitions) {
      if (d.left.length !== d.right.length && d.right.length !== 1) {
        throw new Error("Definition arity doesn't match");
      }
      let expressions = d.right.map((e) => nodeFromExpression(e));
      for (let i = 0; i < d.left.length; i++) {
        if (expressions.length === 1) {
          this.defintions.set(d.name, {node: expressions[0], port: i});
        } else {
          this.defintions.set(d.name, {node: expressions[i], port: 0});
        }
      }
    }
  }
}

export class LibraryScope extends Scope {
  constructor(parent: Scope, defintions: Map<string, Node>) {
    super(parent);
    definitions.forEach((value: Node, key: string) => {
      this.defintions.set(key, {node: value, port: 0});
    });
  }
}
