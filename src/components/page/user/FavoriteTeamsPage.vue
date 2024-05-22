<script setup lang="ts">
import {EllipsisVerticalIcon,} from '@heroicons/vue/20/solid'
import {Menu, MenuButton, MenuItem, MenuItems} from '@headlessui/vue'
import useUser from "@/service/user.ts";
import {Paths} from "@/router.ts";
import {vAutoAnimate} from "@formkit/auto-animate/vue";
import {Bars3BottomLeftIcon} from "@heroicons/vue/24/solid";
import Button from "@/components/atom/Button.vue";

const user = useUser();
</script>

<template>
  <header class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="lg:flex lg:items-center lg:justify-between">
        <div class="min-w-0 flex-1">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Favorite Teams</h2>
        </div>
      </div>
    </div>
  </header>

  <main>
    <div class="mx-auto max-w-7xl pb-32 px-4 sm:px-6 lg:px-8">
      <!-- Favorite teams list. -->
      <ul v-if="user.favoriteTeams.value.length > 0" v-auto-animate role="list" class="mt-8 divide-y divide-gray-100">
        <li v-for="team in user.favoriteTeams.value" :key="team.id" class="flex items-center justify-between gap-x-6 py-5">
          <div class="min-w-0 flex items-center">
            <img :src="team.crest" class="size-10" alt="crest" />
            <div class="ml-4">
              <div class="flex items-start gap-x-3">
                <p class="text-sm font-semibold leading-6 text-gray-900">{{ team.name }}</p>
              </div>
              <div class="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                <p class="whitespace-nowrap">
                  {{ team.shortName }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-none items-center gap-x-4">
            <router-link :to="{name: Paths.TEAM.name, params: { id: team.id }}"
                         class="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">
              View team
            </router-link>

            <!-- Team menu. -->
            <Menu as="div" class="relative flex-none">
              <MenuButton class="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                <span class="sr-only">Open options</span>
                <EllipsisVerticalIcon class="h-5 w-5" aria-hidden="true"/>
              </MenuButton>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                    class="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <MenuItem class="sm:hidden" v-slot="{ active }">
                    <router-link :to="{name: Paths.TEAM.name, params: { id: team.id }}"
                                 :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">View team
                    </router-link>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a @click="user.toggleFavorite(team)"
                       :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer']">Remove</a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </li>
      </ul>

      <!-- Empty view. -->
      <div v-else class="mt-24 text-center">
        <Bars3BottomLeftIcon class="mx-auto size-12 text-gray-300"/>
        <h3 class="mt-2 text-sm font-semibold text-gray-900">No favorites</h3>
        <p class="mt-1 text-sm text-gray-500">Mark teams as favorite to get started.</p>
        <div class="mt-6">
          <router-link :to="{name: Paths.HOME.name}">
            <Button color="indigo">Explore teams</Button>
          </router-link>
        </div>
      </div>

    </div>
  </main>
</template>

<style scoped>

</style>
