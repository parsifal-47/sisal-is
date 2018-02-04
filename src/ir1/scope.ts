import * as Api from "./api";

export class Scope {
  private parentScope?: Scope;
  private Map<string, Api.Node> defintions;
  public constructor(parent: Scope, definitions: Map<string, Api.Node>) {
    this.parentScope = parent;
    this.defintions = definitions;
  }
  public constructor(parent: Scope, definitions: peg.OutputFormatBare) {

  }
  public resolve(name: string): Api.Node {
    if (defintions.has(name)) {
      return defintions.get(name);
    }
    if (!parentScope) {
      return null;
    }
    return parentScope.resolve(name);
  }
}
