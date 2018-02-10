import * as Types from "../types";
import { ReadyValue } from "./ready";

export class StreamEnd extends ReadyValue {
  public constructor() {
    super(new Types.Stream(new Types.Some()));
  }
}
