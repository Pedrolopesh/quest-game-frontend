<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";
import cup1 from "@/assets/img/cup1.png";
import cup2 from "@/assets/img/cup2.png";
import cup3 from "@/assets/img/cup3.png";
import { gamesApi } from "@/api";
import type { Game, Option } from "@/api/types";
import PhaseTrack from "@/components/PhaseTrack.vue";
import QuestionCard from "@/components/QuestionCard.vue";
import { fmt, friendly } from "@/lib/messages";
import { useSession } from "@/stores/session";

const route = useRoute();
const session = useSession();
const game = ref<Game | null>(null);
const shown = ref(0);
const busy = ref(false);
const error = ref("");
const gain = ref(0);

const id = computed(() => String(route.params.id));
const rounds = computed(() => game.value?.rounds ?? []);
const round = computed(() => rounds.value[shown.value]);
const phaseDone = computed(() => game.value?.status === "playing" && rounds.value.every((r) => r.answer !== null));
const phaseHits = computed(() => rounds.value.filter((r) => r.correct).length);
const phaseEarned = computed(() => rounds.value.reduce((n, r) => n + r.earned, 0));
const cups: Record<number, string> = { 1: cup1, 2: cup2, 3: cup3 };

const firstOpen = (g: Game) => Math.max(0, g.rounds.findIndex((r) => r.answer === null));

async function load() {
  try {
    const g = await gamesApi.get(id.value);
    game.value = g;
    shown.value = g.status === "playing" ? firstOpen(g) : 0;
  } catch (e) {
    error.value = friendly(e);
  }
}

async function pick(option: Option) {
  if (!game.value || !round.value || busy.value) return;
  busy.value = true;
  error.value = "";
  try {
    const res = await gamesApi.answer(game.value._id, round.value.question, option);
    game.value = res.game;
    if (res.correct) {
      gain.value = res.earned;
      setTimeout(() => (gain.value = 0), 1200);
    }
  } catch (e) {
    error.value = friendly(e);
  } finally {
    busy.value = false;
  }
}

function next() {
  if (shown.value < rounds.value.length - 1) shown.value++;
}

async function advance() {
  if (!game.value || busy.value) return;
  busy.value = true;
  error.value = "";
  try {
    const g = await gamesApi.advance(game.value._id);
    game.value = g;
    shown.value = 0;
    if (g.status === "finished") void session.loadMe().catch(() => null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (e) {
    error.value = friendly(e);
  } finally {
    busy.value = false;
  }
}

const byPhase = computed(() => [1, 2, 3].map((level) => ({ level, rounds: rounds.value.filter((r) => r.level === level) })));
const textOf = (r: (typeof rounds.value)[number], o: Option | null) => r.alternatives.find((a) => a.option === o)?.text ?? "—";

onMounted(load);
</script>

<template>
  <main class="wrap game">
    <p v-if="error && !game" class="error center" role="alert">{{ error }}</p>

    <template v-if="game && game.status === 'playing'">
      <div class="bar">
        <span class="chip"><b>●</b> {{ game.subject?.title }}</span>
        <span class="score" aria-live="polite">
          {{ fmt(game.score) }} pts
          <em v-if="gain" :key="gain + shown" class="gain">+{{ gain }}</em>
        </span>
      </div>
      <PhaseTrack :phase="game.phase" />

      <Transition name="swap" mode="out-in">
        <section v-if="phaseDone" :key="`done-${game.phase}`" class="done card">
          <h2>Fase {{ game.phase }} concluída!</h2>
          <p class="big">{{ phaseHits }} de 3 <small>acertos</small></p>
          <p class="muted">+{{ phaseEarned }} pontos nesta fase</p>
          <button class="btn" type="button" :disabled="busy" @click="advance">
            {{ game.phase < game.phases ? `Ir para a fase ${game.phase + 1} ▶` : "Ver meu resultado 🏆" }}
          </button>
        </section>
        <section v-else-if="round" :key="round.question" class="play">
          <QuestionCard :round="round" :index="shown" :total="rounds.length" :busy="busy" @pick="pick" />
          <div v-if="round.answer && shown < rounds.length - 1" class="next">
            <button class="btn" type="button" @click="next">Próxima pergunta ▶</button>
          </div>
        </section>
      </Transition>
      <p v-if="error" class="error center" role="alert">{{ error }}</p>
    </template>

    <template v-else-if="game">
      <section class="result card">
        <img v-if="game.position && game.position <= 3" class="trophy" :src="cups[game.position]" alt="" width="120" height="146" />
        <span class="chip"><b>●</b> {{ game.subject?.title }} · partida encerrada</span>
        <h1>{{ fmt(game.score) }} <small>pontos</small></h1>
        <p class="hits">Você acertou <strong>{{ game.correctCount }} de {{ game.total }}</strong> perguntas.</p>
        <p v-if="game.position" class="pos">
          Você está em <strong>{{ game.position }}º lugar</strong> no ranking geral{{ game.position <= 3 ? ". Pódio! 🎉" : "." }}
        </p>
        <PhaseTrack :phase="3" finished />
        <div class="actions">
          <RouterLink class="btn" to="/jogar">Jogar de novo</RouterLink>
          <RouterLink class="btn ghost" to="/ranking">Ver ranking</RouterLink>
        </div>
      </section>

      <section class="review">
        <h2>Gabarito da partida</h2>
        <div v-for="ph in byPhase" :key="ph.level" class="phase">
          <h3>Fase {{ ph.level }}</h3>
          <ol>
            <li v-for="r in ph.rounds" :key="r.question" :class="r.correct ? 'ok' : 'no'">
              <span class="icon" aria-hidden="true">{{ r.correct ? "✓" : "✗" }}</span>
              <div>
                <p class="q">{{ r.statement }}</p>
                <p class="a">
                  <template v-if="r.correct">{{ r.correctOption }}) {{ textOf(r, r.correctOption) }} · +{{ r.earned }}</template>
                  <template v-else>
                    Você: {{ r.answer }}) {{ textOf(r, r.answer) }} · Certa: {{ r.correctOption }}) {{ textOf(r, r.correctOption) }}
                  </template>
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>
    </template>

    <div v-else-if="!error" class="loading" aria-busy="true">Carregando partida…</div>
  </main>
</template>

<style scoped>
.game {
  max-width: 900px;
  padding: 20px 0 40px;
}
.center {
  text-align: center;
}
.bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.score {
  position: relative;
  font-family: var(--display);
  font-size: 1.6rem;
  color: var(--gold);
}
.gain {
  position: absolute;
  right: 0;
  top: -6px;
  font-style: normal;
  color: var(--green);
  animation: float-up 1.2s var(--ease) forwards;
}
@keyframes float-up {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-36px);
  }
}
.play,
.done {
  margin-top: 24px;
}
.next {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  animation: rise-in 0.35s var(--ease) both;
}
.done {
  padding: 40px 24px;
  text-align: center;
}
.done h2 {
  font-size: 2.4rem;
}
.big {
  margin: 14px 0 4px;
  font-family: var(--display);
  font-size: 3.6rem;
  color: var(--green);
  animation: pop 0.6s var(--ease);
}
.big small {
  font-size: 1.2rem;
  color: var(--muted);
}
.done .muted {
  margin: 0 0 24px;
  font-weight: 700;
}
.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.25s ease, transform 0.25s var(--ease);
}
.swap-enter-from {
  opacity: 0;
  transform: translateX(24px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
.result {
  position: relative;
  padding: 40px 24px 30px;
  text-align: center;
  overflow: hidden;
  animation: rise-in 0.5s var(--ease) both;
}
.trophy {
  width: 120px;
  height: auto;
  margin: 0 auto 10px;
  animation: pop 0.8s var(--ease);
  filter: drop-shadow(0 14px 30px rgba(255, 209, 102, 0.35));
}
.result h1 {
  margin: 14px 0 6px;
  font-size: clamp(3.4rem, 9vw, 5.6rem);
  line-height: 1;
  color: var(--gold);
}
.result h1 small {
  font-size: 1.4rem;
  color: var(--muted);
}
.hits,
.pos {
  margin: 6px 0;
  font-size: 1.15rem;
}
.result .track {
  margin: 24px auto;
  max-width: 600px;
}
.actions {
  display: flex;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
.review {
  margin-top: 50px;
}
.review > h2 {
  font-size: 2rem;
  margin-bottom: 16px;
}
.phase h3 {
  color: var(--muted);
  font-size: 1.2rem;
  margin: 20px 0 10px;
}
.phase ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}
.phase li {
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 16px;
  background: var(--surface);
  border: 2px solid var(--line);
}
.icon {
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-weight: 800;
}
.ok .icon {
  background: var(--green);
  color: #07210f;
}
.no .icon {
  background: var(--red);
  color: #2a0a10;
}
.q {
  margin: 0 0 4px;
  font-weight: 800;
}
.a {
  margin: 0;
  color: var(--muted);
  font-weight: 600;
}
.loading {
  padding: 80px 0;
  text-align: center;
  color: var(--muted);
}
</style>
