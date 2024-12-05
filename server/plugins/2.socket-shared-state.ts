import type { Socket } from "socket.io";
import type { NitroAppIo } from "./1.socket-io";
import EventEmitter from "events";
import type TypedEmitter from "typed-emitter";

type MessageEvents<T = unknown> = {
  update: (state: T) => void;
  subscribe: (socket: Socket) => void;
};

class SharedState<T = unknown> extends (EventEmitter as {
  new <T>(): TypedEmitter<MessageEvents<T>>;
})<T> {
  readonly stateId: string;
  _state?: T;
  isInitialized: boolean;
  clients: Set<string>;

  static io: NitroAppIo["io"];
  static states = new Map<string, SharedState>();

  constructor(stateId: string) {
    super();
    this.stateId = stateId;
    this.isInitialized = false;
    this.clients = new Set();
  }

  static get<T>(stateId: string, initialValue?: T): SharedState<T> {
    if (!SharedState.states.has(stateId)) {
      const newState = new SharedState(stateId);
      newState.state = initialValue as T;
      SharedState.states.set(stateId, newState);
    }

    const state = SharedState.states.get(stateId) as SharedState<T>;
    state.clients.add("server");
    return state;
  }

  public set state(state: T) {
    this._state = state;
    this.isInitialized = true;
    SharedState.io
      .of("/shared-state")
      .to(this.stateId)
      .emit("state-update", state);
  }

  public get state(): T | undefined {
    return this._state;
  }

  public cleanup() {
    this.clients.delete("server");
  }

  static registerSocket(socket: Socket) {
    socket.on("join-room", (stateId: string) => {
      socket.join(stateId);

      if (!SharedState.states.has(stateId))
        SharedState.states.set(stateId, new SharedState(stateId));

      const localState = SharedState.states.get(stateId)!;
      localState.clients.add(socket.id);
      localState.emit("subscribe", socket);
    });

    socket.on("request-state", (stateId: string) => {
      const localState = SharedState.states.get(stateId);
      if (localState)
        socket.emit(
          "current-state",
          localState._state,
          localState.isInitialized
        );
    });

    socket.on("state-change", ({ stateId, state }) => {
      const localState = SharedState.states.get(stateId);
      if (!localState) return;

      localState._state = state;
      localState.isInitialized = true;
      socket.to(stateId).emit("state-update", state);
      localState.emit("update", state);
    });

    socket.on("leave-room", (stateId: string) => {
      const localState = SharedState.states.get(stateId);
      if (!localState) return;

      localState.clients.delete(socket.id);
      if (localState.clients.size === 0) SharedState.states.delete(stateId);
      socket.leave(stateId);
    });

    socket.on("disconnect", () => {
      SharedState.states.forEach((localState, stateId) => {
        if (localState.clients.has(socket.id))
          localState.clients.delete(socket.id);
        if (localState.clients.size === 0) SharedState.states.delete(stateId);
      });
    });
  }
}

export default defineNitroPlugin((nitroApp) => {
  const io = (nitroApp as NitroAppIo).io;

  SharedState.io = io;
  io.of("/shared-state").on("connection", SharedState.registerSocket);
});
export { SharedState };
