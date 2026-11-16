<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { adminApi, publicApi, type QuestionInput } from "@/api";
import type { AdminQuestion, Option, Subject } from "@/api/types";
import { friendly } from "@/lib/messages";
import { useSession } from "@/stores/session";

const session = useSession();
const router = useRouter();
const subjects = ref<Subject[]>([]);
const subject = ref("");
const level = ref(0);
const questions = ref<AdminQuestion[]>([]);
const loading = ref(true);
const error = ref("");
const editing = ref<string | null>(null);
const dialog = ref<HTMLDialogElement | null>(null);
const OPTIONS: Option[] = ["A", "B", "C", "D"];
const POINTS: Record<number, number> = { 1: 100, 2: 200, 3: 300 };

const empty = (): QuestionInput => ({ subject: subject.value, level: 1, statement: "", alternatives: ["", "", "", ""], correct: "A", points: 100, status: "active" });
const form = ref<QuestionInput>(empty());
const formError = ref("");
const saving = ref(false);

const visible = computed(() => questions.value.filter((q) => !level.value || q.level === level.value));

async function load() {
  loading.value = true;
  error.value = "";
  try {
    questions.value = await adminApi.list(subject.value);
  } catch (e) {
    error.value = friendly(e);
  } finally {
    loading.value = false;
  }
}

function open(q?: AdminQuestion) {
  editing.value = q?._id ?? null;
  form.value = q
    ? { subject: q.subject, level: q.level, statement: q.statement, alternatives: q.alternatives.map((a) => a.text), correct: q.correct, points: q.points, status: q.status }
    : empty();
  formError.value = "";
  dialog.value?.showModal();
}

async function save() {
  saving.value = true;
  formError.value = "";
  try {
    if (editing.value) await adminApi.update(editing.value, form.value);
    else await adminApi.create(form.value);
    dialog.value?.close();
    await load();
  } catch (e) {
    formError.value = friendly(e);
  } finally {
    saving.value = false;
  }
}

async function deactivate(q: AdminQuestion) {
  try {
    await adminApi.remove(q._id);
    await load();
  } catch (e) {
    error.value = friendly(e);
  }
}

onMounted(async () => {
  const me = session.me ?? (await session.loadMe().catch(() => null));
  if (!me?.isAdmin) return void router.replace("/");
  subjects.value = await publicApi.subjects();
  subject.value = subjects.value[0]?._id ?? "";
  await load();
});
</script>

<template>
  <main class="wrap admin">
    <header class="head">
      <div>
        <h1>Questões</h1>
        <p class="muted">Crie, edite e desative perguntas. Desativar não apaga: partidas antigas continuam mostrando a pergunta.</p>
      </div>
      <button class="btn sm" type="button" @click="open()">+ Nova questão</button>
    </header>

    <div class="filters">
      <div class="tabs" role="tablist" aria-label="Matéria">
        <button v-for="s in subjects" :key="s._id" type="button" role="tab" :aria-selected="subject === s._id" :class="{ on: subject === s._id }" @click="subject = s._id; load()">
          {{ s.title }}
        </button>
      </div>
      <select v-model.number="level" class="input lvl" aria-label="Nível">
        <option :value="0">Todos os níveis</option>
        <option v-for="n in 3" :key="n" :value="n">Nível {{ n }}</option>
      </select>
    </div>

    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="loading" class="muted">Carregando…</p>
    <ul v-else class="list">
      <li v-for="q in visible" :key="q._id" class="card" :class="{ off: q.status === 'inactive' }">
        <div class="meta">
          <span class="chip">Nível {{ q.level }} · {{ q.points }} pts</span>
          <span v-if="q.status === 'inactive'" class="chip">desativada</span>
        </div>
        <p class="st">{{ q.statement }}</p>
        <ol class="alts">
          <li v-for="a in q.alternatives" :key="a.option" :class="{ right: a.option === q.correct }">
            <b>{{ a.option }}</b> {{ a.text }}
          </li>
        </ol>
        <div class="row">
          <button class="btn ghost sm" type="button" @click="open(q)">Editar</button>
          <button v-if="q.status === 'active'" class="btn ghost sm" type="button" @click="deactivate(q)">Desativar</button>
        </div>
      </li>
    </ul>

    <dialog ref="dialog" class="dialog" aria-labelledby="q-title" @click.self="dialog?.close()">
      <form class="form" @submit.prevent="save">
        <h2 id="q-title">{{ editing ? "Editar questão" : "Nova questão" }}</h2>
        <div class="grid2">
          <div class="field">
            <label for="f-sub">Matéria</label>
            <select id="f-sub" v-model="form.subject" class="input" required>
              <option v-for="s in subjects" :key="s._id" :value="s._id">{{ s.title }}</option>
            </select>
          </div>
          <div class="field">
            <label for="f-lvl">Nível</label>
            <select id="f-lvl" v-model.number="form.level" class="input" @change="form.points = POINTS[form.level]">
              <option v-for="n in 3" :key="n" :value="n">{{ n }} ({{ POINTS[n] }} pts)</option>
            </select>
          </div>
        </div>
        <div class="field">
          <label for="f-st">Enunciado</label>
          <textarea id="f-st" v-model="form.statement" class="input" rows="3" required minlength="5" maxlength="1000"></textarea>
        </div>
        <fieldset class="field">
          <legend>Alternativas (marque a correta)</legend>
          <div v-for="(o, i) in OPTIONS" :key="o" class="alt">
            <input :id="`c-${o}`" v-model="form.correct" type="radio" name="correct" :value="o" />
            <label :for="`c-${o}`" class="sr-only">Alternativa {{ o }} é a correta</label>
            <b>{{ o }}</b>
            <input v-model="form.alternatives[i]" class="input" required maxlength="300" :aria-label="`Texto da alternativa ${o}`" />
          </div>
        </fieldset>
        <p v-if="formError" class="error" role="alert">{{ formError }}</p>
        <div class="row">
          <button class="btn ghost sm" type="button" @click="dialog?.close()">Cancelar</button>
          <button class="btn sm" type="submit" :disabled="saving">{{ saving ? "Salvando…" : "Salvar" }}</button>
        </div>
      </form>
    </dialog>
  </main>
</template>

<style scoped>
.admin {
  padding: 30px 0 40px;
}
.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}
.head h1 {
  font-size: 2.6rem;
}
.head p {
  margin: 6px 0 0;
  max-width: 600px;
}
.filters {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
  margin: 24px 0;
}
.tabs {
  display: flex;
  gap: 6px;
  padding: 6px;
  border-radius: 16px;
  background: var(--surface);
}
.tabs button {
  border: 0;
  padding: 8px 16px;
  border-radius: 12px;
  background: none;
  color: var(--muted);
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.tabs button.on {
  background: var(--green);
  color: #07210f;
}
.lvl {
  width: auto;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}
.list > li {
  padding: 20px;
  animation: rise-in 0.35s var(--ease) both;
}
.list > li.off {
  opacity: 0.55;
}
.meta {
  display: flex;
  gap: 8px;
}
.st {
  font-weight: 800;
  margin: 12px 0;
}
.alts {
  list-style: none;
  margin: 0 0 14px;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  color: var(--muted);
}
.alts li.right {
  color: var(--green);
  font-weight: 800;
}
.row {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.dialog {
  width: min(640px, calc(100vw - 32px));
  padding: 0;
  border: 2px solid var(--line);
  border-radius: 24px;
  background: var(--surface);
  color: var(--ink);
}
.dialog[open] {
  animation: dialog-in 0.3s var(--ease) both;
}
.dialog::backdrop {
  background: rgba(10, 8, 16, 0.6);
  backdrop-filter: blur(3px);
}
@keyframes dialog-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
}
.form {
  display: grid;
  gap: 14px;
  padding: 26px;
}
.grid2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
fieldset {
  border: 0;
  padding: 0;
  margin: 0;
}
legend {
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--muted);
  margin-bottom: 6px;
}
.alt {
  display: flex;
  align-items: center;
  gap: 10px;
}
.alt input[type="radio"] {
  width: 20px;
  height: 20px;
  accent-color: var(--green);
}
textarea {
  resize: vertical;
}
@media (max-width: 700px) {
  .head {
    flex-direction: column;
  }
  .alts,
  .grid2 {
    grid-template-columns: 1fr;
  }
}
</style>
