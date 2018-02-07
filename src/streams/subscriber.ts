import { ReadyValue } from "../ir1/values/ready"

export interface Subscriber {
  next: (value: ReadyValue) => void;
  complete: () => void;
}
