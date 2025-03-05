<script lang="ts" setup>
import hardwareConfig from "#utils/hardware-configuration";
import ToggleMotorController from "~/components/ToggleMotorController.vue";
</script>

<template>
  <div class="flex flex-col">
    <span class="text-2xl text-bold">Animations</span>
    <div class="grid-cols-1 md:grid-cols-2 gap-4 grid">
      <div class="p-4 shadow-lg flex flex-row items-center gap-4 w-full">
        <span class="text-xl"> Front Wings </span>
        <animation-toggle
          animation-name="animation-wing-front"
          class="w-full flex-1"
        />
      </div>
      <div class="p-4 shadow-lg flex flex-row items-center gap-4 w-full">
        <span class="text-xl"> Rear Wings </span>
        <animation-toggle
          animation-name="animation-wing-rear"
          class="w-full flex-1"
        />
      </div>
      <div class="p-4 shadow-lg flex flex-row items-center gap-4 w-full">
        <span class="text-xl"> Blinks </span>
        <animation-toggle
          animation-name="animation-blinks"
          class="w-full flex-1"
        />
      </div>
      <div class="p-4 shadow-lg flex flex-row items-center gap-4 w-full">
        <span class="text-xl"> Front Gun </span>
        <animation-toggle
          animation-name="animation-blinks"
          class="w-full flex-1"
        />
      </div>
      <div class="p-4 shadow-lg flex flex-row items-center gap-4 w-full">
        <span class="text-xl"> Rear Gun </span>
        <animation-toggle
          animation-name="animation-blinks"
          class="w-full flex-1"
        />
      </div>

      <div
        v-for="(motor, i) in hardwareConfig.toggleMotors"
        :key="i"
        class="p-4 shadow-lg flex flex-row items-center gap-4 w-full"
      >
        <div class="flex flex-col mb-2 w-full justify-center">
          <div class="text-xl font-bold mb-2">{{ motor.name }}</div>
          <ToggleMotorController :config="motor" class="w-full" />
        </div>
      </div>
    </div>

    <separator class="h-px my-8 bg-base-200" />

    <span class="text-2xl text-bold">Manual Configuration</span>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
      <template v-for="(servo, i) in hardwareConfig.servos" :key="i">
        <div
          class="flex flex-col mb-4 w-full border-solid border rounded-xl border-base-300"
        >
          <div class="text-xl font-bold">{{ servo.name }}</div>
          <ServoController :config="servo" />
        </div>
      </template>
    </div>
    <div class="h-4" />

    <div class="grid grid-cols-2 text-center place-items-center">
      <template v-for="(motor, i) in hardwareConfig.motors" :key="i">
        <div class="flex flex-col mb-2">
          <div class="text-xl font-bold">{{ motor.name }}</div>
          <MotorController :config="motor" />
        </div>
      </template>
    </div>
  </div>
</template>
