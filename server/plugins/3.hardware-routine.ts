import hardwareConfig, {
  type AnimationState,
} from "#utils/hardware-configuration";
import { DateTime } from "luxon";
import { SharedState } from "./2.socket-shared-state";
import { Gpio, Mode } from "@okee-tech/rppal";

const gpio = new Gpio();
const servoPins = hardwareConfig.servos.map((servo) => gpio.get(servo.pin));
const motorPins = hardwareConfig.motors.map((motor) => gpio.get(motor.pin));
const toggleMotorsPins = hardwareConfig.toggleMotors.map((motor) => ({
  in1: gpio.get(motor.in1),
  in2: gpio.get(motor.in2),
}));
servoPins.forEach((servo) => {
  servo.mode = Mode.Output;
  servo.value = 0;
});
motorPins.forEach((motor) => {
  motor.mode = Mode.Output;
  motor.value = 0;
});
toggleMotorsPins.forEach((motor) => {
  motor.in1.mode = Mode.Output;
  motor.in2.mode = Mode.Output;
  motor.in1.value = 0;
  motor.in2.value = 0;
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
  const angle = Math.min(
    Math.max(state.angle, config.angleRange.min),
    config.angleRange.max
  );
  const dutyDuration =
    dutyRange * (angle / angleRange) + config.pwmDutyRange.min;
  const duty = dutyDuration / (1 / config.pwmFrequency);

  console.log(
    `Setting servo ${config.pin} to ${angle}°, ${Math.round(
      dutyDuration * 1e6
    )}us, ${Math.round(duty * 100)}% duty`
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

function onToggleMotorUpdate(state: SharedState<ToggleMotorSharedState>) {
  const motorPins = toggleMotorsPins.find(
    (motor) =>
      `toggle-motor/${motor.in1.pin}-${motor.in2.pin}` === state.stateId
  );
  if (!motorPins) return console.error("Motor was not initialized");
  console.log(`Setting motor ${state.stateId} to ${state.state?.state}`);

  if (state.state?.state == "stop") {
    motorPins.in1.value = 0;
    motorPins.in2.value = 0;
  } else if (state.state?.state == "forward") {
    motorPins.in1.value = 1;
    motorPins.in2.value = 0;
  } else if (state.state?.state == "backward") {
    motorPins.in1.value = 0;
    motorPins.in2.value = 1;
  } else {
    console.error("Invalid motor state");
    motorPins.in1.value = 0;
    motorPins.in2.value = 0;
  }
}

const WING_REPEATS = 3;
const WING_ANIMATION_DURATION = 15000;
const animationStarts: Map<string, DateTime> = new Map();
async function wingAnimation(state: SharedState<AnimationState>) {
  if (state.state?.state == "start") {
    animationStarts.set(state.stateId, DateTime.now());
    state.state = { state: "playing" };
  }

  const startState = animationStarts.get(state.stateId);
  if (!startState) return console.error("Animation start not found");
  const animationDuration = -startState.diffNow("milliseconds");

  const rightConf = hardwareConfig.servos.find((el) =>
    state.stateId == "animation-wing-front"
      ? el.name == "Front Left Wing"
      : el.name == "Rear Left Wing"
  );
  const rightPin = SharedState.get<ServoSharedState>(`servo/${rightConf!.pin}`);
  if (!rightPin) {
    console.error("Servo not found");
    state.state!.state = "stop";
    return;
  }

  const leftConf = hardwareConfig.servos.find((el) =>
    state.stateId == "animation-wing-front"
      ? el.name == "Front Right Wing"
      : el.name == "Rear Right Wing"
  );
  const leftPin = SharedState.get<ServoSharedState>(`servo/${leftConf!.pin}`);
  if (!leftPin) {
    console.error("Servo not found");
    state.state!.state = "stop";
    return;
  }

  if (state.state?.state == "stop") {
    leftPin.state = { angle: leftConf!.initialAngle, isEnabled: true };
    onServoUpdate(leftPin);
    rightPin.state = { angle: rightConf!.initialAngle, isEnabled: true };
    onServoUpdate(rightPin);
    animationStarts.delete(state.stateId);
    return;
  }

  const progress = animationDuration / WING_ANIMATION_DURATION;
  const offset = Math.sin(progress * (Math.PI * 2) * WING_REPEATS) * 45;

  leftPin.state = { angle: leftConf!.initialAngle + offset, isEnabled: true };
  onServoUpdate(leftPin);
  rightPin.state = {
    angle: rightConf!.initialAngle - offset,
    isEnabled: true,
  };
  onServoUpdate(rightPin);

  setTimeout(() => wingAnimation(state), 20);
}

const BLINK_INTERVAL = 1000;
const BLINK_DURATION = 300;
async function blinkAnimation(state: SharedState<AnimationState>) {
  if (state.state?.state == "start") state.state = { state: "playing" };

  const blinkConf = hardwareConfig.motors.find((el) => el.name == "Blinks");
  const blinksPin = SharedState.get<MotorSharedState>(
    `motor/${blinkConf?.pin}`
  );
  if (!blinksPin) {
    console.error("Motor not found");
    state.state = { state: "stop" };
    return;
  }

  if (state.state?.state == "stop") {
    blinksPin.state = { isEnabled: false };
    onMotorUpdate(blinksPin);
    return;
  }

  blinksPin.state = { isEnabled: true };
  onMotorUpdate(blinksPin);
  await new Promise((r) => setTimeout(r, BLINK_DURATION));

  blinksPin.state = { isEnabled: false };
  onMotorUpdate(blinksPin);

  setTimeout(() => blinkAnimation(state), BLINK_INTERVAL);
}

async function triggerAnimations(state: SharedState<AnimationState>) {
  const triggerConf = hardwareConfig.servos.find((el) =>
    state.stateId == "animation-gun-front"
      ? el.name == "Front Gun"
      : el.name == "Rear Gun"
  );
  const triggerPin = SharedState.get<ServoSharedState>(
    `servo/${triggerConf!.pin}`
  );
  if (!triggerPin) {
    console.error("Servo not found");
    state.state = { state: "stop" };
    return;
  }

  if (state.state?.state == "start") {
    state.state = { state: "playing" };
    triggerPin.state = {
      angle: triggerConf!.softwareRange.max,
      isEnabled: true,
    };
    onServoUpdate(triggerPin);
  }

  if (state.state?.state == "stop") {
    triggerPin.state = {
      angle: triggerConf!.softwareRange.min,
      isEnabled: true,
    };
    onServoUpdate(triggerPin);
  }
}

async function onAnimationUpdate(state: SharedState<AnimationState>) {
  console.log(
    `Setting animation to ${state.state?.state} for ${state.stateId}`
  );

  if (state.state?.state == "start") {
    if (
      state.stateId == "animation-wing-front" ||
      state.stateId == "animation-wing-rear"
    ) {
      wingAnimation(state);
      setTimeout(() => {
        state.state = { state: "stop" };
      }, WING_ANIMATION_DURATION);
    }

    if (state.stateId == "animation-blinks") blinkAnimation(state);
  }

  if (
    state.stateId == "animation-gun-front" ||
    state.stateId == "animation-gun-rear"
  )
    triggerAnimations(state);
}

async function hardwareRoutine() {
  const sharedServos = hardwareConfig.servos.map((motor) => {
    const state = SharedState.get<ServoSharedState>(`servo/${motor.pin}`, {
      angle: motor.initialAngle,
      isEnabled: true,
    });
    onServoUpdate(state);

    return state;
  });

  const sharedMotors = hardwareConfig.motors.map((servo) => {
    const state = SharedState.get<MotorSharedState>(`motor/${servo.pin}`, {
      isEnabled: false,
    });

    onMotorUpdate(state);
    return state;
  });

  const sharedToggleMotors = hardwareConfig.toggleMotors.map((motor) => {
    const state = SharedState.get<ToggleMotorSharedState>(
      `toggle-motor/${motor.in1}-${motor.in2}`,
      {
        state: "stop",
      }
    );

    onToggleMotorUpdate(state);
    return state;
  });

  sharedServos.forEach((state) =>
    state.on("update", () => onServoUpdate(state))
  );
  sharedMotors.forEach((state) =>
    state.on("update", () => onMotorUpdate(state))
  );
  sharedToggleMotors.forEach((state) =>
    state.on("update", () => onToggleMotorUpdate(state))
  );

  const windAnimationState = SharedState.get<AnimationState>(
    "animation-wing-front",
    {
      state: "stop",
    }
  );
  windAnimationState.on("update", () => onAnimationUpdate(windAnimationState));

  const wingAnimationRearState = SharedState.get<AnimationState>(
    "animation-wing-rear",
    {
      state: "stop",
    }
  );
  wingAnimationRearState.on("update", () =>
    onAnimationUpdate(wingAnimationRearState)
  );

  const blinkAnimationState = SharedState.get<AnimationState>(
    "animation-blinks",
    {
      state: "stop",
    }
  );
  blinkAnimationState.on("update", () =>
    onAnimationUpdate(blinkAnimationState)
  );

  const gunAnimationState = SharedState.get<AnimationState>(
    "animation-gun-front",
    {
      state: "stop",
    }
  );
  gunAnimationState.on("update", () => onAnimationUpdate(gunAnimationState));

  const gunAnimationRearState = SharedState.get<AnimationState>(
    "animation-gun-rear",
    {
      state: "stop",
    }
  );
  gunAnimationRearState.on("update", () =>
    onAnimationUpdate(gunAnimationRearState)
  );
}

export default defineNitroPlugin(hardwareRoutine);
