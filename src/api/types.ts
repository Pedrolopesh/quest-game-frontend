export type Option = "A" | "B" | "C" | "D";

export type Me = { _id: string; nickname: string; email: string; totalScore: number; bestScore: number; gamesPlayed: number; isAdmin: boolean };
export type Subject = { _id: string; slug: string; title: string; description: string; questions: number };
export type RankingRow = { position: number; _id: string; nickname: string; totalScore: number; bestScore: number; gamesPlayed: number };
export type Stats = { players: number; games: number; questions: number };

export type Round = {
  question: string;
  level: number;
  statement: string;
  alternatives: { option: Option; text: string }[];
  points: number;
  answer: Option | null;
  correct: boolean | null;
  earned: number;
  correctOption: Option | null;
};

export type Game = {
  _id: string;
  subject: { _id: string; slug: string; title: string } | null;
  phase: number;
  phases: number;
  status: "playing" | "finished";
  score: number;
  correctCount: number;
  total: number;
  rounds: Round[];
  position: number | null;
};

export type AdminQuestion = {
  _id: string;
  subject: string;
  level: number;
  statement: string;
  alternatives: { option: Option; text: string }[];
  correct: Option;
  points: number;
  status: "active" | "inactive";
};
