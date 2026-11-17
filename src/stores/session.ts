import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authApi, meApi } from "@/api";
import { tokenStore } from "@/api/http";
import type { Me } from "@/api/types";

export const useSession = defineStore("session", () => {
  const playerId = ref<string | null>(tokenStore.userId());
  const me = ref<Me | null>(null);
  const loggedIn = computed(() => Boolean(playerId.value && tokenStore.get()));

  async function confirm(email: string, code: string) {
    const res = await authApi.confirm(email, code);
    tokenStore.set(res.token, res.player_id);
    playerId.value = res.player_id;
    await loadMe();
    return res.isNew;
  }

  async function loadMe() {
    if (!tokenStore.get()) return null;
    me.value = await meApi.get();
    return me.value;
  }

  function logout() {
    tokenStore.clear();
    playerId.value = null;
    me.value = null;
  }

  return { playerId, me, loggedIn, confirm, loadMe, logout };
});
