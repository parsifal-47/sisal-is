import * as Types from "../types";
import { ReadyValue } from "./ready";

export class Float extends ReadyValue {
  public value: number;
  public constructor(n: number) {
    super(new Types.Float());
    this.value = n;
  }
}
