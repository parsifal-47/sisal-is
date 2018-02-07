import { Publisher } from "./publisher"
import { Subscriber } from "./subscriber"
import { ReadyType } from "../ir1/types/ready"
import { Scope } from "../ir1/scope"

export class LookupPublisher implements Publisher, Subscriber {
  private subscribers: Subscriber[];
  private scope: Scope;
  private name: string;

  public constructor(name: string, scope: Scope) {
    this.scope = scope;
    this.name = name;
    this.subscribers = [];
  }

  public requestData(type: ReadyType) {
    this.scope.resolve(this, this.name, type);
  }

  public next(data: ReadyValue) {
    for (let sub of this.subscribers) {
      sub.next(data);
    }
  }

  public complete() {
    for (let sub of this.subscribers) {
      sub.complete();
    }
  }

  public subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }
}
