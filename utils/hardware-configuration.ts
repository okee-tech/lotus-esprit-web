type Range = {
  min: number;
  max: number;
};

type ServoConfig = {
  pin: number;
  angleRange: Range;
  pwmFrequency: number;
  pwmDutyRange: Range; // In Seconds
  name: string;
  softwareRange: Range;
  initialAngle: number;
};
type MotorConfig = {
  pin: number;
  name: string;
};

type ToggleMotor = {
  in1: number;
  in2: number;

  name: string;
};

const BIG_SERVO: ServoConfig = {
  pin: -1,
  angleRange: {
    min: 0,
    max: 270,
  },
  pwmFrequency: 50,
  pwmDutyRange: {
    min: 500e-6,
    max: 2_500e-6,
  },
  name: "Big Servo",
  softwareRange: {
    min: 0,
    max: 270,
  },
  initialAngle: 135,
};
const SMALL_SERVO: ServoConfig = {
  pin: -1,
  angleRange: {
    min: 0,
    max: 270,
  },
  pwmFrequency: 50,
  pwmDutyRange: {
    min: 500e-6,
    max: 2_500e-6,
  },
  name: "Small Servo",
  softwareRange: {
    min: 0,
    max: 270,
  },
  initialAngle: 135,
};

type AnimationState = {
  state: "start" | "playing" | "stop";
};

const hardwareConfig: {
  servos: ServoConfig[];
  motors: MotorConfig[];
  toggleMotors: ToggleMotor[];
} = {
  servos: [
    {
      ...BIG_SERVO,
      pin: 2,
      name: "Rear Left Wing",
      softwareRange: { min: 90, max: 180 },
    },
    {
      ...BIG_SERVO,
      pin: 3,
      name: "Rear Right Wing",
      softwareRange: { min: 90, max: 180 },
    },
    {
      ...BIG_SERVO,
      pin: 4,
      name: "Front Left Wing",
      softwareRange: { min: 90, max: 180 },
    },
    {
      ...BIG_SERVO,
      pin: 17,
      name: "Front Right Wing",
      softwareRange: { min: 90, max: 180 },
    },
    {
      ...BIG_SERVO,
      pin: 27,
      name: "Front Gun Open",
      softwareRange: { min: 70, max: 155 },
      initialAngle: 70,
    },

    {
      ...SMALL_SERVO,
      pin: 22,
      name: "Front Gun",
      softwareRange: { min: 130, max: 190 },
      initialAngle: 130,
    },
    { ...SMALL_SERVO, pin: 10, name: "Number Plate" },
    {
      ...SMALL_SERVO,
      pin: 9,
      name: "Rear Gun",
      softwareRange: { min: 125, max: 180 },
      initialAngle: 125,
    },
    { ...SMALL_SERVO, pin: 11, name: "Rear Plate" },
  ],
  motors: [
    { pin: 5, name: "Blinks" },
    { pin: 6, name: "Motor 1" },
    { pin: 13, name: "Motor 2" },
    { pin: 19, name: "Motor 3" },
    { pin: 26, name: "Motor 3" },
  ],
  toggleMotors: [
    {
      in1: 21,
      in2: 20,

      name: "Roof",
    },
  ],
};

export default hardwareConfig;
export type { ServoConfig, MotorConfig, ToggleMotor, AnimationState };
