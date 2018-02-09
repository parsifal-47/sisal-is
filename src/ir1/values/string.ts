import * as Types from "../types";
import { ReadyValue } from "./ready";

export class String extends ReadyValue {
  public value: string;
  public constructor(value: string) {
    super(new Types.String());
    this.value = value;
  }
}
