<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authApi } from "@/api";
import CodeInput from "@/components/CodeInput.vue";
import { friendly } from "@/lib/messages";
import { useSession } from "@/stores/session";

const router = useRouter();
const route = useRoute();
const session = useSession();
const step = ref<"email" | "code">("email");
const email = ref("");
const nickname = ref("");
const code = ref("");
const busy = ref(false);
const error = ref("");
const resentAt = ref(0);

async function start() {
  busy.value = true;
  error.value = "";
  try {
    await authApi.start(email.value.trim(), nickname.value.trim());
    step.value = "code";
    resentAt.value = Date.now();
  } catch (e) {
    error.value = friendly(e);
  } finally {
    busy.value = false;
  }
}

async function confirm() {
  if (code.value.length !== 6) return;
  busy.value = true;
  error.value = "";
  try {
    await session.confirm(email.value.trim(), code.value);
    const next = typeof route.query.next === "string" && route.query.next.startsWith("/") ? route.query.next : "/jogar";
    await router.push(next);
  } catch (e) {
    error.value = friendly(e);
    code.value = "";
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <main class="wrap login">
    <section class="card box">
      <template v-if="step === 'email'">
        <h1>Bora jogar</h1>
        <p class="muted">Sem senha: mandamos um código de 6 dígitos para o seu e-mail.</p>
        <form class="form" @submit.prevent="start">
          <div class="field">
            <label for="email">E-mail</label>
            <input id="email" v-model="email" class="input" type="email" autocomplete="email" required maxlength="254" />
          </div>
          <div class="field">
            <label for="nick">Apelido no ranking <span class="muted">(opcional)</span></label>
            <input id="nick" v-model="nickname" class="input" maxlength="24" autocomplete="nickname" placeholder="ex.: mestre_do_quiz" />
          </div>
          <p v-if="error" class="error" role="alert">{{ error }}</p>
          <button class="btn" type="submit" :disabled="busy || !email">{{ busy ? "Enviando…" : "Receber código" }}</button>
        </form>
      </template>
      <template v-else>
        <h1>Confira o e-mail</h1>
        <p class="muted">Digite o código que enviamos para <strong>{{ email }}</strong>.</p>
        <form class="form" @submit.prevent="confirm">
          <CodeInput v-model="code" :disabled="busy" @complete="confirm" />
          <p v-if="error" class="error" role="alert">{{ error }}</p>
          <button class="btn" type="submit" :disabled="busy || code.length !== 6">{{ busy ? "Entrando…" : "Entrar" }}</button>
          <button class="link" type="button" @click="step = 'email'">Usar outro e-mail</button>
        </form>
      </template>
    </section>
  </main>
</template>

<style scoped>
.login {
  min-height: 70vh;
  display: grid;
  place-items: center;
  padding: 40px 0;
}
.box {
  width: min(460px, 100%);
  padding: 34px 30px;
  text-align: center;
  animation: rise-in 0.5s var(--ease) both;
}
.box h1 {
  font-size: 2.2rem;
}
.box > p {
  margin: 8px 0 24px;
}
.form {
  display: grid;
  gap: 16px;
}
.link {
  border: 0;
  background: none;
  color: var(--muted);
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
}
</style>
