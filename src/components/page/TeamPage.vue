<script setup lang="ts">
import {ref} from "vue";
import moment from "moment/moment";
import useBackend from "@/service/backend.ts";

const props = defineProps<{ id: number }>();

const backend = useBackend();
const team = ref(await backend.getTeam(props.id));
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{{ team.name }}</h2>
        </div>
      </div>
    </div>
  </header>

  <main>
    <div class="mx-auto max-w-7xl pb-32 px-4 sm:px-6 lg:px-8">
      <!-- Team. -->
      <h2 class="mt-10 mx-auto max-w-2xl text-base font-semibold leading-6 text-gray-900 lg:mx-0 lg:max-w-none">Players</h2>

      <div class="-mx-4 mt-8 sm:-mx-0">
        <table class="min-w-full divide-y divide-gray-300">
          <thead>
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Name</th>
            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Position</th>
            <th scope="col" class="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Nationality</th>
            <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Age</th>
          </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="player in team.squad" :key="player.id">
            <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{ player.name }}</td>
            <td class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">{{ player.position }}</td>
            <td class="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 lg:table-cell">{{ player.nationality }}</td>
            <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ moment(player.dateOfBirth).fromNow(true) }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
