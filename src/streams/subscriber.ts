import { Value } from "../ir1/value"

export interface Subscriber {
  next: (value: Value) => void;
  complete: () => void;
}
