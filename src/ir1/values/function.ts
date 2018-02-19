import { Expression } from "../../ast/expression";
import { Node } from "../nodes/node";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import { ReadyValue } from "./ready";

export class Function extends ReadyValue {
  public body: Expression[];
  public scope: Scope;
  public argumentNames: string[];

  public constructor(type: Types.Function, argumentNames: string[],
                     body: Expression[], scope: Scope) {
    super(type);
    this.argumentNames = argumentNames;
    this.body = body;
    this.scope = scope;
  }
}
