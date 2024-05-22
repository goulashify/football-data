<script lang="ts" setup>
import {computed} from "vue";

const props = withDefaults(defineProps<{ progress: number }>(), {progress: 0});
const stroke = 2;
const radius = 7;
const circumference = computed(() => 2 * Math.PI * radius);
const offset = computed(() => circumference.value * ((100 - props.progress) / 100))
</script>

<template>
  <svg :viewBox="`0 0 ${20} ${20}`" class="inline-block stroke-blue-600 size-5 -rotate-90">
    <circle :cx="10" :cy="10" :r="7" :stroke-width="stroke" class="stroke-gray-200" fill="transparent"></circle>
    <circle :cx="10" :cy="10" :r="7" :stroke-dasharray="`${circumference}px`" :stroke-dashoffset="`${offset}px`"
            :stroke-width="stroke" class="transition-all duration-300 ease-in-out" fill="transparent"
            stroke-linecap="round"></circle>
  </svg>
</template>

<style lang="postcss" scoped>
</style>
