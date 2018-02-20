import { Expression } from "../../ast/expression";
import { Node } from "../nodes/node";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import { ReadyValue } from "./ready";

export type BodyFactory = (scope: Scope) => Node[];

export class Function extends ReadyValue {
  public bodyFactory: BodyFactory;
  public scope: Scope;
  public argumentNames: string[];

  public constructor(type: Types.Function, argumentNames: string[],
                     bodyFactory: BodyFactory, scope: Scope) {
    super(type);
    this.argumentNames = argumentNames;
    this.bodyFactory = bodyFactory;
    this.scope = scope;
  }
}
