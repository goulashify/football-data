<script setup lang="ts">

import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/vue/20/solid";
import {computed} from "vue";

type Direction = 'asc' | 'desc';

const props = defineProps<{ property: string }>()
const model = defineModel<{ [k: string]: Direction }>({default: {}});
const direction = computed<undefined | Direction>(() => model.value[props.property]);

function onSort() {
  // We go 'asc' -> 'desc' -> none.
  if (!direction.value) return model.value[props.property] = 'asc';
  if (direction.value === 'asc') return model.value[props.property] = 'desc';
  if (direction.value === 'desc') return delete model.value[props.property];
}
</script>

<template>
  <a @click="onSort" class="group inline-flex cursor-pointer">
    <slot/>

    <span class="ml-2 flex-none rounded"
          :class="{
              'invisible text-gray-400 group-hover:visible': !direction,
              'bg-gray-100 text-gray-900 group-hover:bg-gray-200': direction !== undefined,
          }"
    >
      <ChevronUpIcon v-if="direction === 'desc'" class="h-5 w-5 flex-none rounded text-gray-400"/>
      <ChevronDownIcon v-else class="h-5 w-5 flex-none rounded text-gray-400"/>
    </span>
  </a>
</template>

<style scoped lang="postcss">

</style>
