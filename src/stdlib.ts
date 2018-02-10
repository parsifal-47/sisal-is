import { Scope } from "./ir1/scope";

export class StdLibBuilder {
  public static build(): Scope {
    return new Scope(null, new Map());
  }
}
