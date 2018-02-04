export interface Subscriber {
  next: (value: Value) => void;
  complete: () => void;
}

export interface Publisher {
  requestData: () => void;
  subscribe: (subscriber: Subscriber) => void;
}

export interface Node {
  name: string;
  location: string;
  inPorts: Subscriber[];
  outPorts: Publisher[];
}

export type Value = LiteralValue | StringValue | Node;

export enum LiteralType {
  Integer = "Integer",
  Float = "Float",
  Boolean = "Boolean",
}

export interface LiteralValue {
  type: LiteralType;
  value: number;
}

export interface StringValue {
  stringValue: string;
}
