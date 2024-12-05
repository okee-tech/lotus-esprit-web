enum ServoAnimations {
  Linear,
  Jumping,
  Sine,
}

type ServoSharedState = {
  angle: number;
  isEnabled: boolean;

  error?: string;
  runningAnimation?: ServoAnimations;
  animationFrequency?: number;
};

type MotorSharedState = {
  isEnabled: boolean;

  error?: string;
};
