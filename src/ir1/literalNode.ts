import * as Api from "./api";
import * as AST from "./ast";

export class LiteralNode implements Api.Node {
  name: string;
  location: string;
  inPorts: Subscriber[];
  outPorts: Publisher[];

  constructor(defintion: AST.Literal) {

  }
}
