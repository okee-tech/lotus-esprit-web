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
  initialAngle: 0,
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
  initialAngle: 0,
};

const hardwareConfig: {
  servos: ServoConfig[];
  motors: MotorConfig[];
  toggleMotors: ToggleMotor[];
} = {
  servos: [
    { ...BIG_SERVO, pin: 2, name: "Big Rear Left" },
    { ...BIG_SERVO, pin: 3, name: "Big Rear Right" },
    { ...BIG_SERVO, pin: 4, name: "Big Front Left" },
    { ...BIG_SERVO, pin: 17, name: "Big Front Right" },
    { ...BIG_SERVO, pin: 27, name: "Big Font Gun Open" },

    { ...SMALL_SERVO, pin: 22, name: "Small ..." },
    { ...SMALL_SERVO, pin: 10, name: "Small ..." },
    { ...SMALL_SERVO, pin: 9, name: "Small ..." },
    { ...SMALL_SERVO, pin: 11, name: "Small ..." },
  ],
  motors: [
    { pin: 5, name: "Lamp" },
    { pin: 6, name: "RR" },
    { pin: 13, name: "RL" },
    { pin: 19, name: "LR" },
    { pin: 26, name: "LL" },
  ],
  toggleMotors: [
    {
      in1: 21,
      in2: 20,
    },
  ],
};

export default hardwareConfig;
export type { ServoConfig, MotorConfig };
