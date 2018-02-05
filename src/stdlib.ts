import { Scope } from "./scope";

export class StdLibBuilder {
  static build(): Scope {
    return new Scope(null, new Map());
  }
}
