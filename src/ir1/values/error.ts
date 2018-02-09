import * as Types from "../types";
import { ReadyValue } from "./ready";

export class ErrorValue extends ReadyValue {
  public value: string;
  public constructor(value: string) {
    super(new Types.Error());
    this.value = value;
  }
}
