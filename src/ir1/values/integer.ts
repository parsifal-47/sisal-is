import * as Types from "../types";
import { ReadyValue } from "./ready";

export class Integer extends ReadyValue {
  public value: number;
  public constructor(n: number) {
    super(new Types.Integer());
    this.value = n;
  }
}
