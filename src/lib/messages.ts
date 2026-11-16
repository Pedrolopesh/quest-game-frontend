import { ApiError } from "@/api/http";

/** Códigos da API → frases para o jogador. */
const MESSAGES: Record<string, string> = {
  invalid_code: "Código errado ou expirado. Confira o e-mail ou peça outro.",
  nickname_taken: "Esse apelido já tem dono. Tente outro.",
  phase_incomplete: "Responda todas as perguntas da fase antes de avançar.",
  game_finished: "Essa partida já terminou.",
  not_answerable: "Essa pergunta já foi respondida.",
  not_enough_questions: "Essa matéria ainda não tem perguntas suficientes.",
  "Game not found": "Partida não encontrada.",
  "Subject not found": "Matéria não encontrada.",
  "Please fill in all fields": "Confira os campos e tente de novo.",
};

export function friendly(err: unknown): string {
  if (err instanceof ApiError) return MESSAGES[err.message] ?? err.message;
  return err instanceof Error ? err.message : "Algo deu errado.";
}

export const fmt = (n: number) => n.toLocaleString("pt-BR");
