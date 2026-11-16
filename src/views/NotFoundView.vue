<template>
  <main class="wrap nf">
    <p class="code">404</p>
    <h1>Essa fase não existe</h1>
    <p class="muted">A página que você procurou não está aqui.</p>
    <RouterLink class="btn" to="/">Voltar ao início</RouterLink>
  </main>
</template>

<style scoped>
.nf {
  min-height: 60vh;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 12px;
  text-align: center;
}
.code {
  margin: 0;
  font-family: var(--display);
  font-size: 6rem;
  line-height: 1;
  color: var(--green);
  animation: pop 0.6s var(--ease);
}
h1 {
  font-size: 2.2rem;
}
.muted {
  margin: 0 0 12px;
}
</style>
