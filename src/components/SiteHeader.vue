<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import AppLogo from "@/components/AppLogo.vue";
import { useSession } from "@/stores/session";

const session = useSession();
const scrolled = ref(false);
const onScroll = () => (scrolled.value = window.scrollY > 8);
onMounted(() => {
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  if (session.loggedIn && !session.me) session.loadMe().catch(() => null);
});
onBeforeUnmount(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <header class="header" :class="{ scrolled }">
    <div class="wrap inner">
      <RouterLink to="/" aria-label="Quest Game — início"><AppLogo /></RouterLink>
      <nav aria-label="Principal">
        <RouterLink class="link" to="/ranking">Ranking</RouterLink>
        <RouterLink v-if="session.me?.isAdmin" class="link" to="/admin">Questões</RouterLink>
        <template v-if="session.loggedIn">
          <RouterLink class="btn sm" to="/jogar">Jogar</RouterLink>
          <RouterLink class="me" to="/perfil" :aria-label="`Perfil de ${session.me?.nickname ?? 'jogador'}`">
            {{ (session.me?.nickname ?? "?").slice(0, 1).toUpperCase() }}
          </RouterLink>
        </template>
        <RouterLink v-else class="btn sm" to="/entrar">Entrar</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 30;
  transition: background 0.3s, box-shadow 0.3s;
}
.header.scrolled {
  background: rgba(18, 16, 26, 0.85);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 var(--line);
}
.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}
.inner > a {
  text-decoration: none;
}
nav {
  display: flex;
  align-items: center;
  gap: 24px;
}
.link {
  font-weight: 800;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.2s;
}
.link:hover,
.link.router-link-active {
  color: var(--ink);
}
.me {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--purple);
  font-family: var(--display);
  text-decoration: none;
  box-shadow: 0 0 0 3px var(--surface-2);
  transition: box-shadow 0.2s;
}
.me:hover {
  box-shadow: 0 0 0 3px var(--green);
}
@media (max-width: 600px) {
  nav {
    gap: 12px;
  }
  .link {
    display: none;
  }
}
</style>
