import * as Types from "../types";
import { ReadyValue } from "./ready";

export class Boolean extends ReadyValue {
  public value: boolean;
  public constructor(value: boolean) {
    super(new Types.Boolean());
    this.value = value;
  }
}
