import { Definition } from "./definition";
import { Expression } from "./expression";
import { Node } from "./node";

export interface LoopExpression extends Node {
  range?: RangeList;
  init: Definition[];
  preCondition?: Expression;
  postCondition?: Expression;
  body: Definition[];
  returns: Expression[];
}

export function isLoopExpression(node: Node): node is LoopExpression {
  return node.type === "Loop";
}

export interface RangeList extends Node {
  names: string[];
  ranges: Expression[];
}

export function isRangeList(node: Node): node is RangeList {
  return node.type === "RangeList";
}
