<script setup lang="ts">
defineProps<{ phase: number; finished?: boolean }>();
const phases = [
  { n: 1, label: "Fácil", pts: 100 },
  { n: 2, label: "Média", pts: 200 },
  { n: 3, label: "Difícil", pts: 300 },
];
</script>

<template>
  <ol class="track" aria-label="Fases da partida">
    <li
      v-for="p in phases"
      :key="p.n"
      :class="{ done: finished || p.n < phase, now: !finished && p.n === phase }"
      :aria-current="!finished && p.n === phase ? 'step' : undefined"
    >
      <b>{{ finished || p.n < phase ? "✓" : p.n }}</b>
      <span>Fase {{ p.n }} <small>{{ p.label }} · {{ p.pts }} pts</small></span>
    </li>
  </ol>
</template>

<style scoped>
.track {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
}
li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 16px;
  background: var(--surface);
  border: 2px solid var(--line);
  color: var(--muted);
  font-weight: 800;
  transition: border-color 0.3s, color 0.3s, background 0.3s;
}
li b {
  flex: none;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: var(--surface-2);
  font-family: var(--display);
  font-weight: 400;
  transition: background 0.3s, color 0.3s;
}
li small {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
}
li.now {
  border-color: var(--gold);
  color: var(--ink);
}
li.now b {
  background: var(--gold);
  color: var(--bg);
}
li.done b {
  background: var(--green);
  color: #07210f;
}
@media (max-width: 600px) {
  li {
    gap: 6px;
    padding: 8px;
    font-size: 0.85rem;
  }
  li b {
    width: 26px;
    height: 26px;
  }
  li small {
    display: none;
  }
}
</style>
