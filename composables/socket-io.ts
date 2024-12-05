import { io } from "socket.io-client";

export const useSocket = (namespace: string = "/") => {
  return io(namespace);
};
