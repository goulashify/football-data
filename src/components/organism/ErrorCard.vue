<script setup lang="ts">
import {ExclamationCircleIcon} from "@heroicons/vue/24/outline";
import {Paths} from "@/router.ts";
import Button from "@/components/atom/Button.vue";

const emit = defineEmits<{ (e: 'reload'): void }>();
</script>

<template>
  <section class="mx-auto my-12 relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left transition-all sm:max-w-sm sm:p-6">
    <div>
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <ExclamationCircleIcon class="h-6 w-6 text-red-600" aria-hidden="true"/>
      </div>
      <div class="mt-3 text-center sm:mt-5">
        <h2 class="text-base font-semibold leading-6 text-gray-900">
          <slot name="title">Unable to load page</slot>
        </h2>
        <div class="mt-2">
          <p class="text-sm text-gray-500">
            <slot name="description">Please try again or get in touch with our team for further help</slot>
          </p>
        </div>
      </div>
    </div>
    <div class="mt-5 sm:mt-6 flex flex-col gap-y-2">
      <slot name="actions" :reload="() => emit('reload')">
        <Button color="indigo" @click="emit('reload')" class="w-full py-2 px-3">Reload page</Button>
        <Button class="w-full py-2 px-3">Contact support</Button>
        <router-link :to="{name: Paths.HOME.name }" class="mx-auto mt-2 text-sm text-gray-500">Go to home page</router-link>
      </slot>
    </div>
  </section>
</template>

<style scoped lang="postcss">

</style>
