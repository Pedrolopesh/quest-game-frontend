<template>
  <span class="logo">
    <span class="die" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
    <span class="name">Quest Game</span>
  </span>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--display);
  font-size: 1.6rem;
  letter-spacing: 0.4px;
  white-space: nowrap;
}
.die {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--green);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  padding: 8px;
  gap: 6px;
  box-shadow: 0 4px 0 var(--green-2);
  transform: rotate(-8deg);
  transition: transform 0.4s var(--ease);
}
.logo:hover .die {
  transform: rotate(172deg);
}
.die i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--bg);
}
</style>
