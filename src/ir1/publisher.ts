import { Subscriber } from "./subscriber"

export interface Publisher {
  requestData: () => void;
  subscribe: (subscriber: Subscriber) => void;
}
