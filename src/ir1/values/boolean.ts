import * as Types from "../types";
import { ReadyValue } from "./ready";

export class Boolean extends ReadyValue {
  public value: boolean;
  public constructor(n: number) {
    super(new Types.Boolean());
    this.value = n;
  }
}
