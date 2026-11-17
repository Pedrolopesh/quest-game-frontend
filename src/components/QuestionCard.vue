<script setup lang="ts">
import { computed } from "vue";
import type { Option, Round } from "@/api/types";

const props = defineProps<{ round: Round; index: number; total: number; busy?: boolean; demo?: boolean }>();
const emit = defineEmits<{ pick: [option: Option] }>();

const answered = computed(() => props.round.answer !== null);
const stateOf = (o: Option) => {
  if (!answered.value) return "";
  if (o === props.round.correctOption) return "right";
  if (o === props.round.answer) return "wrong";
  return "dim";
};
</script>

<template>
  <article class="qcard" :class="{ answered }">
    <header class="top">
      <span class="chip">Pergunta {{ index + 1 }} de {{ total }}</span>
      <span class="worth" :class="{ won: round.correct }">{{ round.correct ? `+${round.earned}` : `Vale ${round.points}` }}</span>
    </header>
    <p class="statement">{{ round.statement }}</p>
    <div class="answers" role="group" :aria-label="`Alternativas da pergunta ${index + 1}`">
      <button
        v-for="alt in round.alternatives"
        :key="alt.option"
        type="button"
        class="ans"
        :class="[`opt-${alt.option.toLowerCase()}`, stateOf(alt.option)]"
        :disabled="answered || busy"
        :aria-pressed="round.answer === alt.option"
        @click="emit('pick', alt.option)"
      >
        <b>{{ alt.option }}</b>
        <span>{{ alt.text }}</span>
        <i v-if="stateOf(alt.option) === 'right'" class="mark" aria-label="resposta certa">✓</i>
        <i v-else-if="stateOf(alt.option) === 'wrong'" class="mark" aria-label="sua resposta">✗</i>
      </button>
    </div>
    <p v-if="answered" class="feedback" :class="round.correct ? 'ok' : 'no'" role="status">
      <template v-if="round.correct">Resposta certa! {{ demo ? "" : "Os pontos já entraram." }}</template>
      <template v-else>Não foi dessa vez: a certa era a {{ round.correctOption }}.</template>
    </p>
  </article>
</template>

<style scoped>
.qcard {
  background: var(--surface);
  border: 2px solid var(--line);
  border-radius: 30px;
  padding: clamp(20px, 3vw, 34px);
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.45);
  text-align: left;
  animation: rise-in 0.45s var(--ease) both;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.worth {
  font-family: var(--display);
  font-size: 1.4rem;
  color: var(--gold);
}
.worth.won {
  color: var(--green);
  animation: pop 0.5s var(--ease);
}
.statement {
  margin: 0 0 24px;
  font-size: clamp(1.25rem, 2.4vw, 1.75rem);
  font-weight: 800;
  line-height: 1.3;
}
.answers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.ans {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: 0;
  border-radius: 18px;
  color: #fff;
  font-weight: 800;
  font-size: 1.05rem;
  text-align: left;
  cursor: pointer;
  box-shadow: 0 5px 0 rgba(0, 0, 0, 0.35);
  transition: transform 0.15s var(--ease), box-shadow 0.15s, opacity 0.3s, filter 0.3s;
}
.ans:not(:disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.35);
}
.ans:not(:disabled):active {
  transform: translateY(4px);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.35);
}
.ans:disabled {
  cursor: default;
}
.ans b {
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.22);
  display: grid;
  place-items: center;
  font-family: var(--display);
  font-weight: 400;
}
.opt-a {
  background: var(--a);
}
.opt-b {
  background: var(--b);
}
.opt-c {
  background: var(--c);
}
.opt-d {
  background: var(--d);
}
.ans.right {
  outline: 4px solid #fff;
  outline-offset: 3px;
  animation: pop 0.45s var(--ease);
}
.ans.wrong {
  animation: shake 0.45s;
  filter: saturate(0.6);
}
.ans.dim {
  opacity: 0.35;
}
.mark {
  margin-left: auto;
  font-style: normal;
  font-size: 1.4rem;
}
.feedback {
  margin: 18px 0 0;
  font-weight: 800;
  animation: rise-in 0.35s var(--ease) both;
}
.feedback.ok {
  color: var(--green);
}
.feedback.no {
  color: var(--red);
}
@media (max-width: 700px) {
  .answers {
    grid-template-columns: 1fr;
  }
}
</style>
