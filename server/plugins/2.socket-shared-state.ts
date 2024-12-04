import type { Socket } from "socket.io";
import type { NitroAppIo } from "./1.socket-io";

interface StateValue<T = unknown> {
  state: T;
  isInitialized: boolean;
  clients: Set<string>;
}
const sharedStates = new Map<string, StateValue>();

function configureSharedStateSocketHandler(socket: Socket) {
  socket.on("join-room", (stateId: string) => {
    socket.join(stateId);

    if (!sharedStates.has(stateId))
      sharedStates.set(stateId, {
        state: undefined,
        isInitialized: false,
        clients: new Set([socket.id]),
      });
    else sharedStates.get(stateId)?.clients.add(socket.id);
  });

  socket.on("request-state", (stateId: string) => {
    const room = sharedStates.get(stateId);
    if (room) socket.emit("current-state", room.state, room.isInitialized);
  });

  socket.on("state-change", ({ stateId, state }) => {
    const room = sharedStates.get(stateId);
    if (!room) return;

    room.state = state;
    room.isInitialized = true;
    socket.to(stateId).emit("state-update", state);
  });

  socket.on("leave-room", (stateId: string) => {
    const room = sharedStates.get(stateId);
    if (!room) return;

    room.clients.delete(socket.id);
    if (room.clients.size === 0) sharedStates.delete(stateId);
    socket.leave(stateId);
  });

  socket.on("disconnect", () => {
    sharedStates.forEach((room, stateId) => {
      if (room.clients.has(socket.id)) room.clients.delete(socket.id);
      if (room.clients.size === 0) sharedStates.delete(stateId);
    });
  });
}

export default defineNitroPlugin((nitroApp) => {
  const io = (nitroApp as NitroAppIo).io;
  io.of("/shared-state").on("connection", configureSharedStateSocketHandler);
});
export { sharedStates };
