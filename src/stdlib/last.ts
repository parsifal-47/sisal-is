import { Port } from "../ir1/ports/port";
import { Node } from "../ir1/nodes/node";
import { Scope } from "../ir1/scopes/scope";
import { SingleValuePort } from "../ir1/ports/single";
import * as Types from "../ir1/types";
import * as Values from "../ir1/values";

export function lastValueFactory(name: string): Values.BodyFactory {
  return (scope: Scope) => {
    return [new LastValue(scope, name)];
  }
}

export class LastValue extends Node {
  private scope: Scope;
  private argument: string;

  constructor(scope: Scope, argument: string) {
    super("LastValue");
    this.scope = scope;
    this.argument = argument;
    this.outPorts.push(new SingleValuePort((type: Types.ReadyType) => this.fetchData(type)));
  }

  public fetchData(type: Types.ReadyType): Values.ReadyValue {
    let param = this.scope.resolve(this.argument, new Types.Stream(type), 0);
    let lastValue = param;
    let index = 0;

    while (param instanceof Values.StreamElement) {
      lastValue = param;
      param = this.scope.resolve(this.argument, new Types.Stream(type), ++index);
    }

    if (lastValue instanceof Values.StreamElement) {
      return lastValue.value;
    }

    return lastValue;
  }
}
