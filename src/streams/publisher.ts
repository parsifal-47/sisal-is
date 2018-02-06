import { Subscriber } from "./subscriber"

export interface Publisher {
  requestData: (dataType: Type) => void;
  subscribe: (subscriber: Subscriber) => void;
}
