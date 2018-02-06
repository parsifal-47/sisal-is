import { Publisher } from "./publisher"

export class LookupPublisher implements Publisher {
  private subscribers: Subscriber[];
  private scope: Scope;
  private name: string;

  public constructor(name: string, scope: Scope) {
    this.scope = scope;
    this.name = name;
    this.subscribers = [];
  }

  public requestData(type: Type) {
    const data = this.scope.lookup(this.name, type);
    for (let sub of this.subscribers) {
      sub.next(data);
      sub.complete();
    }
  }

  public subscribe(subscriber: Subscriber) {
    this.subscribers.push(subscriber);
  }
}
