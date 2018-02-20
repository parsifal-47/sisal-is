import { Port } from "../ir1/ports/port";
import { Node } from "../ir1/nodes/node";
import { Scope } from "../ir1/scopes/scope";
import * as Types from "../ir1/types";
import * as Values from "../ir1/values";
import { SingleValuePort } from "../ir1/ports/single";

export class FunctionWrap extends Node {
  private scope: Scope;
  private bodyFactory: Values.BodyFactory;
  private args: string[];
  private signature: Types.Function;

  constructor(scope: Scope, name: string, args: string[],
              signature: Types.Function, bodyFactory: Values.BodyFactory) {
    super(name);
    this.scope = scope;
    this.args = args;
    this.signature = signature;
    this.bodyFactory = bodyFactory;
    this.outPorts.push(new SingleValuePort((type: Types.ReadyType) => this.fetchData(type)));
  }

  public fetchData(type: Types.ReadyType): Values.ReadyValue {
    if (!Types.checkType(this.signature, type)) {
      return new Values.ErrorValue("Incompartible type, given: " +
                  JSON.stringify(this.signature) + ", requested: " + JSON.stringify(type));
    }

    return new Values.Function(this.signature, this.args, this.bodyFactory, this.scope);
  }
}
