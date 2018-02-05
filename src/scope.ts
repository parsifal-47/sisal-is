import * as Ir1 from "./ir1";
import { Definition } from "./ast/definition"

interface NodeWithPort {
  node: Ir1.Node;
  port: number;
}

export class Scope {
  private parentScope?: Scope;
  private Map<string, NodeWithPort> defintions;
  public constructor(parent: Scope, definitions: Map<string, Ir1.Node>) {
    this.parentScope = parent;
    definitions.forEach((value: Ir1.Node, key: string) => {
      this.defintions.set(key, {node: value, port: 0});
    });
  }
  public constructor(parent: Scope, definitions: Definition[]) {
    for (d in definitions) {
      if (d.left.length !== d.right.length && d.right.length !== 1) {
        throw new Error("Definition arity doesn't match");
      }
      let expressions = d.right.map((e) => new Expression(e));
      for (let i = 0; i < d.left.length; i++) {
        if (expressions.length === 1) {
          this.defintions.set(d.name, {node: expressions[0], port: i});
        } else {
          this.defintions.set(d.name, {node: expressions[i], port: 0});
        }
      }
    }
  }
  public resolve(name: string): Ir1.Node {
    if (defintions.has(name)) {
      return defintions.get(name);
    }
    if (!parentScope) {
      return null;
    }
    return parentScope.resolve(name);
  }
}
