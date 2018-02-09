import { Node } from "./node";
import { ReadyType } from "./types/ready";
import { Subscriber } from "../streams/subscriber";
import { nodeFromExpression } from "./create";
import * as AST from "../ast";

interface NodeWithPort {
  node: Node;
  port: number;
}

export class Scope {
  private parentScope?: Scope;
  private defintions: Map<string, NodeWithPort[]>;

  public constructor(parent: Scope | undefined) {
    this.parentScope = parent;
    this.defintions = new Map();
  }

  public resolve(subscriber: Subscriber, name: string, type: ReadyType): Node {
    if (this.defintions.has(name)) {
      return this.defintions.get(name).node;
    }
    if (!this.parentScope) {
      throw new Error("Cannot resolve name " + name);
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
        let currentDefinitions: NodeWithPort[] = [];
        if (this.defintions.has(d.name)) {
          currentDefinitions = this.defintions.get(d.name);
        }
        if (expressions.length === 1) {
          currentDefinitions.push({node: expressions[0], port: i});
        } else {
          currentDefinitions.push({node: expressions[i], port: 0});
        }
        this.defintions.set(d.name, currentDefinitions);
      }
    }
  }
}

export class LibraryScope extends Scope {
  constructor(parent: Scope, defintions: Map<string, Node[]>) {
    super(parent);
    definitions.forEach((nodes: Node[], key: string) => {
      this.defintions.set(key, nodes.map((n) => ({node: n, port: 0})));
    });
  }
}
