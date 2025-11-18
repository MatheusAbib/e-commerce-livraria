/// <reference types="cypress" />

// 🔧 Ignora erros de JS do front (addEventListener em elemento inexistente)
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes("addEventListener")) {
    // Evita falha por erro interno do site
    return false;
  }
});

describe('Fluxo completo de compra - E-commerce Livraria', () => {

  it('Deve realizar o login, adicionar produtos, finalizar a compra e exibir mensagem de sucesso', () => {

    // Acessa a página principal
    cy.visit('http://localhost:8081/principal.html');

    // Abre o modal e faz login
    cy.get('#btn-auth').click();
    cy.get('#login-email').type('andressa@gmail.com');
    cy.get('#login-senha').type('Admin123#');
    cy.get('#form-login').submit();

    // Espera os produtos carregarem na home
    cy.wait(3000);

    // Adiciona até 3 produtos ao carrinho
cy.get('.btn.btn-adicionar:visible')
  .each(($btn, index) => {
    if (index < 3) {
      cy.wrap($btn).click({ force: true });
      cy.wait(1000);
    }
  });
    
// Fecha modal de logout se estiver aberto
cy.get('body').then(($body) => {
  if ($body.find('.modal.show').length) {
    cy.get('.modal.show').then(($modal) => {
      if ($modal.find('button').length) {
        cy.wrap($modal).find('button').contains(/cancelar|fechar/i).click({ force: true });
      } else {
        cy.wrap($modal).find('.btn-close').click({ force: true });
      }
    });
  }
});

    // Abre o carrinho 
    cy.get('a[href="carrinho.html"]').click({ force: true });

    // Espera o carrinho carregar e verifica os produtos
    cy.url().should('include', 'carrinho.html');
    cy.wait(2000);


    // Seleciona endereço de entrega
    cy.get('#select-endereco', { timeout: 15000 })
      .should('be.visible')
      .select(1);

cy.log('Selecionando e preenchendo múltiplos cartões')

// Garante que o select já tem opções
cy.get('#cartoes-container .cartao-pagamento').first().within(() => {
  cy.get('select.select-cartao')
    .should('be.visible')
    .find('option')
    .should('have.length.greaterThan', 1)

  // Seleciona o primeiro cartão disponível
  cy.get('select.select-cartao').select(1, { force: true })
  cy.get('input.valor-cartao').clear().type('100.00', { force: true })
})


// Clica para adicionar outro cartão
cy.contains('button', 'Adicionar outro cartão', { timeout: 10000 })
  .should('be.visible')
  .click({ force: true })

// Aguarda até que apareça pelo menos 2 cartões, com espera e verificação de renderização
cy.get('.cartao-pagamento', { timeout: 20000 })
  .should(($cards) => {
    expect($cards.length).to.be.at.least(2)
  })

// Interage com o segundo cartão
cy.get('.cartao-pagamento').eq(1).within(() => {
  cy.get('select.select-cartao').should('exist').select(1, { force: true })
  cy.get('input.valor-cartao').clear().type('96.35', { force: true })
})

 it('Aplica cupom e finaliza a compra', () => {
    cy.get('#input-cupom').type('TROCA-6832VT');
    cy.get('#btn-aplicar-cupom').click({ force: true });
    cy.contains(/Cupom aplicado|Cupom válido/, { timeout: 5000 }).should('exist');

    cy.get('#btn-finalizar').click({ force: true });
    cy.contains(/Compra realizada|Pedido confirmado/, { timeout: 10000 }).should('be.visible');
    cy.log('🛍️ Compra finalizada com sucesso');
  });

// Finaliza compra
cy.get('#btn-finalizar').click()

  });
});
