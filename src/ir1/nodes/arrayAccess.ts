import * as AST from "../../ast/expression";
import { nodeFromExpression } from "../create";
import { SingleValuePort } from "../ports/single";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import { checkType } from "../types/check";
import * as Values from "../values";
import { Node } from "./node";

export class ArrayAccess extends Node {
  private nodes: Node[];

  constructor(arraySource: Node, defintion: AST.ArrayAccess, scope: Scope) {
    super("ArrayAccess", defintion);
    this.nodes = [];
    this.nodes.push(arraySource);
    this.nodes.push(nodeFromExpression(defintion.index, scope));

    this.addInPorts(this.nodes);

    this.outPorts = [new SingleValuePort((type: Types.ReadyType) => this.fetchData(type))];
  }

  public fetchData(type: Types.ReadyType): Values.ReadyValue {
    const array = this.inPorts[0].getData(new Types.Array(new Types.Some()));
    const index = this.inPorts[1].getData(new Types.Integer());

    if (array instanceof Values.ErrorValue || index instanceof Values.ErrorValue) {
      return new Values.ErrorValue("Cannot fetch array element");
    }
    const arrayType = array.type as Types.Array;
    const subType = arrayType.element;

    if (!checkType(subType, type)) {
      return new Values.ErrorValue("Incompartible type: " +
                        subType.toString() + ", " + type.toString());
    }

    const integerIndex = index as Values.Integer;
    const arrayValue = array as Values.Array;

    if (!arrayValue.values[integerIndex.value]) {
      return new Values.ErrorValue("Array index is out of bounds: " + integerIndex.value);
    }

    return arrayValue.values[integerIndex.value];
  }
}
