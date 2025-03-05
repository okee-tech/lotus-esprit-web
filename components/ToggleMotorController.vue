<script lang="ts" setup>
import type { ToggleMotor } from "~/utils/hardware-configuration";

const { config } = defineProps<{
  config: ToggleMotor;
}>();

const sharedState = useSocketState<ToggleMotorSharedState>(
  `toggle-motor/${config.in1}-${config.in2}`,
  { state: "stop" }
);

function onToggleDown(direction: "forward" | "backward") {
  console.log(config, direction);
  sharedState.state.value!.state = direction;
}

function onMouseUp() {
  sharedState.state.value!.state = "stop";
}
</script>

<template>
  <template v-if="sharedState.state.value">
    <div class="flex flex-row btn-group">
      <button
        class="btn max-w-40"
        @mousedown="onToggleDown('forward')"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @touchstart="onToggleDown('forward')"
        @touchend="onMouseUp"
        @touchcancel="onMouseUp"
      >
        Forward
      </button>
      <button
        class="btn max-w-40"
        @mousedown="onToggleDown('backward')"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @touchstart="onToggleDown('backward')"
        @touchend="onMouseUp"
        @touchcancel="onMouseUp"
      >
        Backward
      </button>
    </div>
  </template>
  <template v-else>
    <span class="loading loading-spinner loading-lg" />
  </template>
</template>
