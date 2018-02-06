import { Subscriber } from "../streams/subscriber"
import { Publisher } from "../streams/publisher"
import { Node } from "./node"
import * as Value from "./value";
import * as AST from "../ast";
import { SingleValuePublisher } from "../streams/value";

export class Literal extends Node {

  constructor(defintion: AST.Literal) {
    super("Literal");

    if (!AST.isLiteral(defintion)) {
      throw new Error("Trying to construct literal from " + JSON.stringify(defintion));
    }

    if (AST.isBooleanLiteral(defintion)) {
      this.outPorts.push(new SingleValuePublisher(
        {
          type: Value.LiteralType.Boolean,
          value: defintion.value ? 1 : 0,
        } as Value.LiteralValue));
        return;
    }

    if (AST.isNumericLiteral(defintion)) {
      this.outPorts.push(new SingleValuePublisher(
        {
          type: Value.LiteralType.Float,
          value: defintion.value,
        } as Value.LiteralValue));
        return;
    }

    if (AST.isStringLiteral(defintion)) {
      this.outPorts.push(new SingleValuePublisher(
        {
          stringValue: defintion.value,
        } as Value.StringValue));
        return;
    }
    throw new Error("Unexpected literal type " + JSON.stringify(defintion));
  }
}
