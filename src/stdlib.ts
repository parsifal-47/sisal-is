import { Scope } from "./ir1/scopes/scope";
import { FlatScope } from "./ir1/scopes/flat";

export class StdLibBuilder {
  public static build(): Scope {
    return new FlatScope(undefined);
  }
}
