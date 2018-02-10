import * as Types from "../types";
import { ReadyValue } from "./ready";

export class CompleteStream extends ReadyValue {
  public values: ReadyValue[];
  public constructor(values: ReadyValue[]) {
    super(new Types.Stream(values[0].type));
    this.values = values;
  }
}
