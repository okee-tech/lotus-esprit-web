<script lang="ts" setup>
const { config } = defineProps<{
  config: MotorConfig;
}>();

const sharedState = useSocketState<MotorSharedState>(`motor/${config.pin}`);
function onToggleClick() {
  sharedState.state.value!.isEnabled = !sharedState.state.value?.isEnabled;
}
</script>

<template>
  <template v-if="sharedState.state.value">
    <button class="btn max-w-40" @click="onToggleClick">
      <template v-if="!sharedState.state.value?.isEnabled">
        <span>Start</span>
        <icon name="mdi:play" size="25" />
      </template>
      <template v-else>
        <span>Stop</span>
        <icon name="mdi:stop" size="25" />
      </template>
    </button>
  </template>
  <template v-else>
    <span class="loading loading-spinner loading-lg" />
  </template>
</template>
