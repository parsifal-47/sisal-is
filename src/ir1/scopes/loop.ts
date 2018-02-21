import * as AST from "../../ast";
import { nodeFromExpression } from "../create";
import { Node } from "../nodes/node";
import { ReadyLiteral } from "../nodes/ready";
import { Port } from "../ports/port";
import * as Types from "../types";
import { ReadyType } from "../types/ready";
import * as Values from "../values";
import { FlatScope } from "./flat";
import { Scope } from "./scope";

export class LoopScope implements Scope {
  public parentScope: Scope;
  private initScope: FlatScope;
  private iterationScopes: FlatScope[];
  private ranges: Array<[string, Port]>;
  private nodes: Node[];
  private localNames: Set<string>;
  private maxOffset: number = -1;
  private rangeNodes: Node[][];

  private preCondition?: AST.Expression;
  private postCondition?: AST.Expression;
  private body: AST.Definition[];

  public constructor(parent: Scope, body: AST.Definition[],
                     range?: AST.RangeList, init?: AST.Definition[],
                     preCondition?: AST.Expression, postCondition?: AST.Expression) {
    this.parentScope = parent;
    this.iterationScopes = [];
    this.rangeNodes = [];

    this.initScope = new FlatScope(this.parentScope);
    this.localNames = new Set();
    if (init) {
      this.initScope.addFromAST(init);
      for (const definition of init) {
        for (const name of definition.left) {
          this.localNames.add(name);
        }
      }
    }

    for (const definition of body) {
      for (const name of definition.left) {
        this.localNames.add(name);
      }
    }

    this.ranges = [];
    this.nodes = [];
    let currentName = 0;
    if (range) {
      for (const expression of range.ranges) {
        const node = nodeFromExpression(expression, this.parentScope);
        this.nodes.push(node);
        for (const port of node.outPorts) {
          if (currentName >= range.names.length) {
            throw new Error("Range should produce equal number of outPorts");
          }
          this.ranges.push([range.names[currentName], port]);
          this.localNames.add(range.names[currentName]);
          currentName++;
        }
      }
    }

    this.body = body;
    this.preCondition = preCondition;
    this.postCondition = postCondition;
  }

  public resolve(name: string, type: Types.ReadyType, offset: number): Values.ReadyValue {
    if (this.localNames.has(name)) {
      if (!Types.checkType(new Types.Stream(new Types.Some()), type)) {
        return new Values.ErrorValue("All names are streams inside loop");
      }
      if (this.ranges.length > 0 && this.maxOffset === -1) {
        this.maxOffset = 1;
        for (const pair of this.ranges) {
          const stream = Values.fetchComplete(pair[1], new Types.Some()) as Values.CompleteStream;
          this.maxOffset *= stream.values.length;

          const rangeNodes: Node[] = [];
          for (const value of stream.values) {
            rangeNodes.push(new ReadyLiteral(value));
          }
          this.rangeNodes.push(rangeNodes);
        }
      }

      if (offset >= this.maxOffset) {
        return new Values.StreamEnd();
      }

      for (let i = 0; i <= offset; i++) {
        if (!this.iterationScopes[i]) {
          const prevScope = this.iterationScopes[i - 1] ?
                            this.iterationScopes[i - 1] : this.initScope;

          if (this.preCondition && !this.checkCondition(this.preCondition, prevScope)) {
            break;
          }

          this.iterationScopes[i] = new FlatScope(this.parentScope);
          this.iterationScopes[i].oldScope = prevScope;
          this.iterationScopes[i].addFromAST(this.body);

          let iterationOffset = i;
          for (let j = 0; j < this.rangeNodes.length; j++) {
            this.iterationScopes[i].inject(this.ranges[j][0],
              this.rangeNodes[j][iterationOffset % this.rangeNodes[j].length].outPorts[0]);
            iterationOffset /= this.rangeNodes[j].length;
          }

          if (this.postCondition && !this.checkCondition(this.postCondition, this.iterationScopes[i])) {
            break;
          }
        }
      }

      if (!this.iterationScopes[offset]) {
        return new Values.StreamEnd();
      }

      return new Values.StreamElement(this.iterationScopes[offset].resolve(name, type, 0));
    }

    return this.parentScope.resolve(name, type, offset);
  }

  private checkCondition(preCondition: AST.Expression, scope: Scope): boolean {
    const node = nodeFromExpression(preCondition, scope);
    const condition = node.outPorts[0].getData(new Types.Boolean()) as Values.Boolean;
    return condition.value;
  }
}
