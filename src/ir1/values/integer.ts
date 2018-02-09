import * as Types from "../types";
import { ReadyValue } from "./ready";

export class Integer extends ReadyValue {
  public value: number;
  public constructor(value: number) {
    super(new Types.Integer());
    this.value = value;
  }
}
