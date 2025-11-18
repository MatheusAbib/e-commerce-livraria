/// <reference types="cypress" />

// Ignorar erros de JS do frontend
Cypress.on('uncaught:exception', () => false);

describe('CRUD de Clientes', () => {

  // Função para criar cliente único
  const gerarCliente = () => {
    const timestamp = Date.now();
    return {
      nome: `Maria Silva ${timestamp}`,
      email: `maria${timestamp}@teste.com`,
      telefone: '(11) 99999-9999',
      nascimento: '1990-05-10',
      genero: 'FEMININO',
      cpf: `123.456.789-${Math.floor(Math.random()*99).toString().padStart(2,'0')}`,
      senha: 'Admin123#',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      numero: '123',
      cep: '01001-000',
      rua: 'Rua Teste',
      tipoResidencia: 'Apartamento',
      tipoLogradouro: 'Rua',
      logradouro: 'Paulista',
      cartaoNumero: '4111111111111111',
      cartaoNome: 'Maria Silva',
      cartaoCVV: '123'
    };
  };

  let cliente;

  it('Cadastra novo cliente', () => {
    cliente = gerarCliente();
    cy.visit('/clientes.html');

    cy.get('#nome').type(cliente.nome);
    cy.get('#email').type(cliente.email);
    cy.get('#tipotelefone').select('celular');
    cy.get('#telefone').type(cliente.telefone);
    cy.get('#nascimento').type(cliente.nascimento);
    cy.get('#genero').select(cliente.genero);
    cy.get('#cpf').type(cliente.cpf);
    cy.get('#senha').type(cliente.senha);
    cy.get('#confirmar-senha-cadastro').type(cliente.senha);

    // Endereço cobrança
    cy.get('#cobranca-bairro').type(cliente.bairro);
    cy.get('#cobranca-cidade').type(cliente.cidade);
    cy.get('#cobranca-estado').select(cliente.estado);
    cy.get('#cobranca-numero').type(cliente.numero);
    cy.get('#cobranca-cep').type(cliente.cep);
    cy.get('#cobranca-rua').type(cliente.rua);
    cy.get('#cobranca-tipo-residencia').type(cliente.tipoResidencia);
    cy.get('#cobranca-tipo-logradouro').type(cliente.tipoLogradouro);
    cy.get('#cobranca-logradouro').type(cliente.logradouro);

    // Endereço entrega
    cy.get('#entrega-bairro').type(cliente.bairro);
    cy.get('#entrega-cidade').type(cliente.cidade);
    cy.get('#entrega-estado').select(cliente.estado);
    cy.get('#entrega-numero').type(cliente.numero);
    cy.get('#entrega-cep').type(cliente.cep);
    cy.get('#entrega-rua').type(cliente.rua);
    cy.get('#entrega-tipo-residencia').type(cliente.tipoResidencia);
    cy.get('#entrega-tipo-logradouro').type(cliente.tipoLogradouro);
    cy.get('#entrega-logradouro').type(cliente.logradouro);

    // Cartão
    cy.get('#cartao-numero').type(cliente.cartaoNumero);
    cy.get('#cartao-nome').type(cliente.cartaoNome);
    cy.get('#cartao-bandeira').select('Visa');
    cy.get('#cartao-cvv').type(cliente.cartaoCVV);
    cy.get('#cartao-validade', { timeout: 5000 }).should('not.be.disabled');
    cy.get('#cartao-validade').type('2030-12');

    cy.get('button[type="submit"]').click();

    // Verifica se o modal de sucesso aparece dentro de até 10 segundos
    cy.get('#modal-sucesso', { timeout: 10000 }).should('be.visible');

    /* Confirma que o modal some após 3 segundos, se quiser testar isso:
    cy.wait(4000);
    cy.get('#modal-sucesso').should('not.be.visible');*/

  });

// Lista o Cliente
  it('Lista cliente cadastrado', () => {
    cy.intercept('GET', '/api/clientes/consulta*').as('getClientes');
    cy.visit('/usuarios.html');
    cy.get('#filtro-nome').type(cliente.nome);
    cy.get('button.btn-filtrar').click();
    cy.wait('@getClientes');

    cy.contains('tr', cliente.nome, { timeout: 10000 }).should('exist');
    cy.contains('tr', cliente.email).should('exist');
  });

  // Altera o status do cliente

describe('Alteração de Status do Cliente', () => {
  const nome = 'Maria da Silva';

  it('Inativa e ativa novamente o cliente', () => {
    cy.intercept('GET', '/api/clientes/consulta*').as('getClientes');
    cy.visit('http://localhost:8081/usuarios.html');

    // Filtra o cliente na lista
    cy.get('#filtro-nome').type(nome);
    cy.get('button.btn-filtrar').click();
    cy.wait('@getClientes');

    // Inativa o cliente
    cy.contains('tr', nome, { timeout: 10000 }).within(() => {
      cy.get('.btn-status').click();
    });

    cy.get('#motivo-status').type('Teste inativação Cypress');
    cy.get('#btn-confirmar-status').click();

    // Aguarda tabela atualizar e verifica status "Inativo"
    cy.get('#clientes-tbody', { timeout: 10000 }).should($tbody => {
      expect($tbody).to.contain(nome);
      expect($tbody).to.contain('Inativo');
    });

    // Ativa novamente o cliente
    cy.contains('tr', nome, { timeout: 10000 }).within(() => {
      cy.get('.btn-status').click();
    });

    cy.get('#motivo-status').type('Reativação Cypress');
    cy.get('#btn-confirmar-status').click();

    // Aguarda tabela atualizar e verifica status "Ativo"
    cy.get('#clientes-tbody', { timeout: 10000 }).should($tbody => {
      expect($tbody).to.contain(nome);
      expect($tbody).to.contain('Ativo');
    });
  });
});


// Exclusão do cliente
  it('Exclui o cliente', () => {
    cy.intercept('GET', '/api/clientes/consulta*').as('getClientes');
    cy.visit('/usuarios.html');
    cy.get('#filtro-nome').type(cliente.nome);
    cy.get('button.btn-filtrar').click();
    cy.wait('@getClientes');

    cy.contains('tr', cliente.nome, { timeout: 10000 }).within(() => {
      cy.get('.btn-delete').click();
    });

    cy.get('#btn-confirmar-excluir').click();

    // Aguarda a tabela atualizar e verifica que o cliente sumiu
    cy.get('#clientes-tbody', { timeout: 10000 }).should($tbody => {
      expect($tbody).not.to.contain(cliente.nome);
    });
  });
});
