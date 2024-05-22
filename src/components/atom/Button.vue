<script setup lang="ts">
const props = withDefaults(defineProps<{ color?: 'gray' | 'indigo' }>(), {color: 'gray'});
</script>

<template>
  <button type="button" class="rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset"
          :class="{
            'bg-indigo-600 text-white ring-indigo-700/10 hover:bg-indigo-500': props.color === 'indigo',
            'bg-white text-gray-900 ring-gray-300 hover:bg-gray-50': props.color === 'gray',
          }"
  >
    <slot/>
  </button>
</template>

<style scoped lang="postcss">

</style>
