import * as Types from "../types";
import { ReadyValue } from "./ready";

export class Type extends ReadyValue {
  public value: ReadyType;
  public constructor(value: ReayType) {
    super(new Types.Type());
    this.value = value;
  }
}
