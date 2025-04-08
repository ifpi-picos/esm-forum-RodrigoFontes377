describe("Fluxo completo de envio de resposta", () => {
  it("Permite responder a uma pergunta já cadastrada", () => {
    // Abre a página principal do fórum
    cy.visit("/");

    // Garante que há perguntas listadas e acessa a primeira
    cy.get('tbody tr td a[href^="/respostas/?id_pergunta="]')
      .should("exist")
      .first()
      .click();

    // Localiza o campo de resposta e preenche com um texto de teste
    cy.get('textarea[name="resposta"]', { timeout: 5000 })
      .should("be.visible")
      .type("Resposta automática inserida via Cypress.");

    // Envia o formulário de resposta
    cy.get('input[type="submit"]').click();

    // Verifica a mensagem de confirmação
    cy.contains("Sua resposta foi cadastrada com sucesso.").should("exist");

    // Retorna à pergunta para garantir que a nova resposta está lá
    cy.get('a[href^="/respostas/?id_pergunta="]').first().click();

    cy.contains("Resposta automática inserida via Cypress.").should(
      "be.visible"
    );
  });
});
