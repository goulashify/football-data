<script setup lang="ts">
import {computed, ref} from "vue";
import {Paths} from "@/router.ts";

import {ChevronRightIcon} from '@heroicons/vue/20/solid'
import {vElementVisibility} from '@vueuse/components';
import {vAutoAnimate} from "@formkit/auto-animate/vue"
import CenteredLoader from "@/components/molecule/CenteredLoader.vue";
import useBackend, {ShortTeam} from "@/service/backend.ts";

const backend = useBackend();

// Competition.
const rawCompetitions = ref(await backend.listCompetitions());
const competitions = computed(() => rawCompetitions.value.filter(c => new Date(c.currentSeason.endDate).getTime() > Date.now()));


// Teams.
const teams = ref([] as ShortTeam[]);
const teamsLoading = ref(false);
const teamsPageToken = ref(undefined as undefined | number)
const canLoadMoreTeams = computed(() => teams.value.length === 0 || (teams.value.length > 0 && teamsPageToken.value !== undefined));

async function onTeamLoaderEnterViewport(loaderInViewport: boolean) {
  if (!loaderInViewport) return;
  if (teamsLoading.value) return;
  if (!canLoadMoreTeams.value) return;

  try {
    teamsLoading.value = true;
    let {results, nextPageToken} = await backend.listTeams(teamsPageToken.value, 30);
    teams.value.push(...results);
    teamsPageToken.value = nextPageToken;
  } catch (e) {
    console.error(`Error during loading teams.`, e);
  }

  teamsLoading.value = false;
}

// Load the first page of teams.
onTeamLoaderEnterViewport(true);
</script>

<template>
  <main>
    <div class="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
      <!-- List of in-season competitions. -->
      <div class="mt-10">
        <div class="sm:flex sm:items-center sm:justify-between">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900">Playing Now</h2>
        </div>

        <div class="mt-4 flow-root">
          <div class="-my-2">
            <div class="relative box-content overflow-x-auto py-2 xl:overflow-visible">
              <div class="min-w-screen-xl absolute flex space-x-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0 xl:gap-y-6">
                <router-link v-for="comp in competitions" :key="comp.id" :to="{name: Paths.LEAGUE.name, params: { code: comp.code }}"
                             class="border border-gray-200 relative flex h-80 w-56 flex-col overflow-hidden rounded-lg p-6 hover:shadow-sm hover:border-gray-300 transition ease-out xl:w-auto h-80">
                  <span aria-hidden="true" class="absolute inset-0 p-12">
                    <img :src="comp.emblem" alt="" class="object-cover"/>
                  </span>
                  <span class="relative mt-auto text-center text-xl font-bold text-gray-600">{{ comp.name }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Teams. -->
      <div class="py-24">
        <div class="sm:flex sm:items-center sm:justify-between">
          <h2 class="text-2xl font-bold tracking-tight text-gray-900">Teams</h2>
        </div>

        <ul v-auto-animate role="list" class="mt-4 divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
          <!-- Teams. -->
          <li v-for="team in teams" :key="team.id" class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
            <div class="flex gap-x-4">
              <img class="h-12 w-12 flex-none bg-gray-50" :src="team.crest" alt=""/>
              <div class="min-w-0 flex-auto">
                <p class="text-sm font-semibold leading-6 text-gray-900">
                  <router-link :to="{ name: Paths.TEAM.name, params: { id: team.id } }">
                    <span class="absolute inset-x-0 -top-px bottom-0"/>
                    {{ team.name }}
                  </router-link>
                </p>
                <p class="mt-1 flex text-xs leading-5 text-gray-500">
                  <span class="relative truncate hover:underline">{{ team.shortName }}</span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-x-4">
              <div class="hidden sm:flex sm:flex-col sm:items-end">
                <p v-if="true" class="text-xs leading-5 text-gray-500">
                  View team
                </p>
                <div v-else class="mt-1 flex items-center gap-x-1.5">
                  <div class="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div class="h-1.5 w-1.5 rounded-full bg-emerald-500"/>
                  </div>
                  <p class="text-xs leading-5 text-gray-500">Online</p>
                </div>
              </div>
              <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true"/>
            </div>
          </li>

          <!-- Loading indicator. -->
          <li v-if="canLoadMoreTeams" v-element-visibility="[onTeamLoaderEnterViewport, {}]"
              class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
            <CenteredLoader class="!mt-0"/>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
