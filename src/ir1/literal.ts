import { Subscriber } from "./subscriber"
import { Publisher } from "./publisher"
import { Node } from "./node"
import * as Value from "./value";
import * as AST from "../ast/literal";

export class LiteralNode implements Node {
  name: string;
  inPorts: Subscriber[];
  outPorts: Publisher[];

  constructor(defintion: AST.Literal) {
    if (!AST.isLiteral(defintion)) {
      throw new Error("Trying to construct literal from " + JSON.stringify(defintion));
    }

    if (AST.isBooleanLiteral(defintion)) {
      this.outPorts.push(new SingleValuePublisher(
        {
          type: Api.LiteralType.Boolean,
          value: defintion.value ? 1 : 0,
        } as Value.LiteralValue));
        return;
    }

    if (AST.isNumericLiteral(defintion)) {
      this.outPorts.push(new SingleValuePublisher(
        {
          type: Api.LiteralType.Float,
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

class SingleValuePublisher implements Publisher {
  private subscribers: Subscriber[];
  private data: Value.Value;

  public constructor(data: Value.Value) {
    this.data = data;
    this.subscribers = [];
  }

  public requestData() {
    for (let sub of this.subscribers) {
      sub.next(data);
      sub.complete();
    }
  }

  public subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }
}
