import { SharedState } from "./2.socket-shared-state";

// const gpio = new Gpio();
// const p2 = gpio.get(2);

async function onPwmUpdate(newValue: number[]) {
  console.log("Pwm update FROM SERVER: ", newValue);
}

async function pwmRoutine() {
  const pwmState = SharedState.get<number[]>("pwm", [10]);
  pwmState.on("update", onPwmUpdate);
}

export default defineNitroPlugin((_nitroApp) => {
  pwmRoutine();
});
