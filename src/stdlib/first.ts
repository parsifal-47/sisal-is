import { Node } from "../ir1/nodes/node";
import { Port } from "../ir1/ports/port";
import { SingleValuePort } from "../ir1/ports/single";
import { Scope } from "../ir1/scopes/scope";
import * as Types from "../ir1/types";
import * as Values from "../ir1/values";

export function firstValueFactory(name: string): Values.BodyFactory {
  return (scope: Scope) => {
    return [new FirstValue(scope, name)];
  };
}

export class FirstValue extends Node {
  private scope: Scope;
  private argument: string;

  constructor(scope: Scope, argument: string) {
    super("LastValue");
    this.scope = scope;
    this.argument = argument;
    this.outPorts.push(new SingleValuePort((type: Types.ReadyType) => this.fetchData(type)));
  }

  public fetchData(type: Types.ReadyType): Values.ReadyValue {
    const param = this.scope.resolve(this.argument, new Types.Stream(type), 0);

    if (param instanceof Values.StreamElement) {
      return param.value;
    }

    return param;
  }
}
