<script lang="ts" setup>
const { config } = defineProps<{
  config: MotorConfig;
}>();

const sharedState = useSocketState<ToggleMotorSharedState>(
  `toggle-motor/${config.pin}`,
  { state: "stop" }
);
function onToggleClick() {
  sharedState.state.value!.isEnabled = !sharedState.state.value?.isEnabled;
}

function onToggleDown(direction: "forward" | "backward") {
  
}
</script>

<template>
  <template v-if="sharedState.state.value">
    <div class="flex flex-row btn-group">
      <button class="btn max-w-40" @click="onToggleClick">
        Forward
      </button>
    </div>
  </template>
  <template v-else>
    <span class="loading loading-spinner loading-lg" />
  </template>
</template>
