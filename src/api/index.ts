import { json, request } from "./http";
import type { AdminQuestion, Game, Me, Option, RankingRow, Stats, Subject } from "./types";

export const publicApi = {
  subjects: () => request<{ subjects: Subject[] }>("/subjects").then((r) => r.subjects),
  ranking: (limit = 10) => request<{ ranking: RankingRow[] }>(`/ranking?limit=${limit}`).then((r) => r.ranking),
  stats: () => request<Stats>("/stats"),
};

export const authApi = {
  start: (email: string, nickname?: string) => request("/auth/email/start", json("POST", { email, nickname: nickname || undefined })),
  confirm: (email: string, code: string) =>
    request<{ player_id: string; token: string; isNew: boolean }>("/auth/email/confirm", json("POST", { email, code })),
};

export const meApi = {
  get: () => request<{ player: Me }>("/me").then((r) => r.player),
  rename: (nickname: string) => request<{ player: Me }>("/me", json("PATCH", { nickname })).then((r) => r.player),
};

type GameRes = { game: Game };
export const gamesApi = {
  start: (subject: string) => request<GameRes>("/games", json("POST", { subject })).then((r) => r.game),
  current: () => request<{ game: Game | null }>("/games/current").then((r) => r.game),
  get: (id: string) => request<GameRes>(`/games/${id}`).then((r) => r.game),
  answer: (id: string, question: string, option: Option) =>
    request<{ correct: boolean; correctOption: Option; earned: number; game: Game }>(`/games/${id}/answers`, json("POST", { question, option })),
  advance: (id: string) => request<GameRes>(`/games/${id}/advance`, json("POST")).then((r) => r.game),
};

export type QuestionInput = Omit<AdminQuestion, "_id" | "alternatives"> & { alternatives: string[] };
export const adminApi = {
  list: (subject?: string) => request<{ questions: AdminQuestion[] }>(`/admin/questions${subject ? `?subject=${subject}` : ""}`).then((r) => r.questions),
  create: (q: QuestionInput) => request<{ question: AdminQuestion }>("/admin/questions", json("POST", q)).then((r) => r.question),
  update: (id: string, q: QuestionInput) => request<{ question: AdminQuestion }>(`/admin/questions/${id}`, json("PUT", q)).then((r) => r.question),
  remove: (id: string) => request(`/admin/questions/${id}`, json("DELETE")),
};
