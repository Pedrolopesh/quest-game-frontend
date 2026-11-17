<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { gamesApi, publicApi } from "@/api";
import type { Game, Subject } from "@/api/types";
import { friendly } from "@/lib/messages";
import { useSession } from "@/stores/session";

const router = useRouter();
const route = useRoute();
const session = useSession();
const subjects = ref<Subject[]>([]);
const current = ref<Game | null>(null);
const loading = ref(true);
const starting = ref("");
const error = ref("");
const ICONS: Record<string, string> = { exatas: "🧮", humanas: "🏛️", natureza: "🧪" };

async function start(slug: string) {
  if (starting.value) return;
  starting.value = slug;
  error.value = "";
  try {
    const game = await gamesApi.start(slug);
    await router.push(`/partida/${game._id}`);
  } catch (e) {
    error.value = friendly(e);
    starting.value = "";
  }
}

onMounted(async () => {
  try {
    const [s, g] = await Promise.all([publicApi.subjects(), gamesApi.current(), session.me ? null : session.loadMe()]);
    subjects.value = s;
    current.value = g;
    const wanted = route.query.materia;
    if (typeof wanted === "string" && !g && s.some((x) => x.slug === wanted)) await start(wanted);
  } catch (e) {
    error.value = friendly(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="wrap play">
    <header class="head">
      <h1>Oi, {{ session.me?.nickname ?? "jogador" }}! Escolha a matéria</h1>
      <p class="muted">São 3 fases com 3 perguntas cada. Quanto mais difícil, mais pontos.</p>
    </header>

    <div v-if="current" class="resume card">
      <div>
        <strong>Você tem uma partida de {{ current.subject?.title }} em andamento.</strong>
        <p class="muted">Fase {{ current.phase }} de 3 · {{ current.score }} pontos até agora</p>
      </div>
      <RouterLink class="btn sm" :to="`/partida/${current._id}`">Continuar</RouterLink>
    </div>

    <p v-if="error" class="error" role="alert">{{ error }}</p>

    <div v-if="loading" class="subjects" aria-busy="true">
      <div v-for="n in 3" :key="n" class="sub skeleton"></div>
    </div>
    <div v-else class="subjects">
      <button
        v-for="(s, i) in subjects"
        :key="s.slug"
        type="button"
        class="sub"
        :class="`s-${i}`"
        :disabled="Boolean(starting)"
        :style="{ '--i': i }"
        @click="start(s.slug)"
      >
        <i aria-hidden="true">{{ ICONS[s.slug] ?? "❓" }}</i>
        <h2>{{ s.title }}</h2>
        <p>{{ s.description }}</p>
        <span class="go">{{ starting === s.slug ? "Sorteando perguntas…" : current ? "Começar nova partida" : "Começar ▶" }}</span>
      </button>
    </div>
  </main>
</template>

<style scoped>
.play {
  padding: 30px 0 40px;
}
.head h1 {
  font-size: clamp(2rem, 4.4vw, 3rem);
}
.head p {
  margin: 8px 0 26px;
  font-size: 1.1rem;
}
.resume {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  margin-bottom: 26px;
  border-color: var(--gold);
  animation: rise-in 0.4s var(--ease) both;
}
.resume p {
  margin: 4px 0 0;
}
.subjects {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.sub {
  position: relative;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 26px;
  border: 0;
  border-radius: 26px;
  color: #fff;
  text-align: left;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.35);
  animation: rise-in 0.5s var(--ease) both;
  animation-delay: calc(var(--i) * 80ms);
  transition: transform 0.25s var(--ease), box-shadow 0.25s;
}
.sub:not(:disabled):hover {
  transform: translateY(-6px) rotate(-1deg);
  box-shadow: 0 14px 0 rgba(0, 0, 0, 0.35);
}
.sub:not(:disabled):active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.35);
}
.sub:disabled {
  cursor: wait;
  opacity: 0.85;
}
.s-0 {
  background: linear-gradient(140deg, #3fa9f5, #2463d8);
}
.s-1 {
  background: linear-gradient(140deg, #ff9f1c, #e8590c);
}
.s-2 {
  background: linear-gradient(140deg, #22c55e, #0f8a43);
}
.sub i {
  position: absolute;
  right: 18px;
  top: 14px;
  font-style: normal;
  font-size: 4.5rem;
  opacity: 0.35;
  transition: transform 0.4s var(--ease);
}
.sub:hover i {
  transform: scale(1.15) rotate(8deg);
}
.sub h2 {
  font-size: 2.2rem;
}
.sub p {
  margin: 4px 0 16px;
  font-weight: 700;
  opacity: 0.9;
}
.go {
  font-family: var(--display);
  font-size: 1.1rem;
}
.skeleton {
  background: linear-gradient(90deg, var(--surface) 25%, var(--surface-2) 50%, var(--surface) 75%) 0 0 / 200% 100%;
  animation: shimmer 1.4s linear infinite;
  box-shadow: none;
}
@keyframes shimmer {
  to {
    background-position: -200% 0;
  }
}
@media (max-width: 860px) {
  .subjects {
    grid-template-columns: 1fr;
  }
  .sub {
    min-height: 190px;
  }
  .resume {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
