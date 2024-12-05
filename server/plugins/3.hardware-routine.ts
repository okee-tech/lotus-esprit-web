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
  const servoConfig = hardwareConfig.servos.find(
    (servo) => `servo/${servo.pin}` === localState.stateId
  );

  if (!state) return console.error("State was not initialized");
  if (!servoPin || !servoConfig)
    return (state.error = "Servo was not initialized");

  if (!state.isEnabled) {
    servoPin.clearPwm();
    servoPin.value = 0;
    return;
  }

  const duty =
    (state.angle / 180) *
      (servoConfig.pwmDutyRange.max - servoConfig.pwmDutyRange.min) +
    servoConfig.pwmDutyRange.min;

  console.log(`Setting servo ${servoConfig.pin} to ${state.angle}°`);
  servoPin.setPwm(servoConfig.pwmFrequency, duty);
}

function onMotorUpdate(state: SharedState<MotorSharedState>) {
  const motorPin = motorPins.find(
    (motor) => `pwm/${motor.pin}` === state.stateId
  )!;
  if (!state.state) return console.error("State was not initialized");
  if (!motorPin) return console.error("Motor was not initialized");

  console.log(`Setting motor ${state.stateId} to ${state.state.isEnabled}`);
  motorPin.value = state.state.isEnabled ? 1 : 0;
}

async function hardwareRoutine() {
  const sharedMotors = hardwareConfig.servos.map((servo) => {
    return SharedState.get<MotorSharedState>(`servo/${servo.pin}`, {
      isEnabled: false,
    });
  });

  const sharedServos = hardwareConfig.motors.map((motor) => {
    return SharedState.get<ServoSharedState>(`pwm/${motor.pin}`, {
      angle: 0,
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
