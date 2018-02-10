import * as AST from "../ast";
import { nodeFromExpression } from "./create";
import { Node } from "./nodes/node";
import { Port } from "./ports/port";
import * as Types from "./types";
import { ReadyType } from "./types/ready";
import * as Values from "./values";

export class Scope {
  public parentScope?: Scope;
  public definitions: Map<string, Port[]>;

  public constructor(parent: Scope | undefined) {
    this.parentScope = parent;
    this.definitions = new Map();
  }

  public resolve(name: string, type: Types.ReadyType, offset: number): Values.ReadyValue {
    if (this.definitions.has(name)) {
      const candidates = this.definitions.get(name);
      for (const port of candidates!) {
        const value = port.getData(new Types.Some(), offset);
        if (Types.checkType(value.type, type)) {
          return value;
        }
      }
    }
    if (!this.parentScope) {
      return new Values.ErrorValue("Cannot resolve name " + name);
    }
    return this.parentScope.resolve(name, type, offset);
  }
}

export function createFromAST(parent: Scope, definitions: AST.Definition[]): Scope {
  const scope = new Scope(parent);
  for (const d of definitions) {
    if (d.left.length !== d.right.length && d.right.length !== 1) {
      throw new Error("Definition arity doesn't match");
    }
    const expressions = d.right.map((e) => nodeFromExpression(e, parent));
    for (let i = 0; i < d.left.length; i++) {
      let currentDefinitions: Port[] = [];
      if (scope.definitions.has(d.left[i])) {
        currentDefinitions = scope.definitions.get(d.left[i])!;
      }
      if (expressions.length === 1) {
        currentDefinitions.push(expressions[0].outPorts[i]);
      } else {
        currentDefinitions.push(expressions[i].outPorts[0]);
      }
      scope.definitions.set(d.left[i], currentDefinitions);
    }
  }
  return scope;
}

export function createFromMap(parent: Scope, definitions: Map<string, Node[]>): Scope {
  const scope = new Scope(parent);
  definitions.forEach((nodes: Node[], key: string) => {
    scope.definitions.set(key, nodes.map((n) => n.outPorts[0]));
  });
  return scope;
}
