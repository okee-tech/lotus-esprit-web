<script lang="ts" setup>
const { sharedName } = defineProps<{
  sharedName: "animation-gun-front" | "animation-gun-rear";
}>();

const sharedState = useSocketState<AnimationState>(sharedName);

function onToggleDown() {
  sharedState.state.value!.state = "start";
}

function onMouseUp() {
  sharedState.state.value!.state = "stop";
}
</script>

<template>
  <template v-if="sharedState.state.value">
    <div class="flex flex-row btn-group w-full">
      <button
        class="btn flex-1"
        @mousedown="onToggleDown()"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
        @touchstart="onToggleDown()"
        @touchend="onMouseUp"
        @touchcancel="onMouseUp"
      >
        Trigger
        <span
          v-if="sharedState.state.value.state == 'playing'"
          class="loading loading-spinner loading-lg max-w-8"
        />
      </button>
    </div>
  </template>
  <template v-else>
    <span class="loading loading-spinner loading-lg max-w-8" />
  </template>
</template>
