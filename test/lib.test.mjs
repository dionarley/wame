import { describe, it, expect } from "vitest";
import {
  onlyNumbers,
  getPhoneNumber,
  isValidNumber,
  formatPhone,
  formatDDD,
  generateLink,
} from "../src/lib.mjs";

describe("onlyNumbers", () => {
  it("remove letras e símbolos", () => {
    expect(onlyNumbers("(38) 99999-9999")).toBe("38999999999");
  });

  it("mantém números puros", () => {
    expect(onlyNumbers("5538999999999")).toBe("5538999999999");
  });

  it("trata string vazia", () => {
    expect(onlyNumbers("")).toBe("");
  });

  it("trata null/undefined sem lançar", () => {
    expect(onlyNumbers(null)).toBe("");
    expect(onlyNumbers(undefined)).toBe("");
  });
});

describe("formatDDD", () => {
  it("remove formatação do DDD", () => {
    expect(formatDDD("3-8")).toBe("38");
  });

  it("limita a 3 dígitos", () => {
    expect(formatDDD("99999")).toBe("999");
  });
});

describe("formatPhone", () => {
  it("formata celular BR (9 dígitos) com hífen", () => {
    expect(formatPhone("55", "999999999")).toBe("99999-9999");
  });

  it("não excede 9 dígitos no Brasil", () => {
    expect(formatPhone("55", "99999999999")).toBe("99999-9999");
  });

  it("mantém 8 dígitos (fixo) no Brasil sem hífen incompleto", () => {
    expect(formatPhone("55", "99999999")).toBe("99999-999");
  });

  it("não formata números de outros países", () => {
    expect(formatPhone("1", "5551234567")).toBe("5551234567");
  });
});

describe("getPhoneNumber", () => {
  it("concatena DDI + DDD + número sem formatação", () => {
    expect(getPhoneNumber("55", "38", "99999-9999")).toBe("5538999999999");
  });

  it("remove caracteres inválidos", () => {
    expect(getPhoneNumber("+55", "(38)", "99999 9999")).toBe("5538999999999");
  });
});

describe("isValidNumber", () => {
  describe("Brasil (55)", () => {
    it("aceita celular com 9 dígitos", () => {
      expect(isValidNumber("55", "38", "999999999")).toBe(true);
    });

    it("aceita fixo com 8 dígitos", () => {
      expect(isValidNumber("55", "38", "99999999")).toBe(true);
    });

    it("rejeita DDD inválido (1 dígito)", () => {
      expect(isValidNumber("55", "3", "999999999")).toBe(false);
    });

    it("rejeita número com dígitos insuficientes", () => {
      expect(isValidNumber("55", "38", "9999")).toBe(false);
    });

    it("ignora formatação na validação", () => {
      expect(isValidNumber("55", "38", "99999-9999")).toBe(true);
    });
  });

  describe("Outros países", () => {
    it("aceita número com 6 ou mais dígitos", () => {
      expect(isValidNumber("1", "", "555123")).toBe(true);
      expect(isValidNumber("351", "", "5551234567")).toBe(true);
    });

    it("rejeita número com menos de 6 dígitos", () => {
      expect(isValidNumber("1", "", "55512")).toBe(false);
    });
  });
});

describe("generateLink", () => {
  it("gera link básico sem mensagem", () => {
    expect(generateLink("55", "38", "999999999", "")).toBe(
      "https://wa.me/5538999999999",
    );
  });

  it("inclui mensagem codificada em ?text=", () => {
    expect(generateLink("55", "38", "999999999", "Olá mundo")).toBe(
      "https://wa.me/5538999999999?text=Ol%C3%A1%20mundo",
    );
  });

  it("ignora mensagens só de espaços", () => {
    expect(generateLink("55", "38", "999999999", "   ")).toBe(
      "https://wa.me/5538999999999",
    );
  });

  it("retorna null para número inválido", () => {
    expect(generateLink("55", "38", "9999", "oi")).toBeNull();
  });

  it("é determinístico para números formatados", () => {
    expect(generateLink("55", "38", "99999-9999", "Oi")).toBe(
      "https://wa.me/5538999999999?text=Oi",
    );
  });
});