<script setup lang="ts">
import {computed, reactive, toRaw} from "vue";
import {vAutoAnimate} from "@formkit/auto-animate/vue";
import * as R from "ramda";
import {Paths} from "@/router.ts";
import SortableTableHeader from "@/components/molecule/SortableTableHeader.vue";
import useBackend from "@/service/backend.ts";
import useUser from "@/service/user.ts";
import {HeartIcon} from "@heroicons/vue/24/outline";

const props = defineProps<{ code: string }>();

const user = useUser();
const backend = useBackend();
const {competition, standings: rawStandings} = await backend.listStandings(props.code);

// Sorting.
const sortKeys = reactive({} as { [k: string]: 'asc' | 'desc' });

/**
 * ASSUMPTION: field keys are non-numerical strings (so insertion order is preserved in objects).
 */
const standings = computed(() => {
  // Prepare sort functions in reverse order (eg last filter first).
  const sortedProperties = Object.entries(sortKeys).reverse().map(([prop, direction]) => {
    let path = R.path(prop.split('.'));
    return direction === 'asc' ? R.ascend(path) : R.descend(path);
  });

  // Copy and sort.
  const nextStandings = structuredClone(toRaw(rawStandings));
  nextStandings.forEach(g => g.table = R.sortWith(sortedProperties, g.table));
  return nextStandings;
});

</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">{{ competition.name }}</h2>
        </div>
      </div>
    </div>
  </header>

  <main>
    <div class="mx-auto max-w-7xl pb-32 px-4 sm:px-6 lg:px-8">
      <!-- Standings. -->
      <h2 class="mt-10 mx-auto max-w-2xl text-base font-semibold leading-6 text-gray-900 lg:mx-0 lg:max-w-none">Leaderboard</h2>

      <div class="mt-8 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-300">
              <thead>
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">#</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  <SortableTableHeader v-model="sortKeys" property="team.name">Team</SortableTableHeader>
                </th>
                <th scope="col" class="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  <SortableTableHeader v-model="sortKeys" property="points">Points</SortableTableHeader>
                </th>
                <th scope="col" class="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  <SortableTableHeader v-model="sortKeys" property="playedGames">Games</SortableTableHeader>
                </th>
                <th scope="col" class="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  <SortableTableHeader v-model="sortKeys" property="goalsFor">Goals</SortableTableHeader>
                </th>
                <th scope="col" class="hidden sm:table-cell relative py-3.5 pl-3 pr-4 sm:pr-0"></th>
              </tr>
              </thead>
              <tbody v-auto-animate class="divide-y divide-gray-200 bg-white">
              <template v-for="standing in standings">
                <tr v-if="standings.length > 1" class="border-t border-gray-200">
                  <th colspan="6" scope="colgroup" class="bg-gray-50 py-2 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-3">
                    {{ standing.group }}
                  </th>
                </tr>
                <tr v-for="pos in standing.table" :key="pos.team.id">
                  <td class="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0 w-[3ch]">
                    <span class="text-gray-300 font-bold text-4xl">{{ pos.position }}</span>
                  </td>
                  <td class="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    <div class="flex items-center">
                      <div class="h-11 w-11 flex-shrink-0">
                        <img class="h-11 w-11" :src="pos.team.crest" alt=""/>
                      </div>
                      <router-link :to="{name: Paths.TEAM.name, params: { id: pos.team.id }}" class="ml-4 group">
                        <div class="font-medium text-gray-900 group-hover:underline">{{ pos.team.name }}</div>
                        <div class="mt-1 text-gray-500">{{ pos.team.shortName }}</div>
                      </router-link>
                    </div>
                  </td>
                  <td class="hidden sm:table-cell whitespace-nowrap px-3 py-5 text-sm text-gray-500">{{ pos.points }}</td>
                  <td class="hidden sm:table-cell whitespace-nowrap px-3 py-5 text-sm text-gray-500">{{ pos.playedGames }}</td>
                  <td class="hidden sm:table-cell whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    {{ pos.goalsFor }} – {{ pos.goalsAgainst }}
                  </td>
                  <td class="hidden sm:table-cell relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <button @click="user.toggleFavorite(pos.team)">
                      <HeartIcon class="transition size-5 text-gray-400 hover:text-red-600"
                                 :class="[pos.team.id in user.favoriteTeamsMap.value ? 'text-red-600 fill-red-600' : '']"/>
                    </button>
                  </td>
                </tr>
              </template>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>
