<script lang="ts" setup>
import hardwareConfig from "#utils/hardware-configuration";

const sharedMotors = hardwareConfig.motors.map((motor) => {
  return useSocketState<MotorSharedState>(`motor/${motor.pin}`, {
    isEnabled: false,
  });
});

const sharedServos = hardwareConfig.servos.map((servo) => {
  return useSocketState<ServoSharedState>(`pwm/${servo.pin}`, {
    angle: 0,
    isEnabled: false,
  });
});
</script>

<template>
  <div class="flex flex-col">
    <div v-for="(servo, i) in sharedServos" :key="i">
      {{ servo.state }}
    </div>
    <div class="h-4" />

    <div v-for="(servo, i) in sharedMotors" :key="i">
      {{ servo.state }}
    </div>
  </div>
</template>
