<script lang="ts" setup>
const { animationName } = defineProps<{
  animationName:
    | "animation-wing-front"
    | "animation-wing-rear"
    | "animation-blinks";
}>();

const sharedState = useSocketState<AnimationState>(animationName);
function onToggleClick() {
  if (sharedState.state.value?.state == "playing")
    sharedState.state.value.state = "stop";
  else sharedState.state.value!.state = "start";
}
</script>

<template>
  <template v-if="sharedState.state.value">
    <button class="btn" @click="onToggleClick">
      <template v-if="sharedState.state.value?.state == 'playing'">
        <span>Stop</span>
        <icon name="mdi:stop" size="25" />
        <span class="loading loading-spinner loading-lg max-w-8" />
      </template>
      <template v-else>
        <span>Start</span>
        <icon name="mdi:play" size="25" />
      </template>
    </button>
  </template>
  <template v-else>
    <span class="loading loading-spinner loading-lg max-w-8" />
  </template>
</template>
