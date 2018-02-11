import { FlatScope } from "./ir1/scopes/flat";
import { Scope } from "./ir1/scopes/scope";

export class StdLibBuilder {
  public static build(): Scope {
    return new FlatScope(undefined);
  }
}
