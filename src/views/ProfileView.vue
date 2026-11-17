<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { meApi } from "@/api";
import { fmt, friendly } from "@/lib/messages";
import { useSession } from "@/stores/session";

const session = useSession();
const router = useRouter();
const nickname = ref("");
const saving = ref(false);
const saved = ref(false);
const error = ref("");

onMounted(async () => {
  const me = session.me ?? (await session.loadMe().catch(() => null));
  nickname.value = me?.nickname ?? "";
});

async function save() {
  saving.value = true;
  saved.value = false;
  error.value = "";
  try {
    session.me = await meApi.rename(nickname.value.trim());
    saved.value = true;
  } catch (e) {
    error.value = friendly(e);
  } finally {
    saving.value = false;
  }
}

async function logout() {
  session.logout();
  await router.push("/");
}
</script>

<template>
  <main class="wrap profile">
    <section class="card box">
      <span class="avatar" aria-hidden="true">{{ (session.me?.nickname ?? "?").slice(0, 1).toUpperCase() }}</span>
      <h1>{{ session.me?.nickname }}</h1>
      <p class="muted">{{ session.me?.email }}</p>
      <div class="stats">
        <div><strong>{{ fmt(session.me?.totalScore ?? 0) }}</strong><span>pontos no total</span></div>
        <div><strong>{{ fmt(session.me?.bestScore ?? 0) }}</strong><span>melhor partida</span></div>
        <div><strong>{{ fmt(session.me?.gamesPlayed ?? 0) }}</strong><span>partidas</span></div>
      </div>
      <form class="form" @submit.prevent="save">
        <div class="field">
          <label for="nick">Apelido no ranking</label>
          <input id="nick" v-model="nickname" class="input" minlength="2" maxlength="24" required @input="saved = false" />
        </div>
        <p v-if="error" class="error" role="alert">{{ error }}</p>
        <p v-if="saved" class="ok" role="status">Apelido salvo!</p>
        <button class="btn" type="submit" :disabled="saving || nickname.trim() === session.me?.nickname">Salvar</button>
      </form>
      <button class="btn ghost out" type="button" @click="logout">Sair</button>
    </section>
  </main>
</template>

<style scoped>
.profile {
  display: grid;
  place-items: center;
  padding: 30px 0 40px;
}
.box {
  width: min(520px, 100%);
  padding: 34px 28px;
  text-align: center;
  animation: rise-in 0.5s var(--ease) both;
}
.avatar {
  width: 84px;
  height: 84px;
  margin: 0 auto 12px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--purple);
  font-family: var(--display);
  font-size: 2.4rem;
  box-shadow: 0 0 0 5px var(--surface-2);
}
.box h1 {
  font-size: 2.2rem;
}
.box > p {
  margin: 4px 0 20px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 26px;
}
.stats div {
  padding: 14px 8px;
  border-radius: 16px;
  background: var(--surface-2);
}
.stats strong {
  display: block;
  font-family: var(--display);
  font-weight: 400;
  font-size: 1.6rem;
  color: var(--orange);
}
.stats span {
  font-size: 0.8rem;
  color: var(--muted);
  font-weight: 700;
}
.form {
  display: grid;
  gap: 14px;
}
.ok {
  margin: 0;
  color: var(--green);
  font-weight: 800;
}
.out {
  margin-top: 16px;
  width: 100%;
}
</style>
