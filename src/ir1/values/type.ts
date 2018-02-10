import * as Types from "../types";
import { ReadyValue } from "./ready";

export class Type extends ReadyValue {
  public value: Types.ReadyType;
  public constructor(value: Types.ReadyType) {
    super(new Types.Type());
    this.value = value;
  }
}
