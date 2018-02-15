import * as AST from "../../ast/composite";
import { nodeFromExpression } from "../create";
import { Port } from "../ports/port";
import { SingleValuePort } from "../ports/single";
import { FlatScope } from "../scopes/flat";
import { Scope } from "../scopes/scope";
import * as Types from "../types";
import { ReadyType } from "../types/ready";
import * as Values from "../values";
import { ErrorValue } from "../values/error";
import { ReadyValue } from "../values/ready";
import { Node } from "./node";

export class RecordValue extends Node {
  private scope: FlatScope;

  constructor(record: AST.RecordValue, scope: Scope) {
    super("Record");
    this.scope = new FlatScope(scope);
    this.scope.addFromAST(record.contents);

    this.scope.definitions.forEach((ports: Port[], key: string) => {
      if (ports.length !== 1) {
        throw new Error("Polymorphism among record fields is not allowed");
      }
    });

    this.outPorts = [new SingleValuePort((dataType: Types.ReadyType) => this.fetchData(dataType))];
  }

  public fetchData(type: ReadyType): ReadyValue {
    if (!Types.checkType(new Types.Record(new Map()), type)) {
      return new Values.ErrorValue("Incompartible type, not record");
    }
    const subTypes: Map<string, ReadyType> = new Map();
    this.scope.definitions.forEach((ports: Port[], key: string) => {
      subTypes.set(key, new Types.Some());
    });
    if (type instanceof Types.Record) {
      type.elements.forEach((value: ReadyType, key: string) => {
        subTypes.set(key, value);
      });
    }
    const values: Map<string, ReadyValue> = new Map();
    this.scope.definitions.forEach((ports: Port[], key: string) => {
      values.set(key, Values.fetchComplete(ports[0], subTypes.get(key)!));
      subTypes.set(key, values.get(key)!.type);
    });
    return new Values.Record(new Types.Record(subTypes), values);
  }
}
