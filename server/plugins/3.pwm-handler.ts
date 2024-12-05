import { SharedState } from "./2.socket-shared-state";
import { Gpio, Mode } from "@okee-tech/rppal";

const gpio = new Gpio();
const p2 = gpio.get(2);
p2.mode = Mode.Output;
p2.clearPwm();

async function onPwmUpdate(newValue: number[]) {
  p2.setPwm(newValue[0], 0.5);
  console.log("Pwm update FROM SERVER: ", newValue);
}

async function pwmRoutine() {
  const pwmState = SharedState.get<number[]>("pwm", [10]);
  pwmState.on("update", onPwmUpdate);
}

export default defineNitroPlugin((_nitroApp) => {
  pwmRoutine();
});
