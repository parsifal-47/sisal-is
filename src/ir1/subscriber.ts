import { Value } from "./value"

export interface Subscriber {
  next: (value: Value) => void;
  complete: () => void;
}
