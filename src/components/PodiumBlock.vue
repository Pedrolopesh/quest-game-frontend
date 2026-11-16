<script setup lang="ts">
import { computed } from "vue";
import cup1 from "@/assets/img/cup1.png";
import cup2 from "@/assets/img/cup2.png";
import cup3 from "@/assets/img/cup3.png";
import type { RankingRow } from "@/api/types";
import { fmt } from "@/lib/messages";

const props = defineProps<{ rows: RankingRow[] }>();
// ordem visual do pódio: 2º, 1º, 3º
const places = computed(() =>
  [
    { pos: 2, cup: cup2, h: 130 },
    { pos: 1, cup: cup1, h: 180 },
    { pos: 3, cup: cup3, h: 100 },
  ].map((p) => ({ ...p, row: props.rows.find((r) => r.position === p.pos) })),
);
</script>

<template>
  <div class="podium" role="list" aria-label="Pódio">
    <div v-for="(p, i) in places" :key="p.pos" class="p" role="listitem" :style="{ '--delay': `${i * 120}ms` }">
      <img :src="p.cup" :alt="`Troféu de ${p.pos}º lugar`" width="90" height="110" loading="lazy" />
      <strong>{{ p.row?.nickname ?? "—" }}</strong>
      <small>{{ p.row ? fmt(p.row.totalScore) : "vaga aberta" }}</small>
      <div class="base" :class="{ first: p.pos === 1 }" :style="{ height: `${p.h}px` }">{{ p.pos }}</div>
    </div>
  </div>
</template>

<style scoped>
.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 14px;
}
.p {
  width: 200px;
  text-align: center;
  animation: rise-in 0.6s var(--ease) both;
  animation-delay: var(--delay);
}
.p img {
  width: 90px;
  height: auto;
  margin: 0 auto 10px;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4));
  transition: transform 0.3s var(--ease);
}
.p:hover img {
  transform: translateY(-6px) rotate(-4deg);
}
.p strong {
  display: block;
  font-weight: 800;
  font-size: 1.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.p small {
  display: block;
  margin-bottom: 8px;
  color: var(--gold);
  font-family: var(--display);
  font-size: 1.1rem;
}
.base {
  border-radius: 18px 18px 0 0;
  display: grid;
  place-items: center;
  font-family: var(--display);
  font-size: 2.6rem;
  background: linear-gradient(180deg, var(--surface-2), var(--surface));
  border: 2px solid var(--line);
  border-bottom: 0;
}
.base.first {
  color: var(--gold);
}
@media (max-width: 600px) {
  .p {
    width: 31%;
  }
  .p img {
    width: 64px;
  }
}
</style>
