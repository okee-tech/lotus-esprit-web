<script lang="ts" setup>
const { config } = defineProps<{
  config: ServoConfig;
}>();

const sharedState = useSocketState<ServoSharedState>(`servo/${config.pin}`);
function onToggleClick() {
  sharedState.state.value!.isEnabled = !sharedState.state.value?.isEnabled;
}
</script>

<template>
  <div class="grid grid-cols-3 place-items-center p-2">
    <template v-if="sharedState.state.value">
      <button class="btn w-1/2" @click="onToggleClick">
        <template v-if="!sharedState.state.value?.isEnabled">
          <span>Start</span>
          <icon name="mdi:play" size="25" />
        </template>
        <template v-else>
          <span>Stop</span>
          <icon name="mdi:stop" size="25" />
        </template>
      </button>

      <div class="col-span-2 w-full flex flex-col">
        <div>
          Angle: {{ Math.round(sharedState.state.value.angle * 10) / 10 }}°
        </div>
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <input
          v-model="sharedState.state.value.angle"
          class="range"
          :class="{ 'opacity-30': !sharedState.state.value.isEnabled }"
          type="range"
          :min="config.softwareRange.min"
          :max="config.softwareRange.max"
          :step="0.1"
        />
      </div>
    </template>
    <template v-else>
      <span class="loading loading-spinner loading-lg max-w-8" />
    </template>
  </div>
</template>
