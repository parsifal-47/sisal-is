import * as AST from "../../../ast";
import * as ASTTypes from "../../../ast/types";
import { SingleValuePort } from "../../ports/single";
import * as Types from "../../types";
import * as Values from "../../values";
import { Node } from "../node";

export class SomeType extends Node {

  constructor() {
    super("SomeType");

    this.outPorts.push(
      new SingleValuePort((dataType: Types.ReadyType) => new Values.Type(new Types.Some())));
  }
}
