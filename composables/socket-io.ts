import { io, type Socket } from "socket.io-client";

const sockets = new Map<string, Socket>();

export const useSocket = (namespace: string = "/") => {
  if (!sockets.has(namespace)) sockets.set(namespace, io(namespace));
  const socket = sockets.get(namespace)!;

  onUnmounted(() => {
    if (!sockets.has(namespace)) return;

    socket.disconnect();
    sockets.delete(namespace);
  });

  return socket;
};
