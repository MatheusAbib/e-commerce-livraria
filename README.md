# Sistema de Gestão de Livros e Vendas - E-Commerce 

# Desenvolvido para a matéria de Laboratório de Engenharia de Software por Matheus Abib


## Descrição do Projeto

Este sistema tem como objetivo gerenciar de forma eficiente o cadastro de livros, clientes e o processo de vendas eletrônicas, incluindo controle de estoque, histórico de vendas e recomendações personalizadas com IA generativa. A solução foi desenvolvida para garantir alta performance, segurança, integridade dos dados e atender a todas as regras e requisitos definidos para o negócio.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Requisitos Funcionais](#requisitos-funcionais)
- [Requisitos Não Funcionais](#requisitos-não-funcionais)
- [Regras de Negócio](#regras-de-negócio)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
  
---

## Funcionalidades

- Cadastro, alteração, ativação e inativação de livros e clientes
- Consulta avançada com múltiplos filtros para livros, clientes e transações
- Gerenciamento completo do carrinho de compras com validação de estoque
- Processamento de compras com cálculo de frete, seleção de endereço e forma de pagamento
- Controle detalhado de status das compras (em processamento, em trânsito, entregue, troca autorizada, etc.)
- Solicitação e autorização de trocas, geração e uso de cupons de troca e promocionais
- Controle rigoroso de estoque com entrada, baixa e reentrada via trocas
- Análise histórica de vendas com gráficos para apoio à decisão
- Recomendação personalizada de livros via IA generativa e chatbot integrado

---

## Requisitos Funcionais

### Grupo: Cadastro de Livros

- **RF0011** - Cadastro único de livros
- **RF0012** - Inativação manual de livros
- **RF0013** - Inativação automática de livros sem estoque e sem vendas relevantes
- **RF0014** - Alteração dos dados cadastrais dos livros
- **RF0015** - Consulta de livros com filtros flexíveis
- **RF0016** - Ativação de livros inativos

### Grupo: Cadastro de Clientes

- **RF0021** - Cadastro de clientes
- **RF0022** - Alteração dos dados cadastrais dos clientes
- **RF0023** - Inativação de clientes
- **RF0024** - Consulta de clientes com filtros
- **RF0025** - Consulta de histórico de transações do cliente
- **RF0026** - Associação de múltiplos endereços de entrega aos clientes
- **RF0027** - Associação de múltiplos cartões de crédito, com cartão preferencial
- **RF0028** - Alteração da senha sem alterar outros dados

### Grupo: Gerenciar Vendas Eletrônicas

- **RF0031** - Gerenciamento do carrinho de compras (adicionar, alterar, excluir itens)
- **RF0032** - Definição e edição da quantidade de itens no carrinho
- **RF0033** - Realização da compra a partir do carrinho
- **RF0034** - Cálculo automático do frete conforme itens e endereço
- **RF0035** - Seleção e cadastro de endereços de entrega no momento da compra
- **RF0036** - Seleção e cadastro de formas de pagamento, incluindo cupons promocionais e de troca
- **RF0037** - Finalização da compra com status "Em Processamento"
- **RF0038** - Despacho de produtos e alteração do status para "Em Trânsito"
- **RF0039** - Confirmação de entrega e alteração do status para "Entregue"
- **RF0040** - Solicitação de troca por cliente
- **RF0041** - Autorização de trocas pelo administrador
- **RF0042** - Visualização de trocas pelo administrador
- **RF0043** - Confirmação de recebimento dos itens para troca pelo administrador
- **RF0044** - Geração de cupom de troca após confirmação de recebimento dos itens

### Grupo: Controle de Estoque

- **RF0051** - Registro de entrada de itens no estoque com dados completos
- **RF0052** - Cálculo do valor de venda baseado no custo e grupo de precificação
- **RF0053** - Baixa de estoque conforme vendas realizadas
- **RF0054** - Reentrada no estoque via trocas

### Grupo: Análise

- **RF0055** - Consulta e análise do histórico de vendas por período e categorias

---

## Requisitos Não Funcionais

### Grupo: Geral

- **RNF0011** - Tempo de resposta para consultas máximo de 1 segundo
- **RNF0012** - Log completo de todas as operações de escrita (inserção/alteração) com data, hora e usuário

### Grupo: Cadastro de Livros

- **RNF0021** - Código único para cada livro
- **RNF0013** - Script para inserção de domínios e tabelas base (ex.: grupo de precificação, autores, editoras)

### Grupo: Cadastro de Clientes

- **RNF0031** - Senha forte com mínimo 8 caracteres, letras maiúsculas, minúsculas e caracteres especiais
- **RNF0032** - Confirmação obrigatória da senha na criação
- **RNF0033** - Senha armazenada criptografada
- **RNF0034** - Alteração simples e independente dos endereços
- **RNF0035** - Código único para cada cliente

### Grupo: Gerenciar Vendas Eletrônicas

- **RNF0042** - Exibição de itens removidos do carrinho por expiração, com desabilitação da compra
- **RNF0043** - Exibição do histórico de vendas em gráfico de linhas
- **RNF0044** - Integração com IA generativa para recomendação personalizada e chatbot interativo

---

## Regras de Negócio

### Grupo: Cadastro de Livros

- **RN0011** - Dados obrigatórios para cadastro: autor, categoria(s), ano, título, editora, edição, ISBN, nº páginas, sinopse, dimensões, grupo de precificação e código de barras
- **RN0012** - Livros podem estar associados a múltiplas categorias
- **RN0013** - Valor de venda calculado via grupo de precificação e margem parametrizada
- **RN0014** - Alteração de preço restrita à margem, abaixo dela só com autorização de gerente
- **RN0015** - Justificativa e categoria obrigatória para inativação manual
- **RN0016** - Inativação automática classificada como "FORA DE MERCADO"
- **RN0017** - Justificativa e categoria para reativação de livros

### Grupo: Cadastro de Clientes

- **RN0021** - Cliente deve ter pelo menos um endereço de cobrança cadastrado
- **RN0022** - Cliente deve ter pelo menos um endereço de entrega cadastrado
- **RN0023** - Endereços completos com todos os campos obrigatórios preenchidos
- **RN0024** - Cartões de crédito completos e válidos (número, nome, bandeira, código de segurança)
- **RN0025** - Somente bandeiras cadastradas no sistema são aceitas
- **RN0026** - Dados obrigatórios para clientes: gênero, nome, data nascimento, CPF, telefone completo, e-mail, senha, endereço residencial
- **RN0027** - Ranking numérico para clientes baseado no perfil de compras
- **RN0028** - Estoque só é dado baixa após aprovação da compra

### Grupo: Gerenciar Vendas Eletrônicas

- **RN0031** - Validação de estoque para adicionar itens no carrinho e quantidade máxima permitida
- **RN0032** - Validação dinâmica do estoque antes da compra, com notificações e ajustes automáticos no carrinho
- **RN0033** - Apenas um cupom promocional por compra
- **RN0034** - Pagamento pode ser dividido entre múltiplos cartões, mínimo R$10,00 por cartão
- **RN0035** - Combinação de cupons e cartões permite valores menores que R$10,00 no cartão
- **RN0036** - Cupom de troca gerado em casos de sobras na compra com cupons
- **RN0037** - Validação das formas de pagamento após compra (validade de cupons, operadora)
- **RN0038** - Alteração do status da compra para APROVADA ou REPROVADA conforme validação de pagamento
- **RN0039** - Status "EM TRANSPORTE" definido pelo administrador
- **RN0040** - Status "ENTREGUE" definido pelo administrador
- **RN0041** - Geração e status do pedido de troca ("EM TROCA")
- **RN0042** - Alteração do status para "TROCADO" após recebimento dos itens para troca
- **RN0043** - Troca solicitada apenas para pedidos com status ENTREGUE
- **RN0044** - Bloqueio temporário de itens adicionados ao carrinho para evitar sobreposição, com notificações e tempo limite
- **RNF0045** - Itens desbloqueados removidos do carrinho original
- **RNF0046** - Notificação ao cliente sobre autorização de troca

### Grupo: Controle de Estoque

- **RN0051** - Entrada em estoque deve conter produto, quantidade, custo, fornecedor e data
- **RN005x** - Valor de venda calculado pelo maior custo para itens com custos diferentes
- **RN0061** - Quantidade mínima para entrada em estoque é 1 (não permite zero)
- **RN0062** - Valor de custo obrigatório para todo item
- **RNF0064** - Data de entrada obrigatória para itens no estoque

---

## Tecnologias Utilizadas

![Java](https://img.shields.io/badge/Java-17%2B-blue)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.1-green)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.2-purple)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blueviolet)



