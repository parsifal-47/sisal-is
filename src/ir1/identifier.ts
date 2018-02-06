import { Node } from "./node"
import { Scope } from "./scope"
import { LookupPublisher } from "../streams/lookup";

export class Identifier extends Node {
  private scope: Scope;

  public constructor(name: string, scope: Scope) {
    super(name);
    this.outPorts = [new LookupPublisher(name, scope)];
    this.scope = scope;
  }
}
