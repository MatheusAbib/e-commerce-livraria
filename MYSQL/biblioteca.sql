-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tempo de Geração: 24/10/2025 às 18h20min
-- Versão do Servidor: 5.5.20
-- Versão do PHP: 5.3.9

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Banco de Dados: `biblioteca`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `cartao`
--

CREATE TABLE IF NOT EXISTS `cartao` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `bandeira` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cvv` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_validade` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_titular` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cliente_id` bigint(20) DEFAULT NULL,
  `preferencial` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjvbpp9u681gt112ldcpy56idf` (`cliente_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=117 ;

--
-- Extraindo dados da tabela `cartao`
--

INSERT INTO `cartao` (`id`, `bandeira`, `cvv`, `data_validade`, `nome_titular`, `numero`, `cliente_id`, `preferencial`) VALUES
(64, 'American Express', '222', '2025-10', 'Matheus Bilitardo Abib', '2222', 39, '1'),
(104, 'Visa', '123', '2030-12', 'Maria Silva', '4111111111111111', 75, '1'),
(112, 'Elo', '4443', '2030-04', 'andressa', '4444444444444444', 83, '1'),
(113, 'Visa', '123', '2030-12', 'Maria da Silva', '4111111111111111', 84, '1'),
(114, 'Visa', '123', '09/2027', 'andressa 2', '6666666666666666', 83, '0');

-- --------------------------------------------------------

--
-- Estrutura da tabela `cliente`
--

CREATE TABLE IF NOT EXISTS `cliente` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ativo` bit(1) NOT NULL,
  `cpf` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_cadastro` date DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motivo_ativacao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motivo_inativacao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `senha` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `genero` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nascimento` date DEFAULT NULL,
  `tipotelefone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `perfil` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=86 ;

--
-- Extraindo dados da tabela `cliente`
--

INSERT INTO `cliente` (`id`, `ativo`, `cpf`, `data_cadastro`, `email`, `motivo_ativacao`, `motivo_inativacao`, `nome`, `senha`, `telefone`, `genero`, `nascimento`, `tipotelefone`, `perfil`) VALUES
(39, '1', '422.113.848-38', '2025-07-23', 'luciasilva@gmail.com', NULL, NULL, 'Lucia Meneguel', '$2a$10$DNE9sx10C7bk10NjqiK2nO5WO/7WvRPgaSQnFjdIPAfRU6NNnLPHW', '(11) 97507-2008', 'MASCULINO', '2004-09-20', 'celular', 'CLIENTE'),
(54, '1', NULL, '2025-08-04', 'admin@livros.com', NULL, NULL, 'Administrador', '$2a$10$NIlHTEv6jYa/hZaZm78hyuJz7bcOLA1cY3sT.8ca6O3Sws/uRWWvm', NULL, NULL, NULL, NULL, 'ADMIN'),
(75, '0', '123.456.789-68', '2025-10-16', 'maria1760668459105@teste.com', NULL, 'teste manual', 'Maria Silva 1760668459105', '$2a$10$t9guj229EVEKPqeD9tCBSeQY0Y7UVQj9.TKExhWOA/iPAdizc4RD6', '(11) 99999-9999', 'FEMININO', '1990-05-10', 'celular', 'CLIENTE'),
(83, '1', '555.555.555-55', '2025-10-17', 'andressa@gmail.com', NULL, NULL, 'Andressa ', '$2a$10$xdEclVskT8Av4igEe.DQ9.rw4ldSVKctSXqRBhiJy9yY6Sb86DAM.', '(11) 9777-7000', 'FEMININO', '2005-03-09', 'fixo', 'CLIENTE'),
(84, '1', '123.456.789-09', '2025-10-17', 'maria1760681467614@teste.com', 'Reativação Cypress', NULL, 'Maria da Silva', '$2a$10$3iBUysLoO8xvdHCP7Srlv.aZhFpaCgqtr4T/bUTTXJB21cOiqtnMO', '(11) 99999-9999', 'FEMININO', '1990-05-10', 'celular', 'CLIENTE');

-- --------------------------------------------------------

--
-- Estrutura da tabela `endereco`
--

CREATE TABLE IF NOT EXISTS `endereco` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `bairro` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cep` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cidade` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complemento` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rua` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo` enum('COBRANCA','ENTREGA') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cliente_id` bigint(20) DEFAULT NULL,
  `logradouro` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pais` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_logradouro` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipo_residencia` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nome_endereco` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_endereco_cliente` (`cliente_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=498 ;

--
-- Extraindo dados da tabela `endereco`
--

INSERT INTO `endereco` (`id`, `bairro`, `cep`, `cidade`, `complemento`, `estado`, `numero`, `rua`, `tipo`, `cliente_id`, `logradouro`, `pais`, `tipo_logradouro`, `tipo_residencia`, `nome_endereco`) VALUES
(398, 'Rodeio', '08775639', 'Mogi das Cruzes', '22', 'SP', '22', 'Professor Jurandyr de Oliveira', 'COBRANCA', 39, 'Dos anges', 'Brasil', 'Avenida', 'Casa', NULL),
(399, 'bairro', '11111111', 'Mogi das Cruzes', '22', 'SP', '22', 'Professor Jurandyr de Oliveira', 'ENTREGA', 39, 'dos anges', 'Brasil', 'Avenida', 'Casa', 'Minha Casa'),
(475, 'Centro', '01001-000', 'São Paulo', NULL, 'SP', '123', 'Rua Teste', 'COBRANCA', 75, 'Paulista', 'Brasil', 'Rua', 'Apartamento', NULL),
(476, 'Centro', '01001-000', 'São Paulo', '', 'SP', '123', 'Rua Teste', 'ENTREGA', 75, 'Paulista', 'Brasil', 'Rua', 'Apartamento', 'Endereço #1'),
(491, 'teste', '22222-222', 'teste', NULL, 'MG', '222', 'teste', 'COBRANCA', 83, 'teste', 'Brasil', 'teste', 'casa', NULL),
(492, 'teste', '22222222', 'teste', 'teste', 'MG', '222', 'teste', 'ENTREGA', 83, 'teste', 'Brasil', 'teste', 'teste', 'Endereço #1'),
(493, 'Centro', '01001-000', 'São Paulo', NULL, 'SP', '123', 'Rua Teste', 'COBRANCA', 84, 'Paulista', 'Brasil', 'Rua', 'Apartamento', NULL),
(494, 'Centro', '01001-000', 'São Paulo', '', 'SP', '123', 'Rua Teste', 'ENTREGA', 84, 'Paulista', 'Brasil', 'Rua', 'Apartamento', 'Endereço #1');

-- --------------------------------------------------------

--
-- Estrutura da tabela `itens_pedido`
--

CREATE TABLE IF NOT EXISTS `itens_pedido` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint(20) NOT NULL,
  `livro_id` bigint(20) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `quantidade_devolucao` int(11) NOT NULL,
  `status` enum('CANCELADO','DEVOLUCAO','DEVOLVIDO','EM_PROCESSAMENTO','EM_TRANSITO','ENTREGUE','TROCADO') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK42mycompce3b7yt3l6ukdwsxy` (`pedido_id`),
  KEY `FK66bgjrjsk3v6526p446u2q7ct` (`livro_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=299 ;

--
-- Extraindo dados da tabela `itens_pedido`
--

INSERT INTO `itens_pedido` (`id`, `pedido_id`, `livro_id`, `quantidade`, `preco_unitario`, `quantidade_devolucao`, `status`) VALUES
(237, 184, 21, 1, 70.00, 0, 'EM_PROCESSAMENTO'),
(238, 184, 22, 1, 66.00, 0, 'EM_PROCESSAMENTO'),
(239, 184, 23, 1, 55.00, 0, 'EM_PROCESSAMENTO'),
(240, 184, 27, 1, 41.80, 0, 'EM_PROCESSAMENTO'),
(241, 184, 25, 1, 30.80, 0, 'EM_PROCESSAMENTO'),
(242, 184, 24, 1, 38.50, 0, 'EM_PROCESSAMENTO'),
(243, 185, 21, 1, 70.00, 0, 'EM_PROCESSAMENTO'),
(244, 185, 24, 1, 38.50, 0, 'EM_PROCESSAMENTO'),
(245, 185, 25, 1, 30.80, 0, 'EM_PROCESSAMENTO'),
(265, 194, 23, 1, 55.00, 0, 'EM_PROCESSAMENTO'),
(266, 195, 24, 1, 38.50, 0, 'EM_PROCESSAMENTO'),
(268, 197, 21, 1, 70.00, 0, 'EM_PROCESSAMENTO'),
(272, 201, 21, 1, 44.00, 0, 'EM_PROCESSAMENTO'),
(274, 203, 27, 3, 41.80, 0, 'EM_PROCESSAMENTO'),
(276, 205, 27, 2, 41.80, 0, 'EM_PROCESSAMENTO'),
(278, 207, 27, 2, 41.80, 0, 'EM_PROCESSAMENTO'),
(281, 210, 21, 1, 44.00, 0, 'EM_PROCESSAMENTO'),
(286, 215, 29, 2, 41.80, 0, 'EM_PROCESSAMENTO'),
(289, 218, 20, 4, 27.50, 0, 'EM_PROCESSAMENTO'),
(292, 221, 23, 1, 55.00, 0, 'EM_PROCESSAMENTO'),
(294, 223, 24, 1, 38.50, 0, 'EM_PROCESSAMENTO'),
(296, 225, 20, 3, 27.50, 0, 'EM_PROCESSAMENTO');

-- --------------------------------------------------------

--
-- Estrutura da tabela `livros`
--

CREATE TABLE IF NOT EXISTS `livros` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ativo` bit(1) NOT NULL,
  `autor` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_entrada` date DEFAULT NULL,
  `editora` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estoque` int(11) DEFAULT NULL,
  `motivo_ativacao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `motivo_inativacao` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preco_custo` decimal(38,2) NOT NULL,
  `preco_venda` decimal(38,2) DEFAULT NULL,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `altura` double DEFAULT NULL,
  `codigo_barras` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `edicao` int(11) NOT NULL,
  `isbn` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `largura` double DEFAULT NULL,
  `paginas` int(11) DEFAULT NULL,
  `peso` double DEFAULT NULL,
  `profundidade` double DEFAULT NULL,
  `sinopse` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `imagem_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30 ;

--
-- Extraindo dados da tabela `livros`
--

INSERT INTO `livros` (`id`, `ativo`, `autor`, `categoria`, `data_entrada`, `editora`, `estoque`, `motivo_ativacao`, `motivo_inativacao`, `preco_custo`, `preco_venda`, `titulo`, `altura`, `codigo_barras`, `edicao`, `isbn`, `largura`, `paginas`, `peso`, `profundidade`, `sinopse`, `imagem_url`) VALUES
(20, '1', 'Jane Austen', 'Romance', '2025-10-22', 'Penguin Classics', 9, NULL, NULL, 25.00, 27.50, 'Orgulho e Preconceito', 21, '9780141439518', 1, '9780141439518', 14, 432, 0.5, 2.5, 'Clássico romance inglês que explora as tensões sociais e amorosas da época.', 'e825a72e-a6f1-4b26-aa67-3a44c17b030c.jpg'),
(21, '1', 'Stephen King', 'Terror', '2025-10-22', 'Suma de Letras', 1, 'Estoque reposto, produto reativado.', NULL, 40.00, 44.00, 'O Iluminado', 23, '9788501400780', 1, '9788501400780', 15, 688, 0.7, 3, 'Um dos maiores clássicos do terror, explorando a loucura em um hotel isolado.', 'https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg'),
(22, '1', 'Alan Moore', 'Quadrinhos', '2025-10-22', 'Devir', 1, NULL, NULL, 60.00, 66.00, 'Watchmen', 27, '9788535914843', 1, '9788535914843', 18, 416, 0.8, 2.5, 'História em quadrinhos icônica que redefine o conceito de super-herói.', 'd3f99ab5-c2a7-4bf2-b872-189553f30d9b.jpg'),
(23, '1', 'Frank Herbert', 'Ficção Científica', '2025-10-22', 'Aleph', 1, NULL, NULL, 50.00, 55.00, 'Duna', 24, '9780441172719', 1, '9780441172719', 16, 896, 0.9, 3, 'Clássico da ficção científica que explora política, religião e ecologia em um planeta desértico.', '86e44938-7ec4-40fc-aa96-8e5a0b6fcf44.jpg'),
(24, '1', 'Nicholas Sparks', 'Romance', '2025-10-23', 'Arqueiro', 1, NULL, NULL, 35.00, 38.50, 'Diário de uma Paixão', 21, '9788580411340', 1, '9788580411340', 14, 240, 0.45, 2.5, 'Uma história de amor atemporal sobre memórias, destino e segundas chances.', '197feaec-12a6-48a3-8be0-f805f5e36508.png'),
(25, '1', 'H.P. Lovecraft', 'Terror', '2025-10-23', 'Pandorga', 2, NULL, NULL, 28.00, 30.80, 'O Chamado de Cthulhu', 22, '9788592783334', 1, '9788592783334', 15, 192, 0.4, 2.3, 'História sombria e cósmica sobre entidades antigas e o medo do desconhecido.', '0b1697eb-155c-468d-918b-29eb2863376e.webp'),
(26, '0', 'Shirley Jackson', 'Terror', '2025-10-23', 'Suma', 4, NULL, 'Houve um problema no estoque', 32.00, 35.20, 'A Assombração da Casa da Colina', 21, '9788556510758', 1, '9788556510758', 14, 240, 0.5, 2.5, 'Um dos maiores clássicos do terror psicológico, sobre uma casa que parece viva.', '59f4529f-55c9-4264-b363-81c142f68465.jpg'),
(27, '0', 'Clarice Lispector', 'Romance', '2025-10-23', 'Rocco', 0, NULL, 'Estoque zerado.', 38.00, 41.80, 'A Hora da Estrela', 20, '9788532529781', 1, '9788532529781', 13, 96, 0.3, 2, 'Romance profundo sobre a vida, a solidão e a busca por sentido, narrado com sensibilidade única.', '268a02ff-8b47-4ff7-ae91-ff0164404632.webp'),
(29, '1', 'Stephen King', 'Romance', '2025-10-24', 'Devir', 1, NULL, NULL, 38.00, 41.80, 'Strogonoff', 20, '9788532', 1, '9788532', 13, 96, 0.3, 2, 'gnhdgdgh', '6fff8c26-3049-4896-9689-a2dfd0a3ce8a.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `logs`
--

CREATE TABLE IF NOT EXISTS `logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) DEFAULT NULL,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=635 ;

--
-- Extraindo dados da tabela `logs`
--

INSERT INTO `logs` (`id`, `user_id`, `user_name`, `action`, `details`, `level`, `timestamp`) VALUES
(211, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 207.95', 'success', '2025-08-04 11:49:48'),
(212, 41, 'Lana del rey', 'exclusao', 'Cliente excluído', 'info', '2025-08-04 12:17:16'),
(213, 53, 'Amin', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-04 12:18:26'),
(214, 53, 'Amin', 'login', 'Cliente logado com sucesso', 'success', '2025-08-04 12:18:39'),
(215, 53, 'Admin', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-04 12:18:46'),
(216, 53, 'Admin', 'exclusao', 'Cliente excluído', 'info', '2025-08-04 12:25:53'),
(217, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-04 12:36:47'),
(218, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-04 12:42:43'),
(219, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-04 12:47:08'),
(220, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-04 13:06:54'),
(221, 55, 'Amin', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-04 13:07:59'),
(222, 56, 'Nome', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-04 13:11:48'),
(223, 55, 'Amin', 'exclusao', 'Cliente excluído', 'info', '2025-08-04 13:12:06'),
(224, 51, 'Mona Lisa', 'exclusao', 'Cliente excluído', 'info', '2025-08-04 13:12:20'),
(225, 56, 'Nome', 'login', 'Cliente logado com sucesso', 'success', '2025-08-04 13:12:25'),
(226, 57, 'Nome', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-04 13:22:54'),
(227, 57, 'Nome', 'login', 'Cliente logado com sucesso', 'success', '2025-08-04 13:23:03'),
(228, 57, 'Nome', 'login', 'Cliente logado com sucesso', 'success', '2025-08-04 13:34:38'),
(229, 57, 'Nome', 'compra', 'Compra realizada no valor de R$ 113.45', 'success', '2025-08-04 13:46:16'),
(230, 57, 'Nome', 'compra', 'Compra realizada no valor de R$ 113.45', 'success', '2025-08-04 13:52:15'),
(231, 57, 'Nome', 'transito', 'Status do pedido #152 atualizado para: EM_TRANSITO', 'info', '2025-08-04 13:52:22'),
(232, 57, 'Nome', 'entregue', 'Status do pedido #152 atualizado para: ENTREGUE', 'info', '2025-08-04 13:52:25'),
(233, 57, 'Nome', 'devolucao', 'Status do pedido #152 atualizado para: DEVOLUCAO', 'info', '2025-08-04 13:52:35'),
(234, 57, 'Nome', 'devolvido', 'Status do pedido #152 atualizado para: DEVOLVIDO', 'info', '2025-08-04 13:52:38'),
(235, 57, 'Nome', 'trocado', 'Status do pedido #152 atualizado para: TROCADO', 'info', '2025-08-04 13:52:56'),
(236, 57, 'Nome', 'compra', 'Compra realizada no valor de R$ 18.95', 'success', '2025-08-04 13:53:25'),
(237, 58, 'Nome', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-04 13:56:20'),
(238, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 07:51:19'),
(239, 59, 'Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-05 07:54:00'),
(240, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 07:55:16'),
(241, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 07:59:22'),
(242, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 08:01:29'),
(243, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 08:04:06'),
(244, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 08:53:36'),
(245, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 08:58:29'),
(246, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:05:26'),
(247, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 195.45', 'success', '2025-08-05 09:05:43'),
(248, 39, 'Lucia Meneguel', 'transito', 'Status do pedido #154 atualizado para: EM_TRANSITO', 'info', '2025-08-05 09:06:07'),
(249, 39, 'Lucia Meneguel', 'entregue', 'Status do pedido #154 atualizado para: ENTREGUE', 'info', '2025-08-05 09:06:08'),
(250, 56, 'Nome', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:06:45'),
(251, 56, 'Nome', 'compra', 'Compra realizada no valor de R$ 150.95', 'success', '2025-08-05 09:07:03'),
(252, 56, 'Nome', 'transito', 'Status do pedido #155 atualizado para: EM_TRANSITO', 'info', '2025-08-05 09:07:09'),
(253, 56, 'Nome', 'entregue', 'Status do pedido #155 atualizado para: ENTREGUE', 'info', '2025-08-05 09:07:11'),
(254, 56, 'Nome', 'devolucao', 'Status do pedido #155 atualizado para: DEVOLUCAO', 'info', '2025-08-05 09:07:22'),
(255, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:07:45'),
(256, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:11:26'),
(257, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:11:59'),
(258, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:12:11'),
(259, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:13:40'),
(260, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:15:42'),
(261, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:21:52'),
(262, 56, 'Nome', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:22:47'),
(263, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:23:11'),
(264, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:44:40'),
(265, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:46:55'),
(266, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:52:52'),
(267, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 09:57:29'),
(268, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 10:14:34'),
(269, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 10:15:06'),
(270, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 10:25:17'),
(271, 39, 'Lucia Meneguel', 'devolucao', 'Status do pedido #154 atualizado para: DEVOLUCAO', 'info', '2025-08-05 10:25:32'),
(272, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 10:26:06'),
(273, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 10:26:34'),
(274, 39, 'Lucia Meneguel', 'transito', 'Status do pedido #150 atualizado para: EM_TRANSITO', 'info', '2025-08-05 10:26:42'),
(275, 39, 'Lucia Meneguel', 'entregue', 'Status do pedido #150 atualizado para: ENTREGUE', 'info', '2025-08-05 10:26:43'),
(276, 39, 'Lucia Meneguel', 'devolucao', 'Status do pedido #150 atualizado para: DEVOLUCAO', 'info', '2025-08-05 10:28:52'),
(277, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 10:30:56'),
(278, 57, 'Nome', 'transito', 'Status do pedido #151 atualizado para: EM_TRANSITO', 'info', '2025-08-05 10:31:09'),
(279, 57, 'Nome', 'entregue', 'Status do pedido #151 atualizado para: ENTREGUE', 'info', '2025-08-05 10:31:46'),
(280, 39, 'Lucia Meneguel', 'devolvido', 'Status do pedido #150 atualizado para: DEVOLVIDO', 'info', '2025-08-05 10:33:54'),
(281, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 10:34:48'),
(282, 39, 'Lucia Meneguel', 'trocado', 'Status do pedido #150 atualizado para: TROCADO', 'info', '2025-08-05 10:37:14'),
(283, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 10:37:37'),
(284, 57, 'Nome', 'transito', 'Status do pedido #153 atualizado para: EM_TRANSITO', 'info', '2025-08-05 10:40:56'),
(285, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 10:43:12'),
(286, 57, 'Nome', 'entregue', 'Status do pedido #153 atualizado para: ENTREGUE', 'info', '2025-08-05 10:43:21'),
(287, 56, 'Nome', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 10:52:32'),
(288, 56, 'Nome', 'compra', 'Compra realizada no valor de R$ 113.45', 'success', '2025-08-05 10:52:50'),
(289, 56, 'Nome', 'cancelado', 'Status do pedido #156 atualizado para: CANCELADO', 'info', '2025-08-05 10:52:57'),
(290, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 10:56:48'),
(291, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 11:01:30'),
(292, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 11:03:53'),
(293, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 252.45', 'success', '2025-08-05 11:04:10'),
(294, 39, 'Lucia Meneguel', 'transito', 'Status do pedido #157 atualizado para: EM_TRANSITO', 'info', '2025-08-05 11:04:29'),
(295, 39, 'Lucia Meneguel', 'entregue', 'Status do pedido #157 atualizado para: ENTREGUE', 'info', '2025-08-05 11:04:54'),
(296, 39, 'Lucia Meneguel', 'devolucao', 'Status do pedido #157 atualizado para: DEVOLUCAO', 'info', '2025-08-05 11:05:38'),
(297, 39, 'Lucia Meneguel', 'devolvido', 'Status do pedido #157 atualizado para: DEVOLVIDO', 'info', '2025-08-05 11:05:53'),
(298, 39, 'Lucia Meneguel', 'trocado', 'Status do pedido #157 atualizado para: TROCADO', 'info', '2025-08-05 11:06:06'),
(299, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 11:07:58'),
(300, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 11:10:41'),
(301, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 11:11:01'),
(302, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 11:12:53'),
(303, 39, 'Lucia Meneguel', 'devolvido', 'Status do pedido #154 atualizado para: DEVOLVIDO', 'info', '2025-08-05 11:15:21'),
(304, 39, 'Lucia Meneguel', 'trocado', 'Status do pedido #154 atualizado para: TROCADO', 'info', '2025-08-05 11:16:07'),
(305, 56, 'Nome', 'devolvido', 'Status do pedido #155 atualizado para: DEVOLVIDO', 'info', '2025-08-05 11:19:37'),
(306, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 11:46:07'),
(307, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 350.00', 'success', '2025-08-05 11:47:14'),
(308, 39, 'Lucia Meneguel', 'transito', 'Status do pedido #158 atualizado para: EM_TRANSITO', 'info', '2025-08-05 11:47:20'),
(309, 39, 'Lucia Meneguel', 'entregue', 'Status do pedido #158 atualizado para: ENTREGUE', 'info', '2025-08-05 11:47:26'),
(310, 39, 'Lucia Meneguel', 'devolucao', 'Status do pedido #158 atualizado para: DEVOLUCAO', 'info', '2025-08-05 11:47:31'),
(311, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 11:47:49'),
(312, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 11:51:20'),
(313, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 350.00', 'success', '2025-08-05 11:51:36'),
(314, 39, 'Lucia Meneguel', 'transito', 'Status do pedido #159 atualizado para: EM_TRANSITO', 'info', '2025-08-05 11:51:38'),
(315, 39, 'Lucia Meneguel', 'entregue', 'Status do pedido #159 atualizado para: ENTREGUE', 'info', '2025-08-05 11:51:39'),
(316, 39, 'Lucia Meneguel', 'devolucao', 'Status do pedido #159 atualizado para: DEVOLUCAO', 'info', '2025-08-05 11:51:42'),
(317, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 11:52:04'),
(318, 39, 'Lucia Meneguel', 'devolvido', 'Status do pedido #158 atualizado para: DEVOLVIDO', 'info', '2025-08-05 11:58:18'),
(319, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 12:07:00'),
(320, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 113.45', 'success', '2025-08-05 12:07:15'),
(321, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 12:07:42'),
(322, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 12:30:27'),
(323, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 113.45', 'success', '2025-08-05 12:30:47'),
(324, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 12:31:05'),
(325, 39, 'Lucia Meneguel', 'transito', 'Status do pedido #160 atualizado para: EM_TRANSITO', 'info', '2025-08-05 12:54:49'),
(326, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 12:56:15'),
(327, 39, 'Lucia Meneguel', 'entregue', 'Status do pedido #160 atualizado para: ENTREGUE', 'info', '2025-08-05 12:56:26'),
(328, 39, 'Lucia Meneguel', 'devolucao', 'Status do pedido #160 atualizado para: DEVOLUCAO', 'info', '2025-08-05 12:56:32'),
(329, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 12:57:02'),
(330, 39, 'Lucia Meneguel', 'devolvido', 'Status do pedido #159 atualizado para: DEVOLVIDO', 'info', '2025-08-05 12:57:17'),
(331, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 12:57:40'),
(332, 39, 'Lucia Meneguel', 'trocado', 'Status do pedido #159 atualizado para: TROCADO', 'info', '2025-08-05 12:57:49'),
(333, 39, 'Lucia Meneguel', 'trocado', 'Status do pedido #158 atualizado para: TROCADO', 'info', '2025-08-05 12:57:52'),
(334, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 12:58:17'),
(335, 57, 'Nome', 'exclusao', 'Cliente excluído', 'info', '2025-08-05 12:58:57'),
(336, 58, 'Nome', 'exclusao', 'Cliente excluído', 'info', '2025-08-05 12:59:02'),
(337, 39, 'Lucia Meneguel', 'transito', 'Status do pedido #161 atualizado para: EM_TRANSITO', 'info', '2025-08-05 13:01:36'),
(338, 39, 'Lucia Meneguel', 'devolvido', 'Status do pedido #160 atualizado para: DEVOLVIDO', 'info', '2025-08-05 13:03:00'),
(339, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 13:03:15'),
(340, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 113.45', 'success', '2025-08-05 13:03:27'),
(341, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 20.20', 'success', '2025-08-05 13:03:40'),
(342, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 56.45', 'success', '2025-08-05 13:04:05'),
(343, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 51.95', 'success', '2025-08-05 13:04:22'),
(344, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 13:05:35'),
(345, 39, 'Lucia Meneguel', 'transito', 'Status do pedido #162 atualizado para: EM_TRANSITO', 'info', '2025-08-05 13:07:32'),
(346, 39, 'Lucia Meneguel', 'transito', 'Status do pedido #163 atualizado para: EM_TRANSITO', 'info', '2025-08-05 13:07:40'),
(347, 39, 'Lucia Meneguel', 'transito', 'Status do pedido #164 atualizado para: EM_TRANSITO', 'info', '2025-08-05 13:43:28'),
(348, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-05 13:51:53'),
(349, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 113.45', 'success', '2025-08-05 13:55:14'),
(350, 39, 'Lucia Meneguel', 'entregue', 'Status do pedido #164 atualizado para: ENTREGUE', 'info', '2025-08-05 13:55:24'),
(351, 39, 'Lucia Meneguel', 'entregue', 'Status do pedido #163 atualizado para: ENTREGUE', 'info', '2025-08-05 13:56:06'),
(352, 39, 'Lucia Meneguel', 'entregue', 'Status do pedido #162 atualizado para: ENTREGUE', 'info', '2025-08-05 13:56:08'),
(353, 39, 'Lucia Meneguel', 'devolucao', 'Status do pedido #164 atualizado para: DEVOLUCAO', 'info', '2025-08-05 13:56:20'),
(354, 39, 'Lucia Meneguel', 'trocado', 'Status do pedido #160 atualizado para: TROCADO', 'info', '2025-08-05 13:56:26'),
(355, 39, 'Lucia Meneguel', 'cancelado', 'Status do pedido #166 atualizado para: CANCELADO', 'info', '2025-08-05 13:56:33'),
(356, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-06 08:10:46'),
(357, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-06 08:24:24'),
(358, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-06 08:37:47'),
(359, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 10:49:41'),
(360, 39, 'Lucia Meneguel Hanna', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-07 10:50:05'),
(361, 39, 'Lucia Meneguel', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-07 10:50:50'),
(362, 60, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 10:51:08'),
(363, 60, 'Mana Hanna', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 10:51:59'),
(364, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 10:54:20'),
(365, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 11:04:51'),
(366, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 11:05:06'),
(367, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 11:12:00'),
(368, 61, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 11:12:39'),
(369, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 11:15:49'),
(370, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 11:22:09'),
(371, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 302.45', 'success', '2025-08-07 11:33:24'),
(372, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 11:33:38'),
(373, 61, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-07 11:33:49'),
(374, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 11:34:57'),
(375, 39, 'Lucia Meneguel Hanna', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-07 11:36:05'),
(376, 39, 'Lucia Meneguel ', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-07 11:40:59'),
(377, 39, 'Lucia Meneguel Hanna', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-07 11:43:51'),
(378, 62, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 11:44:53'),
(379, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 11:59:55'),
(380, 39, 'Lucia Meneguel Hanna', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 12:10:34'),
(381, 39, 'Lucia Meneguel', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-07 12:10:40'),
(382, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 12:14:42'),
(383, 63, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 12:16:01'),
(384, 64, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 12:25:04'),
(385, 65, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 12:30:48'),
(386, 66, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 12:34:21'),
(387, 67, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 12:36:27'),
(388, 68, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 12:37:06'),
(389, 68, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-07 12:37:24'),
(390, 67, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-07 12:37:26'),
(391, 66, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-07 12:37:28'),
(392, 65, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-07 12:37:30'),
(393, 64, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-07 12:37:35'),
(394, 63, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-07 12:37:37'),
(395, 62, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-07 12:37:39'),
(396, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 12:37:53'),
(397, 69, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 12:38:32'),
(398, 39, 'Lucia Meneguel Hanna', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-07 12:38:40'),
(399, 39, 'Lucia Meneguel', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-07 12:38:44'),
(400, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 13:24:53'),
(401, 70, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 13:29:23'),
(402, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 13:33:07'),
(403, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 114.70', 'success', '2025-08-07 13:33:25'),
(404, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 13:33:52'),
(405, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 13:36:17'),
(406, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 13:36:46'),
(407, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 13:37:17'),
(408, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 13:39:42'),
(409, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 56.45', 'success', '2025-08-07 13:40:10'),
(410, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 13:40:28'),
(411, 39, 'Lucia Meneguel', 'atualizar_status', 'Status do pedido #169 alterado para EM_TRANSITO', 'info', '2025-08-07 13:43:28'),
(412, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 13:45:59'),
(413, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 120.95', 'success', '2025-08-07 13:46:22'),
(414, 39, 'Lucia Meneguel', 'ENTREGUE', 'Status do pedido #169 alterado para ENTREGUE', 'info', '2025-08-07 13:46:26'),
(415, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 13:46:44'),
(416, 39, 'Lucia Meneguel', 'Em Trânsito', 'Status do pedido #170 alterado para EM_TRANSITO', 'info', '2025-08-07 13:49:21'),
(417, 70, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-07 13:55:46'),
(418, 69, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-07 13:55:48'),
(419, 60, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-07 13:55:51'),
(420, 71, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-07 13:57:09'),
(421, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 14:10:36'),
(422, 39, 'Lucia Meneguel', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-07 14:12:26'),
(423, 39, 'Lucia Meneguel', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-07 14:12:42'),
(424, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 619.00', 'success', '2025-08-07 14:14:58'),
(425, 56, 'Nome', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 14:15:35'),
(426, 56, 'Nome', 'compra', 'Compra realizada no valor de R$ 56.45', 'success', '2025-08-07 14:16:06'),
(427, 56, 'Nome', 'Cancelado', 'Status do pedido #172 alterado para CANCELADO', 'info', '2025-08-07 14:16:10'),
(428, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 14:16:39'),
(429, 71, 'Mana Hanna', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 14:17:05'),
(430, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-07 14:18:25'),
(431, 39, 'Lucia Meneguel Silva', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-07 15:00:44'),
(432, 39, 'Lucia Meneguel Silva', 'ENTREGUE', 'Status do pedido #170 alterado para ENTREGUE', 'info', '2025-08-08 11:19:37'),
(433, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-08 11:20:14'),
(434, 39, 'Lucia Meneguel Silva', 'Em Trânsito', 'Status do pedido #171 alterado para EM_TRANSITO', 'info', '2025-08-08 11:22:54'),
(435, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-08-08 11:29:13'),
(436, 39, 'Lucia Meneguel Silva', 'compra', 'Compra realizada no valor de R$ 1125.00', 'success', '2025-08-08 11:29:55'),
(437, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-08 11:30:11'),
(438, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-08-08 11:33:20'),
(439, 39, 'Lucia Meneguel Silva', 'ENTREGUE', 'Status do pedido #171 alterado para ENTREGUE', 'info', '2025-08-08 11:33:34'),
(440, 39, 'Lucia Meneguel', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-08 11:33:45'),
(441, 39, 'Lucia Meneguel', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-08 14:56:54'),
(442, 72, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-08 14:57:42'),
(443, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-08 14:58:01'),
(444, 72, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-08 14:58:22'),
(445, 71, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-08 14:58:27'),
(446, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-08 15:02:05'),
(447, 39, 'Lucia Meneguel', 'Em Devolução', 'Status do pedido #171 alterado para DEVOLUCAO', 'info', '2025-08-08 15:03:22'),
(448, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-08 15:04:42'),
(449, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-08-08 15:30:54'),
(450, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 150.95', 'success', '2025-08-08 15:31:33'),
(451, 39, 'Lucia Meneguel SIlva', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-08 15:33:41'),
(452, 39, 'Lucia Meneguel SIlva', 'Cancelado', 'Status do pedido #174 alterado para CANCELADO', 'info', '2025-08-08 15:34:01'),
(453, 39, 'Lucia Meneguel SIlva', 'Em Devolução', 'Status do pedido #170 alterado para DEVOLUCAO', 'info', '2025-08-08 15:34:05'),
(454, 39, 'Lucia Meneguel SIlva', 'compra', 'Compra realizada no valor de R$ 18.95', 'success', '2025-08-08 15:34:39'),
(455, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-11 11:41:24'),
(456, 39, 'Lucia Meneguel SIlva', 'Em Trânsito', 'Status do pedido #175 alterado para EM_TRANSITO', 'info', '2025-08-11 11:41:32'),
(457, 39, 'Lucia Meneguel SIlva', 'Em Trânsito', 'Status do pedido #173 alterado para EM_TRANSITO', 'info', '2025-08-11 11:41:34'),
(458, 39, 'Lucia Meneguel SIlva', 'login', 'Cliente logado com sucesso', 'success', '2025-08-11 11:41:59'),
(459, 39, 'Lucia Meneguel SIlva', 'ENTREGUE', 'Status do pedido #175 alterado para ENTREGUE', 'info', '2025-08-11 11:42:16'),
(460, 39, 'Lucia Meneguel SIlva', 'ENTREGUE', 'Status do pedido #173 alterado para ENTREGUE', 'info', '2025-08-11 11:42:16'),
(461, 39, 'Lucia Meneguel ', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-11 12:29:08'),
(462, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-11 12:38:23'),
(463, 39, 'Lucia Meneguel ', 'login', 'Cliente logado com sucesso', 'success', '2025-08-11 12:38:48'),
(464, 39, 'Lucia Meneguel ', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-08-11 14:32:38'),
(465, 73, 'Mana Hanna', 'cadastro', 'Cliente cadastrado', 'success', '2025-08-11 14:33:48'),
(466, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-11 14:34:04'),
(467, 56, 'Nome', 'exclusao', 'Cliente excluído', 'info', '2025-08-11 14:34:54'),
(468, 73, 'Mana Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-08-11 14:34:56'),
(469, 39, 'Lucia Meneguel ', 'login', 'Cliente logado com sucesso', 'success', '2025-08-11 14:35:14'),
(470, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-11 14:38:31'),
(471, 74, 'Maria Silva 1760668415119', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 02:33:49'),
(472, 74, 'Maria Silva 1760668415119', 'exclusao', 'Cliente excluído', 'info', '2025-10-17 02:33:56'),
(473, 75, 'Maria Silva 1760668459105', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 02:34:29'),
(474, 76, 'Maria Silva 1760668499949', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 02:35:10'),
(475, 76, 'Maria Silva 1760668499949', 'exclusao', 'Cliente excluído', 'info', '2025-10-17 02:35:17'),
(476, 77, 'Maria da Silva', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 02:42:48'),
(477, 78, 'Maria Silva 1760670291180', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 03:05:01'),
(478, 78, 'Maria Silva 1760670291180', 'exclusao', 'Cliente excluído', 'info', '2025-10-17 03:05:05'),
(479, 79, 'Maria Silva 1760670389928', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 03:06:40'),
(480, 79, 'Maria Silva 1760670389928', 'exclusao', 'Cliente excluído', 'info', '2025-10-17 03:06:43'),
(481, 80, 'Maria Silva 1760670533338', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 03:09:06'),
(482, 80, 'Maria Silva 1760670533338', 'exclusao', 'Cliente excluído', 'info', '2025-10-17 03:09:10'),
(483, 81, 'Maria Silva 1760670573804', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 03:09:46'),
(484, 81, 'Maria Silva 1760670573804', 'exclusao', 'Cliente excluído', 'info', '2025-10-17 03:09:49'),
(485, 82, 'Maria Silva 1760670636929', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 03:10:46'),
(486, 82, 'Maria Silva 1760670636929', 'exclusao', 'Cliente excluído', 'info', '2025-10-17 03:10:50'),
(487, 83, 'andressa', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 03:24:30'),
(488, 83, 'andressa', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 03:24:54'),
(489, 83, 'andressa', 'compra', 'Compra realizada no valor de R$ 114.25', 'success', '2025-10-17 03:27:27'),
(490, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 03:31:11'),
(491, 83, 'andressa', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 05:51:28'),
(492, 83, 'andressa', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 05:51:50'),
(493, 83, 'andressa', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 05:52:06'),
(494, 83, 'Administrador Teste 1760680323767', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-10-17 05:52:24'),
(495, 83, 'Administrador Teste 1760680323767', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 05:53:36'),
(496, 83, 'Administrador Teste 1760680323767', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 05:55:27'),
(497, 83, 'Andressa Teste 1760680525428', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-10-17 05:55:39'),
(498, 83, 'Andressa Teste 1760680525428', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 05:57:58'),
(499, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 05:58:45'),
(500, 83, 'Andressa ', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-10-17 06:00:06'),
(501, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 06:04:36'),
(502, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 06:05:44'),
(503, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 06:08:31'),
(504, 83, 'Andressa ', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-10-17 06:08:40'),
(505, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 06:10:16'),
(506, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 06:10:40'),
(507, 84, 'Maria da Silva', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 06:11:19'),
(508, 77, 'Maria da Silva', 'exclusao', 'Cliente excluído', 'info', '2025-10-17 06:18:07'),
(509, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 06:20:01'),
(510, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 11:09:03'),
(511, 85, 'Maria Silva 1760699448860', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-17 11:11:10'),
(512, 85, 'Maria Silva 1760699448860', 'exclusao', 'Cliente excluído', 'info', '2025-10-17 11:11:17'),
(513, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 11:44:35'),
(514, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 11:47:37'),
(515, 83, 'Andressa ', 'compra', 'Compra realizada no valor de R$ 196.25', 'success', '2025-10-17 11:53:13'),
(516, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 12:25:14'),
(517, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 12:44:10'),
(518, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 12:48:12'),
(519, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 12:51:12'),
(520, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-17 12:52:17'),
(521, 86, 'Maria Silva 1760906967958', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-19 20:49:43'),
(522, 86, 'Maria Silva 1760906967958', 'exclusao', 'Cliente excluído', 'info', '2025-10-19 20:49:50'),
(523, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 20:51:04'),
(524, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 20:55:51'),
(525, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:00:35'),
(526, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:01:53'),
(527, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:08:58'),
(528, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:10:56'),
(529, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:20:20'),
(530, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:23:49'),
(531, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:33:44'),
(532, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:39:11'),
(533, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:42:14'),
(534, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:55:07'),
(535, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:55:57'),
(536, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:58:11'),
(537, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 21:58:21'),
(538, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 22:18:49'),
(539, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 22:23:42'),
(540, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 22:32:02'),
(541, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 22:34:06'),
(542, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 22:53:18'),
(543, 83, 'Andressa ', 'compra', 'Compra realizada no valor de R$ 196.25', 'success', '2025-10-19 22:53:32'),
(544, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 22:56:28'),
(545, 83, 'Andressa ', 'compra', 'Compra realizada no valor de R$ 196.25', 'success', '2025-10-19 22:56:40'),
(546, 83, 'Andressa ', 'Cancelado', 'Status do pedido #178 alterado para CANCELADO', 'info', '2025-10-19 23:00:08'),
(547, 87, 'Maria Silva 1760915068463', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-19 23:04:41'),
(548, 87, 'Maria Silva 1760915068463', 'exclusao', 'Cliente excluído', 'info', '2025-10-19 23:04:45'),
(549, 83, 'Andressa ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-19 23:05:00'),
(550, 83, 'Andressa ', 'compra', 'Compra realizada no valor de R$ 196.25', 'success', '2025-10-19 23:05:18'),
(551, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-22 14:33:07'),
(552, 39, 'Lucia Meneguel ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-22 14:33:32'),
(553, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-22 14:34:34'),
(554, 39, 'Lucia Meneguel ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-22 14:35:11'),
(555, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-22 14:35:27'),
(556, 39, 'Lucia Meneguel ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-22 14:35:46'),
(557, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-22 14:40:59'),
(558, 59, 'Hanna', 'exclusao', 'Cliente excluído', 'info', '2025-10-22 15:14:40'),
(559, 39, 'Lucia Meneguel ', 'login', 'Cliente logado com sucesso', 'success', '2025-10-22 16:00:05'),
(560, 39, 'Lucia Meneguel ', 'compra', 'Compra realizada no valor de R$ 172.95', 'success', '2025-10-22 16:01:05'),
(561, 39, 'Lucia Meneguel Silva', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-10-22 16:01:20'),
(562, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-23 11:35:35'),
(563, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-23 11:36:27'),
(564, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-23 11:47:26'),
(565, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-23 11:55:13'),
(566, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-23 12:27:15'),
(567, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-23 12:37:20'),
(568, 39, 'Lucia Meneguel Silva', 'compra', 'Compra realizada no valor de R$ 157.95', 'success', '2025-10-23 12:53:06'),
(569, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-23 13:54:42'),
(570, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-23 14:30:20'),
(571, 85, 'Suzy ', 'cadastro', 'Cliente cadastrado', 'success', '2025-10-23 14:42:47'),
(572, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-23 14:43:03'),
(573, 85, 'Suzy ', 'exclusao', 'Cliente excluído', 'info', '2025-10-24 11:53:21'),
(574, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 12:24:55'),
(575, 39, 'Lucia Meneguel Silva', 'compra', 'Compra realizada no valor de R$ 604.20', 'success', '2025-10-24 12:25:58'),
(576, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 12:26:11'),
(577, 39, 'Lucia Meneguel Silva', 'Em Trânsito', 'Status do pedido #184 alterado para EM_TRANSITO', 'info', '2025-10-24 12:26:15'),
(578, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 12:26:47'),
(579, 39, 'Lucia Meneguel Silva', 'compra', 'Compra realizada no valor de R$ 318.55', 'success', '2025-10-24 12:27:30'),
(580, 39, 'Lucia Meneguel Silva', 'compra', 'Compra realizada no valor de R$ 135.95', 'success', '2025-10-24 12:31:10'),
(581, 39, 'Lucia Meneguel Silva', 'compra', 'Compra realizada no valor de R$ 102.95', 'success', '2025-10-24 12:31:38'),
(582, 39, 'Lucia Meneguel Silva', 'compra', 'Compra realizada no valor de R$ 172.95', 'success', '2025-10-24 12:32:08'),
(583, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 12:33:08'),
(584, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 12:33:36'),
(585, 39, 'Lucia Meneguel Silva', 'compra', 'Compra realizada no valor de R$ 113.95', 'success', '2025-10-24 12:34:31'),
(586, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 12:35:54'),
(587, 39, 'Lucia Meneguel Silva', 'Em Trânsito', 'Status do pedido #185 alterado para EM_TRANSITO', 'info', '2025-10-24 12:35:59'),
(588, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 13:18:20'),
(589, 39, 'Lucia Meneguel Silva', 'ENTREGUE', 'Status do pedido #185 alterado para ENTREGUE', 'info', '2025-10-24 13:24:31'),
(590, 39, 'Lucia Meneguel Silva', 'ENTREGUE', 'Status do pedido #184 alterado para ENTREGUE', 'info', '2025-10-24 13:24:35'),
(591, 39, 'Lucia Meneguel Silva', 'Cancelado', 'Status do pedido #197 alterado para CANCELADO', 'info', '2025-10-24 13:24:38'),
(592, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 13:57:26'),
(593, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 14:00:22'),
(594, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 14:03:16'),
(595, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 14:03:37'),
(596, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 14:06:04'),
(597, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 14:06:30'),
(598, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 14:24:43'),
(599, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 14:56:33'),
(600, 39, 'Lucia Meneguel Silva', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 14:58:11'),
(601, 39, 'Lucia Meneguel', 'atualizacao', 'Dados do cliente atualizados', 'info', '2025-10-24 15:19:06'),
(602, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:29:02'),
(603, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:30:29'),
(604, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:31:25'),
(605, 39, 'Lucia Meneguel', 'Devolvido', 'Status do pedido #185 alterado para DEVOLVIDO', 'info', '2025-10-24 15:31:32'),
(606, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:32:06'),
(607, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 290.75', 'success', '2025-10-24 15:32:49'),
(608, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:33:42'),
(609, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:34:45'),
(610, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:34:58'),
(611, 39, 'Lucia Meneguel', 'Em Trânsito', 'Status do pedido #201 alterado para EM_TRANSITO', 'info', '2025-10-24 15:35:09'),
(612, 39, 'Lucia Meneguel', 'Em Trânsito', 'Status do pedido #195 alterado para EM_TRANSITO', 'info', '2025-10-24 15:35:11'),
(613, 39, 'Lucia Meneguel', 'Em Trânsito', 'Status do pedido #203 alterado para EM_TRANSITO', 'info', '2025-10-24 15:35:18'),
(614, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:35:32'),
(615, 39, 'Lucia Meneguel', 'ENTREGUE', 'Status do pedido #203 alterado para ENTREGUE', 'info', '2025-10-24 15:35:39'),
(616, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:36:35'),
(617, 39, 'Lucia Meneguel', 'Devolvido', 'Status do pedido #203 alterado para DEVOLVIDO', 'info', '2025-10-24 15:36:40'),
(618, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:36:55'),
(619, 39, 'Lucia Meneguel', 'Trocado', 'Status do pedido #203 alterado para TROCADO', 'info', '2025-10-24 15:37:16'),
(620, 39, 'Lucia Meneguel', 'Trocado', 'Status do pedido #185 alterado para TROCADO', 'info', '2025-10-24 15:37:28'),
(621, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 200.15', 'success', '2025-10-24 15:38:54'),
(622, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:39:34'),
(623, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:43:19'),
(624, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 200.15', 'success', '2025-10-24 15:44:01'),
(625, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 113.95', 'success', '2025-10-24 15:49:55'),
(626, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:50:44'),
(627, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:52:01'),
(628, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 200.15', 'success', '2025-10-24 15:54:05'),
(629, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:54:29'),
(630, 39, 'Lucia Meneguel', 'login', 'Cliente logado com sucesso', 'success', '2025-10-24 15:55:05'),
(631, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 259.95', 'success', '2025-10-24 15:55:44'),
(632, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 135.95', 'success', '2025-10-24 16:05:26'),
(633, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 102.95', 'success', '2025-10-24 16:09:31'),
(634, 39, 'Lucia Meneguel', 'compra', 'Compra realizada no valor de R$ 197.95', 'success', '2025-10-24 16:12:59');

-- --------------------------------------------------------

--
-- Estrutura da tabela `pedidos`
--

CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint(20) NOT NULL,
  `endereco_id` bigint(20) DEFAULT NULL,
  `cartao_id` bigint(20) DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `data_pedido` datetime NOT NULL,
  `valor_total` decimal(10,2) NOT NULL,
  `valor_frete` decimal(10,2) NOT NULL,
  `codigo_cupom` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `valor_desconto` decimal(10,2) DEFAULT NULL,
  `valor_subtotal` decimal(10,2) NOT NULL,
  `cartoes_adicionais` text COLLATE utf8mb4_unicode_ci,
  `motivo_devolucao` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `fk_cliente` (`cliente_id`),
  KEY `fk_cartao` (`cartao_id`),
  KEY `fk_endereco` (`endereco_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=228 ;

--
-- Extraindo dados da tabela `pedidos`
--

INSERT INTO `pedidos` (`id`, `cliente_id`, `endereco_id`, `cartao_id`, `status`, `data_pedido`, `valor_total`, `valor_frete`, `codigo_cupom`, `valor_desconto`, `valor_subtotal`, `cartoes_adicionais`, `motivo_devolucao`) VALUES
(184, 39, 399, 64, 'ENTREGUE', '2025-10-24 12:25:58', 604.20, 0.00, NULL, 0.00, 604.20, NULL, NULL),
(185, 39, 399, 64, 'TROCADO', '2025-10-24 12:27:30', 318.55, 39.95, NULL, 0.00, 278.60, NULL, NULL),
(194, 39, 399, 64, 'EM_PROCESSAMENTO', '2025-10-24 12:31:10', 135.95, 25.95, NULL, 0.00, 110.00, NULL, NULL),
(195, 39, 399, 64, 'EM_TRANSITO', '2025-10-24 12:31:38', 102.95, 25.95, NULL, 0.00, 77.00, NULL, NULL),
(197, 39, 399, 64, 'CANCELADO', '2025-10-24 12:32:08', 172.95, 32.95, NULL, 0.00, 140.00, NULL, NULL),
(201, 39, 399, 64, 'EM_TRANSITO', '2025-10-24 12:34:31', 113.95, 25.95, NULL, 0.00, 88.00, NULL, NULL),
(203, 39, 399, 64, 'TROCADO', '2025-10-24 15:32:49', 290.75, 39.95, NULL, 0.00, 250.80, NULL, NULL),
(205, 39, 399, 64, 'EM_PROCESSAMENTO', '2025-10-24 15:38:54', 200.15, 32.95, NULL, 0.00, 167.20, NULL, NULL),
(207, 39, 399, 64, 'EM_PROCESSAMENTO', '2025-10-24 15:44:01', 200.15, 32.95, NULL, 0.00, 167.20, NULL, NULL),
(210, 39, 399, 64, 'EM_PROCESSAMENTO', '2025-10-24 15:49:55', 113.95, 25.95, NULL, 0.00, 88.00, NULL, NULL),
(215, 39, 399, 64, 'EM_PROCESSAMENTO', '2025-10-24 15:54:05', 200.15, 32.95, NULL, 0.00, 167.20, NULL, NULL),
(218, 39, 399, 64, 'EM_PROCESSAMENTO', '2025-10-24 15:55:44', 259.95, 39.95, NULL, 0.00, 220.00, NULL, NULL),
(221, 39, 399, 64, 'EM_PROCESSAMENTO', '2025-10-24 16:05:26', 135.95, 25.95, NULL, 0.00, 110.00, NULL, NULL),
(223, 39, 399, 64, 'EM_PROCESSAMENTO', '2025-10-24 16:09:31', 102.95, 25.95, NULL, 0.00, 77.00, NULL, NULL),
(225, 39, 399, 64, 'EM_PROCESSAMENTO', '2025-10-24 16:12:59', 197.95, 32.95, NULL, 0.00, 165.00, NULL, NULL);

--
-- Restrições para as tabelas dumpadas
--

--
-- Restrições para a tabela `cartao`
--
ALTER TABLE `cartao`
  ADD CONSTRAINT `FKjvbpp9u681gt112ldcpy56idf` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`);

--
-- Restrições para a tabela `endereco`
--
ALTER TABLE `endereco`
  ADD CONSTRAINT `FK_endereco_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`) ON DELETE CASCADE;

--
-- Restrições para a tabela `itens_pedido`
--
ALTER TABLE `itens_pedido`
  ADD CONSTRAINT `FK42mycompce3b7yt3l6ukdwsxy` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK66bgjrjsk3v6526p446u2q7ct` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE;

--
-- Restrições para a tabela `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `fk_cartao` FOREIGN KEY (`cartao_id`) REFERENCES `cartao` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `cliente` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_endereco` FOREIGN KEY (`endereco_id`) REFERENCES `endereco` (`id`) ON DELETE SET NULL;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
