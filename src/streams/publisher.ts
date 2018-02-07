import { Subscriber } from "./subscriber"
import { ReadyType } from "../ir1/types/ready"

export interface Publisher {
  requestData: (dataType: ReadyType) => void;
  subscribe: (subscriber: Subscriber) => void;
}
