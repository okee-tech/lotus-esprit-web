<script lang="ts" setup>
import hardwareConfig from "#utils/hardware-configuration";
</script>

<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
      <template v-for="(servo, i) in hardwareConfig.servos" :key="i">
        <div
          class="flex flex-col mb-4 w-full border-solid border rounded-xl border-base-300"
        >
          <div class="text-xl font-bold">Servo: {{ i + 1 }}</div>
          <ServoController :config="servo" />
        </div>
      </template>
    </div>
    <div class="h-4" />

    <div class="grid grid-cols-2 text-center place-items-center">
      <template v-for="(motor, i) in hardwareConfig.motors" :key="i">
        <div class="flex flex-col mb-2">
          <div class="text-xl font-bold">Motor: {{ i + 1 }}</div>
          <MotorController :config="motor" />
        </div>
      </template>
    </div>
  </div>
</template>
