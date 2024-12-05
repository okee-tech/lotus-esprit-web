import hardwareConfig from "#utils/hardware-configuration";
import { SharedState } from "./2.socket-shared-state";
import { Gpio, Mode } from "@okee-tech/rppal";

const gpio = new Gpio();
const servoPins = hardwareConfig.servos.map((servo) => gpio.get(servo.pin));
const motorPins = hardwareConfig.motors.map((motor) => gpio.get(motor.pin));
servoPins.forEach((servo) => {
  servo.mode = Mode.Output;
  servo.value = 0;
});
motorPins.forEach((motor) => {
  motor.mode = Mode.Output;
  motor.value = 0;
});

function onServoUpdate(localState: SharedState<ServoSharedState>) {
  const state = localState.state;
  const servoPin = servoPins.find(
    (servo) => `servo/${servo.pin}` === localState.stateId
  )!;
  const config = hardwareConfig.servos.find(
    (servo) => `servo/${servo.pin}` === localState.stateId
  );

  if (!state) return console.error("State was not initialized");
  if (!servoPin || !config) return (state.error = "Servo was not initialized");

  if (!state.isEnabled) {
    servoPin.clearPwm();
    servoPin.value = 0;
    return;
  }

  const dutyRange = config.pwmDutyRange.max - config.pwmDutyRange.min;
  const angleRange = config.angleRange.max - config.angleRange.min;
  const dutyDuration =
    dutyRange * (state.angle / angleRange) + config.pwmDutyRange.min;
  const duty = dutyDuration / (1 / config.pwmFrequency);

  console.log(
    `Setting servo ${config.pin} to ${state.angle}°, ${Math.round(dutyDuration * 1e6)}us, ${Math.round(duty * 100)}% duty`
  );
  servoPin.setPwm(config.pwmFrequency, duty);
}

function onMotorUpdate(state: SharedState<MotorSharedState>) {
  const motorPin = motorPins.find(
    (motor) => `motor/${motor.pin}` === state.stateId
  )!;
  if (!state.state) return console.error("State was not initialized");
  if (!motorPin) return console.error("Motor was not initialized");

  console.log(`Setting motor ${state.stateId} to ${state.state.isEnabled}`);
  motorPin.value = state.state.isEnabled ? 1 : 0;
}

async function hardwareRoutine() {
  const sharedServos = hardwareConfig.servos.map((motor) => {
    return SharedState.get<ServoSharedState>(`servo/${motor.pin}`, {
      angle: 0,
      isEnabled: false,
    });
  });

  const sharedMotors = hardwareConfig.motors.map((servo) => {
    return SharedState.get<MotorSharedState>(`motor/${servo.pin}`, {
      isEnabled: false,
    });
  });

  sharedServos.forEach((state) =>
    state.on("update", () => onServoUpdate(state))
  );
  sharedMotors.forEach((state) =>
    state.on("update", () => onMotorUpdate(state))
  );
}

export default defineNitroPlugin(hardwareRoutine);
