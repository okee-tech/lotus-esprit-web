<script lang="ts" setup>
import hardwareConfig from "#utils/hardware-configuration";
</script>

<template>
  <div class="flex flex-col">
    <template
      v-for="servo in hardwareConfig.servos"
      :key="servo.pin * Math.random()"
    >
      <ServoController :config="servo" />
    </template>
    <div class="h-4" />

    <template
      v-for="motor in hardwareConfig.motors"
      :key="motor.pin * Math.random()"
    >
      <MotorController :config="motor" />
    </template>
  </div>
</template>
