import { Node } from "../nodes/node";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import { ReadyValue } from "./ready";

export class Function extends ReadyValue {
  public nodes: Node[];
  public scope: Scope;

  public constructor(type: Types.Function, nodes: Node[], scope: Scope) {
    super(type);
    this.nodes = nodes;
    this.scope = scope;
  }
}
