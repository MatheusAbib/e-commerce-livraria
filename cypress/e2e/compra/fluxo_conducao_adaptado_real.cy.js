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

  // Finaliza compra
    cy.get('#btn-finalizar').click({ force: true });
    cy.contains(/Compra realizada|Pedido confirmado/, { timeout: 10000 }).should('be.visible');
    cy.log('🛍️ Compra finalizada com sucesso');

  // Primeiro, clica em "Voltar à loja" na tela do carrinho
  cy.visit('http://localhost:8081/principal.html');
  cy.wait(1000);

  // Agora clica no botão da sidebar que leva a "pedidos.html"
  cy.visit('http://localhost:8081/pedidos.html');
  cy.wait(1000);


  // Verifica se realmente foi para pedidos.html
  cy.url().should('include', 'pedidos.html');

  // Confirma o status do pedido
  cy.contains(/Em processamento/i, { timeout: 10000 }).should('exist');
  cy.log('📦 Pedido em processamento confirmado');
});

it('Admin aprova o último pedido "Em Processamento"', () => {
  // Login como admin
  cy.visit('http://localhost:8081/principal.html');
  cy.get('#btn-auth').click({ force: true });
  cy.get('#login-email').type('admin@livros.com');
  cy.get('#login-senha').type('Admin123#');
  cy.get('#form-login').submit();
  cy.wait(2000);

  // Acessa página de pedidos do admin
  cy.get('a[href="pedidosADMIN.html"]').click({ force: true });
  cy.url().should('include', 'pedidosADMIN.html');
  cy.wait(10000);

  // Garante que estamos na aba "Em Processamento"
  cy.get('#tab-processamento').should('be.visible').click({ force: true });
  cy.get('#tab-processamento').should('have.class', 'active');

  // Espera carregar a lista de pedidos
  cy.get('table tbody tr', { timeout: 100000 }).should('have.length.at.least', 1);

  // Captura o último botão "Aprovar" da tabela
    cy.get('table tbody tr').last().within(() => {
    cy.get('.btn.btn-aprovar')
      .should('be.visible')
      .click({ force: true });
  });

  // Confirma que o status mudou para "Em Trânsito"
  cy.contains(/Em trânsito/i, { timeout: 10000 }).should('exist');
  cy.log('🚚 Pedido mais recente aprovado com sucesso!');
});

it('Cliente marca o último pedido como entregue e solicita devolução', () => {
    // Login do cliente
    cy.visit('http://localhost:8081/principal.html');
    cy.get('#btn-auth').click({ force: true });
    cy.get('#login-email').type('andressa@gmail.com');
    cy.get('#login-senha').type('Admin123#');
    cy.get('#form-login').submit();
    cy.wait(1500);

    // Garantindo que estamos na página de pedidos
    cy.visit('http://localhost:8081/pedidos.html'); 
    cy.get('#tab-pedidos', { timeout: 10000 }).should('be.visible').click({ force: true });

    cy.get('.btn-acao.btn-entregue', { timeout: 10000 }).should('be.visible').click({ force: true });
    

    // Confirma que mudou pra "Entregue"
    cy.contains(/Entregue/i, { timeout: 5000 }).should('exist');
    cy.log('📬 Pedido entregue confirmado');

    // Vai pra aba "Entregues"
    cy.get('#tab-historico', { timeout: 10000 }).should('be.visible').click({ force: true });

    // Espera até que a tabela da aba "Entregues" tenha pelo menos 1 pedido e clica no último "Solicitar Devolução"
    cy.get('.btn-acao.btn-devolucao', { timeout: 10000 }).should('be.visible').click({ force: true });

    // Seleciona o último item para devolução
    cy.get('#itens-devolucao-container .item-devolucao').last().within(() => {
    cy.get('input[type="checkbox"]').check({ force: true });
});

    // Preenche o motivo da devolução
    cy.get('#motivo-devolucao').type('Produto diferente do pedido');

    // Clica no botão de confirmar
    cy.get('.btn-confirmar').click({ force: true });
});

it('Admin aprova devolução', () => {
    cy.visit('http://localhost:8081/principal.html');
    cy.get('#btn-auth').click({ force: true });
    cy.get('#login-email').type('admin@livros.com');
    cy.get('#login-senha').type('Admin123#');
    cy.get('#form-login').submit();
    cy.wait(2000);

    cy.get('a[href="pedidosADMIN.html"]').click({ force: true });
    cy.get('.btn.btn-aprovar').click({ force: true });
   
  });

  it('Cliente confirma devolução e gera cupom', () => {
  cy.visit('http://localhost:8081/principal.html');
  cy.get('#btn-auth').click({ force: true });
  cy.get('#login-email').type('andressa@gmail.com');
  cy.get('#login-senha').type('Admin123#');
  cy.get('#form-login').submit();

  // Espera o login completar e a home carregar
  cy.url({ timeout: 10000 }).should('include', 'principal.html');
  cy.get('body').should('not.have.class', 'modal-open');

  // **Clique no link da sidebar para pedidos** em vez de usar visit()
  cy.get('a[href="pedidos.html"]', { timeout: 10000 }).should('be.visible').click({ force: true });

  cy.url().should('include', 'pedidos.html');
  cy.wait(2000);

  // Aba "devolvidos"
  cy.get('#tab-devolvidos', { timeout: 10000 }).should('be.visible').click({ force: true });
  cy.get('#tab-devolvidos').should('have.class', 'active');


  // Clica no último "Confirmar Troca"
    cy.get('.btn-acao.btn-confirmar-troca').should('be.visible').click({ force: true });
});




});
