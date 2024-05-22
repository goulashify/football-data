<script setup lang="ts">
// Handle reloads.
import {onErrorCaptured, ref, watch} from "vue";
import ErrorCard from "@/components/organism/ErrorCard.vue";
import CenteredLoader from "@/components/molecule/CenteredLoader.vue";
import Frame from "@/components/organism/Frame.vue";
import router from "@/router.ts";

// State.
const suspenseErr = ref<Error>();

// Capture errors from the suspense setup functions (and no others – eg watchers, etc.).
// See https://vuejs.org/error-reference/#runtime-errors.
onErrorCaptured((e, instance, info) => {
  const isSetupError = ['setup function', 0].includes(info);
  if (!isSetupError) return;
  console.error(`Captured error from setup function of "${instance?.$options.__name}", showing retry view.`, e);

  // Show error view.
  suspenseErr.value = e;
});

// Reset error when navigating between pages (so loading spinner shows properly).
watch(router.currentRoute, (curr, prev) => suspenseErr.value = (curr.fullPath !== prev.fullPath ? undefined : suspenseErr.value))

// Event handlers.
function onReload() {
  document.location.reload();
}
</script>

<template>
  <Frame>
    <RouterView v-slot="{ Component }">
      <template v-if="Component">
        <!-- timeout="0" is needed here to show the loading spinner between component changes. -->
        <Suspense timeout="0">
          <!-- The content itself. -->
          <component :is="Component"></component>

          <template #fallback>
            <div>
              <!-- Loader. -->
              <CenteredLoader v-if="!suspenseErr"/>

              <!-- Error view. -->
              <ErrorCard @reload="onReload" v-else/>
            </div>
          </template>
        </Suspense>
      </template>
    </RouterView>
  </Frame>
</template>

<style>
</style>
