<script lang="ts" setup>
const { config } = defineProps<{
  config: ServoConfig;
}>();
</script>

<template>
  <div>{{ config }}</div>
</template>
