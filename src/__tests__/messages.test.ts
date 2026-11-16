import { describe, expect, it } from "vitest";
import { ApiError } from "@/api/http";
import { fmt, friendly } from "@/lib/messages";

describe("mensagens", () => {
  it("traduz códigos da API", () => {
    expect(friendly(new ApiError(400, "invalid_code"))).toMatch(/Código errado/);
    expect(friendly(new ApiError(409, "nickname_taken"))).toMatch(/apelido/);
    expect(friendly(new ApiError(500, "outra coisa"))).toBe("outra coisa");
    expect(friendly(new Error("x"))).toBe("x");
    expect(friendly("??")).toBe("Algo deu errado.");
  });
  it("formata números em pt-BR", () => {
    expect(fmt(2400)).toBe("2.400");
  });
});
