<script setup lang="ts">

import ProcessRing from "@/components/atom/ProcessRing.vue";
</script>

<template>
  <div class="mx-auto mt-36 w-full flex flex-col items-center justify-center">
    <ProcessRing :track="false" :progress="60" class="!size-8 !stroke-gray-400 transform-none animate-spin"/>
  </div>
</template>

<style scoped lang="postcss">

</style>
