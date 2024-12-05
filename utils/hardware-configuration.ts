type Range = {
  min: number;
  max: number;
};

type ServoConfiguration = {
  pin: number;
  angleRange: Range;
  pwmFrequency: number;
  pwmDutyRange: Range; // In Seconds
};
type MotorConfiguration = {
  pin: number;
};

const BIG_SERVO: ServoConfiguration = {
  pin: -1,
  angleRange: {
    min: 0,
    max: 180,
  },
  pwmFrequency: 50,
  pwmDutyRange: {
    min: 500e-6,
    max: 2_500e-6,
  },
};
const SMALL_SERVO: ServoConfiguration = {
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
};

const hardwareConfig: {
  servos: ServoConfiguration[];
  motors: MotorConfiguration[];
} = {
  servos: [
    { ...BIG_SERVO, pin: 2 },
    { ...BIG_SERVO, pin: 3 },
    { ...BIG_SERVO, pin: 4 },
    { ...BIG_SERVO, pin: 17 },
    { ...BIG_SERVO, pin: 27 },
    //
    { ...SMALL_SERVO, pin: 10 },
    { ...SMALL_SERVO, pin: 9 },
    { ...SMALL_SERVO, pin: 11 },
  ],
  motors: [{ pin: 0 }, { pin: 5 }, { pin: 6 }, { pin: 13 }],
};

export default hardwareConfig;
