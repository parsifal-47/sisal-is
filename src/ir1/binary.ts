import { Subscriber } from "../streams/subscriber"
import { Publisher } from "../streams/publisher"
import { Node } from "./node"
import * as Value from "./value";
import * as AST from "../ast/literal";

export class BinaryExpression extends Node {
  constructor() {
    super("Binary");
  }
}
