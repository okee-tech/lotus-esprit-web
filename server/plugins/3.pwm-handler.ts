import type { NitroAppIo } from "./1.socket-io";

// const gpio = new Gpio();
// const p2 = gpio.get(2);

async function onPwmUpdate(newValue: number) {
  console.log("Pwm update FROM SERVER: ", newValue);
}

async function pwmRoutine(nitroApp: NitroAppIo) {
  const { io } = nitroApp;

  io.of("/shared-state").on("connection", (socket) => {
    socket.on("state-change", ({ stateId, state }) => {
      if (stateId == "pwm") onPwmUpdate(state);
    });
  });
}

export default defineNitroPlugin((nitroApp) => {
  pwmRoutine(nitroApp as NitroAppIo);
});
