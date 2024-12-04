import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import type { NitroApp } from "nitropack/types";

type NitroAppIo = NitroApp & { io: Server };

export default defineNitroPlugin((nitroApp) => {
  const engine = new Engine();
  const io = new Server();

  io.bind(engine);

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        // @ts-expect-error private method and property
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          // @ts-expect-error private method and property
          engine.prepare(peer._internal.nodeReq);
          // @ts-expect-error private method and property
          engine.onWebSocket(
            // @ts-expect-error private method and property
            peer._internal.nodeReq,
            // @ts-expect-error private method and property
            peer._internal.nodeReq.socket,
            peer.websocket
          );
        },
      },
    })
  );

  (nitroApp as NitroAppIo).io = io;
});

export type { NitroAppIo };
