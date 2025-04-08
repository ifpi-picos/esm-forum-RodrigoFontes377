const bd = require("../bd/bd_utils.js");
const modelo = require("../modelo.js");

beforeEach(() => {
  bd.reconfig("./bd/esmforum-teste.db");
  // limpa dados de todas as tabelas
  bd.exec("delete from perguntas", []);
  bd.exec("delete from respostas", []);
});

test("Testando banco de dados vazio", () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test("Testando cadastro de três perguntas", () => {
  modelo.cadastrar_pergunta("1 + 1 = ?");
  modelo.cadastrar_pergunta("2 + 2 = ?");
  modelo.cadastrar_pergunta("3 + 3 = ?");
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe("1 + 1 = ?");
  expect(perguntas[1].texto).toBe("2 + 2 = ?");
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta - 1);
});

test("Testando cadastro de perguntas e respostas", () => {
  modelo.cadastrar_pergunta("Qual o sabor do sorvete de morango?");
  modelo.cadastrar_pergunta("O que é 2 + 2?");

  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(2);
  expect(perguntas[0].texto).toBe("Qual o sabor do sorvete de morango?");
  expect(perguntas[1].texto).toBe("O que é 2 + 2?");

  const idPergunta1 = perguntas[0].id_pergunta;
  const idPergunta2 = perguntas[1].id_pergunta;

  modelo.cadastrar_resposta(idPergunta1, "Doce");
  modelo.cadastrar_resposta(idPergunta1, "Ácido");
  modelo.cadastrar_resposta(idPergunta2, "4");

  expect(modelo.get_num_respostas(idPergunta1)).toBe(2);
  expect(modelo.get_num_respostas(idPergunta2)).toBe(1);
});

test("Testando recuperação de perguntas e respostas", () => {
  modelo.cadastrar_pergunta("Que cor geralmente tem um limão?");
  modelo.cadastrar_pergunta("Quanto é 7 + 3?");

  const perguntas = modelo.listar_perguntas();
  const idPergunta1 = perguntas[0].id_pergunta;
  const idPergunta2 = perguntas[1].id_pergunta;

  modelo.cadastrar_resposta(idPergunta1, "Verde");
  modelo.cadastrar_resposta(idPergunta1, "Amarelo");
  modelo.cadastrar_resposta(idPergunta2, "10");

  const perguntaRecuperada = modelo.get_pergunta(idPergunta1);
  expect(perguntaRecuperada).toBeDefined();
  expect(perguntaRecuperada.texto).toBe("Que cor geralmente tem um limão?");

  const respostasPergunta1 = modelo.get_respostas(idPergunta1);
  const respostasPergunta2 = modelo.get_respostas(idPergunta2);

  expect(respostasPergunta1.length).toBe(2);
  expect(respostasPergunta1[0].texto).toBe("Verde");
  expect(respostasPergunta1[1].texto).toBe("Amarelo");

  expect(respostasPergunta2.length).toBe(1);
  expect(respostasPergunta2[0].texto).toBe("10");
});
