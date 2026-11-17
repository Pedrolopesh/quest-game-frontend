<script setup lang="ts">
import { onMounted, ref } from "vue";
import { publicApi } from "@/api";
import type { RankingRow } from "@/api/types";
import PodiumBlock from "@/components/PodiumBlock.vue";
import { fmt, friendly } from "@/lib/messages";
import { useSession } from "@/stores/session";

const session = useSession();
const rows = ref<RankingRow[]>([]);
const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    rows.value = await publicApi.ranking(50);
  } catch (e) {
    error.value = friendly(e);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="wrap ranking">
    <h1>Ranking geral</h1>
    <p class="muted">A soma dos pontos de todas as partidas de cada jogador.</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <PodiumBlock class="podium" :rows="rows" />
    <div v-if="loading" class="muted center">Carregando…</div>
    <p v-else-if="!rows.length" class="muted center">Ninguém jogou ainda. O primeiro lugar está esperando você!</p>
    <ol v-else class="table">
      <li v-for="(r, i) in rows" :key="r._id" :class="{ me: r._id === session.me?._id }" :style="{ '--i': Math.min(i, 12) }">
        <span class="pos">{{ r.position }}</span>
        <span class="nick">{{ r.nickname }}<small v-if="r._id === session.me?._id"> (você)</small></span>
        <span class="games">{{ r.gamesPlayed }} {{ r.gamesPlayed === 1 ? "partida" : "partidas" }}</span>
        <strong>{{ fmt(r.totalScore) }}</strong>
      </li>
    </ol>
  </main>
</template>

<style scoped>
.ranking {
  max-width: 820px;
  padding: 30px 0 40px;
}
h1 {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
}
.ranking > p {
  margin: 8px 0 30px;
}
.podium {
  margin-bottom: 30px;
}
.center {
  text-align: center;
}
.table {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}
.table li {
  display: grid;
  grid-template-columns: 44px 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding: 14px 18px;
  border-radius: 16px;
  background: var(--surface);
  border: 2px solid var(--line);
  animation: rise-in 0.4s var(--ease) both;
  animation-delay: calc(var(--i) * 35ms);
}
.table li.me {
  border-color: var(--green);
}
.pos {
  font-family: var(--display);
  font-size: 1.3rem;
  color: var(--muted);
  text-align: center;
}
.nick {
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.nick small {
  color: var(--green);
}
.games {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 700;
}
.table strong {
  font-family: var(--display);
  font-weight: 400;
  font-size: 1.3rem;
  color: var(--orange);
}
@media (max-width: 500px) {
  .games {
    display: none;
  }
  .table li {
    grid-template-columns: 36px 1fr auto;
  }
}
</style>
