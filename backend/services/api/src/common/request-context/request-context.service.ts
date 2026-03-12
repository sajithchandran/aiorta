import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";
import { RequestContextState } from "./request-context.types";

@Injectable()
export class RequestContextService {
  private readonly storage = new AsyncLocalStorage<RequestContextState>();

  run<T>(state: RequestContextState, callback: () => T): T {
    return this.storage.run(state, callback);
  }

  get(): RequestContextState {
    return this.storage.getStore() ?? { requestId: "unknown" };
  }

  set(partial: Partial<RequestContextState>): void {
    const store = this.storage.getStore();

    if (!store) {
      return;
    }

    Object.assign(store, partial);
  }
}
