import { createRouter, createWebHistory } from "vue-router";
import { tokenStore } from "@/api/http";

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to, _from, saved) => saved ?? (to.hash ? { el: to.hash, behavior: "smooth", top: 80 } : { top: 0 }),
  routes: [
    { path: "/", name: "home", component: () => import("@/views/LandingView.vue") },
    { path: "/entrar", name: "login", component: () => import("@/views/LoginView.vue"), meta: { guest: true } },
    { path: "/jogar", name: "play", component: () => import("@/views/PlayView.vue"), meta: { auth: true } },
    { path: "/partida/:id", name: "game", component: () => import("@/views/GameView.vue"), meta: { auth: true } },
    { path: "/ranking", name: "ranking", component: () => import("@/views/RankingView.vue") },
    { path: "/perfil", name: "profile", component: () => import("@/views/ProfileView.vue"), meta: { auth: true } },
    { path: "/admin", name: "admin", component: () => import("@/views/AdminView.vue"), meta: { auth: true, admin: true } },
    // rotas antigas (Vue 2, modo hash) caem na página inicial
    { path: "/Home", redirect: "/" },
    { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("@/views/NotFoundView.vue") },
  ],
});

router.beforeEach((to) => {
  const logged = Boolean(tokenStore.get());
  if (to.meta.auth && !logged) return { name: "login", query: { next: to.fullPath } };
  if (to.meta.guest && logged) return { name: "play" };
});

export default router;
