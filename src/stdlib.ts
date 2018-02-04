import * as Api from "./ir1/api";
import { Scope } from "./ir1/scope";

export class StdLibBuilder {
  static build(): Scope {
    return new Scope(null, new Map());
  }
}
