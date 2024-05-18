<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <main class="mx-auto max-w-md w-full mt-24">
    <header class="text-2xl">Mega counter is <span id="mega-counter">{{count}}</span></header>
    <button class="bg-gray-200 py-2.5 px-3 rounded-md mt-4" @click="count += 1">turn up</button>
  </main>


</template>

<style>
</style>
