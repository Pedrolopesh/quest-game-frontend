<script setup lang="ts">
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { publicApi } from "@/api";
import { tokenStore } from "@/api/http";
import type { Option, RankingRow, Round, Stats, Subject } from "@/api/types";
import PodiumBlock from "@/components/PodiumBlock.vue";
import QuestionCard from "@/components/QuestionCard.vue";
import { fmt } from "@/lib/messages";

const cta = tokenStore.get() ? "/jogar" : "/entrar";
const subjects = ref<Subject[]>([]);
const ranking = ref<RankingRow[]>([]);
const stats = ref<Stats | null>(null);
const ICONS: Record<string, string> = { exatas: "🧮", humanas: "🏛️", natureza: "🧪" };

/** Pergunta de demonstração: responde aqui mesmo, sem conta. */
const DEMO_CORRECT: Option = "D";
const demo = ref<Round>({
  question: "demo",
  level: 2,
  statement: "Qual tratado, de 1494, dividiu as terras descobertas entre Portugal e Espanha?",
  alternatives: [
    { option: "A", text: "Tratado de Madri" },
    { option: "B", text: "Tratado de Versalhes" },
    { option: "C", text: "Tratado de Utrecht" },
    { option: "D", text: "Tratado de Tordesilhas" },
  ],
  points: 200,
  answer: null,
  correct: null,
  earned: 0,
  correctOption: null,
});
function tryDemo(option: Option) {
  const correct = option === DEMO_CORRECT;
  demo.value = { ...demo.value, answer: option, correct, earned: correct ? 200 : 0, correctOption: DEMO_CORRECT };
}
const resetDemo = () => (demo.value = { ...demo.value, answer: null, correct: null, earned: 0, correctOption: null });

onMounted(() => {
  publicApi.subjects().then((s) => (subjects.value = s)).catch(() => null);
  publicApi.ranking(3).then((r) => (ranking.value = r)).catch(() => null);
  publicApi.stats().then((s) => (stats.value = s)).catch(() => null);
});
</script>

<template>
  <main>
    <section class="wrap hero">
      <span class="spot" aria-hidden="true"></span>
      <span class="chip rise" style="--delay: 0ms"><b>●</b> 3 fases · Exatas, Humanas e Natureza</span>
      <h1 class="rise" style="--delay: 80ms">Prove que você sabe <span>de tudo</span>.</h1>
      <p class="lead rise" style="--delay: 160ms">
        Escolha uma matéria, passe por 3 fases cada vez mais difíceis e dispute o pódio. Teste agora, valendo 200 pontos:
      </p>
      <div class="stage rise" style="--delay: 240ms">
        <QuestionCard :round="demo" :index="1" :total="3" demo @pick="tryDemo" />
        <div v-if="demo.answer" class="after">
          <RouterLink class="btn" :to="cta">{{ demo.correct ? "Jogar valendo pontos" : "Quero a revanche" }}</RouterLink>
          <button class="btn ghost" type="button" @click="resetDemo">Tentar de novo</button>
        </div>
      </div>
    </section>

    <section v-if="stats" class="wrap numbers" aria-label="Números do jogo">
      <div v-reveal><strong>{{ fmt(stats.questions) }}</strong><span>perguntas</span></div>
      <div v-reveal="80"><strong>{{ fmt(stats.players) }}</strong><span>jogadores no ranking</span></div>
      <div v-reveal="160"><strong>{{ fmt(stats.games) }}</strong><span>partidas jogadas</span></div>
    </section>

    <section id="materias" class="wrap block">
      <h2 v-reveal class="sec-t">Escolha a matéria</h2>
      <div class="subjects">
        <RouterLink
          v-for="(s, i) in subjects"
          :key="s.slug"
          v-reveal="i * 80"
          class="sub"
          :to="tokenStore.get() ? { path: '/jogar', query: { materia: s.slug } } : '/entrar'"
        >
          <i aria-hidden="true">{{ ICONS[s.slug] ?? "❓" }}</i>
          <h3>{{ s.title }}</h3>
          <p>{{ s.description }}</p>
          <small>{{ s.questions }} perguntas</small>
        </RouterLink>
      </div>
    </section>

    <section class="wrap block">
      <h2 v-reveal class="sec-t">Como funciona</h2>
      <ol class="steps">
        <li v-reveal class="card"><b>1</b><h3>Entre com o e-mail</h3><p>Sem senha: chega um código de 6 dígitos e você já está jogando.</p></li>
        <li v-reveal="100" class="card"><b>2</b><h3>Passe pelas 3 fases</h3><p>3 perguntas por fase. Fácil vale 100, média 200 e difícil 300 pontos.</p></li>
        <li v-reveal="200" class="card"><b>3</b><h3>Suba no pódio</h3><p>Os pontos de todas as partidas somam no seu total do ranking.</p></li>
      </ol>
    </section>

    <section class="wrap block">
      <h2 v-reveal class="sec-t">Pódio</h2>
      <PodiumBlock v-reveal :rows="ranking" />
      <p class="center"><RouterLink class="btn ghost" to="/ranking">Ver o ranking completo</RouterLink></p>
    </section>

    <section v-reveal class="wrap final">
      <h2>Valendo o topo do pódio…</h2>
      <p>Leva menos de um minuto para entrar e começar.</p>
      <RouterLink class="btn" :to="cta">Quero jogar</RouterLink>
    </section>
  </main>
</template>

<style scoped>
.rise {
  animation: rise-in 0.8s var(--ease) both;
  animation-delay: var(--delay, 0ms);
}
.hero {
  position: relative;
  text-align: center;
  padding: 30px 0 30px;
}
.spot {
  position: absolute;
  left: 50%;
  top: -160px;
  width: min(900px, 140vw);
  height: 760px;
  transform: translateX(-50%);
  background:
    conic-gradient(from 160deg at 50% 0%, transparent 0deg, rgba(255, 209, 102, 0.13) 20deg, transparent 40deg),
    radial-gradient(ellipse at 50% 0%, rgba(124, 77, 204, 0.35), transparent 60%);
  pointer-events: none;
  z-index: -1;
  mask-image: linear-gradient(#000 55%, transparent);
}
.hero h1 {
  margin-top: 18px;
  font-size: clamp(2.6rem, 6.4vw, 5.4rem);
  line-height: 1;
}
.hero h1 span {
  color: var(--gold);
}
.lead {
  margin: 18px auto 0;
  max-width: 600px;
  color: var(--muted);
  font-size: 1.15rem;
  line-height: 1.55;
}
.stage {
  max-width: 860px;
  margin: 40px auto 0;
}
.after {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
  margin-top: 26px;
  animation: rise-in 0.4s var(--ease) both;
}
.numbers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 70px;
  text-align: center;
}
.numbers strong {
  display: block;
  font-family: var(--display);
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  color: var(--orange);
  line-height: 1;
}
.numbers span {
  color: var(--muted);
  font-weight: 700;
}
.block {
  padding-top: 100px;
}
.sec-t {
  font-size: clamp(2rem, 4vw, 2.6rem);
  text-align: center;
  margin-bottom: 30px;
}
.subjects {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.sub {
  display: block;
  padding: 26px;
  border-radius: 24px;
  background: var(--surface);
  border: 2px solid var(--line);
  text-decoration: none;
  transition: border-color 0.25s, transform 0.3s var(--ease), opacity 0.7s ease;
}
.sub:hover {
  border-color: var(--green);
  transform: translateY(-4px);
}
.sub i {
  font-style: normal;
  font-size: 2.2rem;
}
.sub h3 {
  font-size: 1.8rem;
  margin: 10px 0 4px;
}
.sub p {
  margin: 0 0 12px;
  color: var(--muted);
  font-weight: 600;
}
.sub small {
  color: var(--green);
  font-weight: 800;
}
.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.steps li {
  padding: 26px;
}
.steps b {
  display: inline-grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--surface-2);
  font-family: var(--display);
  font-size: 1.5rem;
  color: var(--green);
  margin-bottom: 14px;
}
.steps h3 {
  font-size: 1.4rem;
  margin-bottom: 6px;
}
.steps p {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}
.center {
  text-align: center;
  margin-top: 30px;
}
.final {
  margin-top: 100px;
  padding: 60px 24px;
  border-radius: 32px;
  text-align: center;
  background:
    radial-gradient(circle at 20% 0%, rgba(255, 209, 102, 0.18), transparent 50%),
    linear-gradient(135deg, #3a1f5c, #241640);
  border: 2px solid var(--line);
}
.final h2 {
  font-size: clamp(2rem, 4.4vw, 3.2rem);
}
.final p {
  color: var(--muted);
  margin: 10px 0 26px;
  font-size: 1.1rem;
}
@media (max-width: 860px) {
  .subjects,
  .steps {
    grid-template-columns: 1fr;
  }
  .numbers {
    grid-template-columns: 1fr;
  }
}
</style>
