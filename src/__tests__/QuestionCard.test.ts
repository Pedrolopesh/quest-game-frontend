import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import type { Round } from "@/api/types";
import QuestionCard from "@/components/QuestionCard.vue";

const base: Round = {
  question: "q1",
  level: 1,
  statement: "Quanto é 7 × 8?",
  alternatives: [
    { option: "A", text: "54" },
    { option: "B", text: "56" },
    { option: "C", text: "58" },
    { option: "D", text: "64" },
  ],
  points: 100,
  answer: null,
  correct: null,
  earned: 0,
  correctOption: null,
};

describe("QuestionCard", () => {
  it("emite a alternativa escolhida", async () => {
    const w = mount(QuestionCard, { props: { round: base, index: 0, total: 3 } });
    await w.findAll("button.ans")[1].trigger("click");
    expect(w.emitted("pick")?.[0]).toEqual(["B"]);
    expect(w.text()).toContain("Vale 100");
  });

  it("depois de responder, trava e marca certa e errada", () => {
    const w = mount(QuestionCard, { props: { round: { ...base, answer: "A", correct: false, correctOption: "B" }, index: 0, total: 3 } });
    const buttons = w.findAll("button.ans");
    expect(buttons.every((b) => b.attributes("disabled") !== undefined)).toBe(true);
    expect(buttons[0].classes()).toContain("wrong");
    expect(buttons[1].classes()).toContain("right");
    expect(w.text()).toContain("a certa era a B");
  });

  it("mostra os pontos ganhos no acerto", () => {
    const w = mount(QuestionCard, { props: { round: { ...base, answer: "B", correct: true, earned: 100, correctOption: "B" }, index: 2, total: 3 } });
    expect(w.text()).toContain("+100");
    expect(w.text()).toContain("Pergunta 3 de 3");
  });
});
