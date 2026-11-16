<script setup lang="ts">
import SiteHeader from "@/components/SiteHeader.vue";
</script>

<template>
  <SiteHeader />
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
  <footer class="foot">
    Feito por Pedro Lopes ·
    <a href="https://www.pedrolopes.tech" target="_blank" rel="noopener noreferrer">pedrolopes.tech</a> ·
    <a href="https://github.com/Pedrolopesh/quest-game-frontend" target="_blank" rel="noopener noreferrer">código</a>
  </footer>
</template>

<style>
.foot {
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
  padding: 40px 20px;
}
</style>
