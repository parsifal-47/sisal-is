import * as AST from "../../ast/expression";
import * as GML from "../../graphml/";
import { nodeFromExpression } from "../create";
import { StreamPort } from "../ports/stream";
import { FlatScope } from "../scopes/flat";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import { checkType } from "../types/check";
import * as Values from "../values";
import { Node, subGraphML } from "./node";

export class FunctionCall extends Node {
  private nodes: Node[];
  private functionBody: Node[];
  private callScope?: FlatScope;

  constructor(functionSource: Node, defintion: AST.FunctionCall, scope: Scope) {
    super("FunctionCall", defintion);
    this.nodes = [];
    this.nodes.push(functionSource);

    for (const expression of defintion.arguments) {
      this.nodes.push(nodeFromExpression(expression, scope));
    }

    this.addInPorts(this.nodes);
    this.functionBody = [];
    this.outPorts = [];
  }

  public requestPorts(portNum: number): number {
    for (let i = 0; i < portNum; i++) {
      this.outPorts = [new StreamPort((type: Types.ReadyType, offset: number) => this.fetchData(i, type, offset))];
    }
    return portNum;
  }

  public fetchData(portNum: number, type: Types.ReadyType, offset: number): Values.ReadyValue {
    if (this.callScope) {
      return this.fetchReadyData(portNum, type, offset);
    }

    const args: Types.ReadyType[] = [];

    for (let i = 1; i < this.inPorts.length; i++) {
      args.push(this.inPorts[i].getData(new Types.Some()).type);
    }

    const returns: Types.ReadyType[] = this.outPorts.map(() => new Types.Some());
    returns[portNum] = type;

    const value: Values.ReadyValue = this.inPorts[0].getData(new Types.Function(args, returns));

    if (value instanceof Values.ErrorValue) {
      return new Values.ErrorValue("Cannot fetch function body");
    }

    const functionValue = value as Values.Function;
    this.callScope = new FlatScope(functionValue.scope);

    this.functionBody = functionValue.bodyFactory(this.callScope);

    for (let i = 0; i < functionValue.argumentNames.length; i++) {
      this.callScope.inject(functionValue.argumentNames[i], this.inPorts[i + 1]);
    }

    return this.fetchReadyData(portNum, type, offset);
  }

  public graphML(): string {
    return this.graphMLInternal(GML.makeGraph("function", subGraphML(this.functionBody)));
  }

  private fetchReadyData(portNum: number, type: Types.ReadyType, offset: number): Values.ReadyValue {
    return this.functionBody[portNum].outPorts[0].getData(type, offset);
  }
}
