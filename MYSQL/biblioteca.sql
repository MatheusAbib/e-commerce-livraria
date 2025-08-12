-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tempo de Geração: 11/08/2025 às 16h42min
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=103 ;

--
-- Extraindo dados da tabela `cartao`
--

INSERT INTO `cartao` (`id`, `bandeira`, `cvv`, `data_validade`, `nome_titular`, `numero`, `cliente_id`, `preferencial`) VALUES
(64, 'American Express', '222', '2025-10', 'Matheus Bilitardo Abib', '2222', 39, '0'),
(65, 'Visa', '3345', '2025-08', 'Lucia', '4444444444444444', 39, '1'),
(88, 'Elo', '122', '2025-02', 'aaaaaaa', '1111111111111111', 59, '1');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=74 ;

--
-- Extraindo dados da tabela `cliente`
--

INSERT INTO `cliente` (`id`, `ativo`, `cpf`, `data_cadastro`, `email`, `motivo_ativacao`, `motivo_inativacao`, `nome`, `senha`, `telefone`, `genero`, `nascimento`, `tipotelefone`, `perfil`) VALUES
(39, '1', '422.113.848-38', '2025-07-23', 'luciasilva@gmail.com', NULL, NULL, 'Lucia Meneguel ', '$2a$10$DNE9sx10C7bk10NjqiK2nO5WO/7WvRPgaSQnFjdIPAfRU6NNnLPHW', '(11) 97507-2008', 'MASCULINO', '2004-09-20', 'celular', 'CLIENTE'),
(54, '1', NULL, '2025-08-04', 'admin@livros.com', NULL, NULL, 'Administrador', '$2a$10$NIlHTEv6jYa/hZaZm78hyuJz7bcOLA1cY3sT.8ca6O3Sws/uRWWvm', NULL, NULL, NULL, NULL, 'ADMIN'),
(59, '1', '422.113.848-38', '2025-08-05', 'bilitardo@gmail.com', NULL, NULL, 'Hanna', '$2a$10$gay5Qf/6t/LzhLt5C1ANrOn0gzuMQLtAvnzk.aa6h4FpNSwlJFLRK', '(11) 11111-1111', 'MASCULINO', '2025-08-07', 'celular', 'CLIENTE');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=473 ;

--
-- Extraindo dados da tabela `endereco`
--

INSERT INTO `endereco` (`id`, `bairro`, `cep`, `cidade`, `complemento`, `estado`, `numero`, `rua`, `tipo`, `cliente_id`, `logradouro`, `pais`, `tipo_logradouro`, `tipo_residencia`, `nome_endereco`) VALUES
(398, 'Rodeio', '08775639', 'Mogi das Cruzes', '22', 'SP', '22', 'Professor Jurandyr de Oliveira', 'COBRANCA', 39, 'Dos anges', 'Brasil', 'Avenida', 'Casa', NULL),
(399, 'bairro', '11111111', 'Mogi das Cruzes', '22', 'SP', '22', 'Professor Jurandyr de Oliveira', 'ENTREGA', 39, 'dos anges', 'Brasil', 'Avenida', 'Casa', 'Minha Casa'),
(440, 'bairro', '11111-111', 'cidade', '22', 'SP', '22', 'Professor', 'COBRANCA', 59, 'Dos anges', 'Brasil', 'Avenida', 'Casa', NULL),
(441, 'bairro', '11111-111', 'cidade', '22', 'SP', '22', 'Professor', 'ENTREGA', 59, 'dos anges', 'Brasil', 'Avenida', 'Casa', 'Endereço #1');

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
  PRIMARY KEY (`id`),
  KEY `FK42mycompce3b7yt3l6ukdwsxy` (`pedido_id`),
  KEY `FK66bgjrjsk3v6526p446u2q7ct` (`livro_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=217 ;

--
-- Extraindo dados da tabela `itens_pedido`
--

INSERT INTO `itens_pedido` (`id`, `pedido_id`, `livro_id`, `quantidade`, `preco_unitario`) VALUES
(181, 150, 15, 2, 87.50),
(185, 154, 15, 1, 87.50),
(186, 154, 16, 1, 37.50),
(187, 154, 17, 1, 37.50),
(191, 157, 15, 2, 87.50),
(192, 157, 16, 1, 37.50),
(193, 158, 15, 4, 87.50),
(194, 159, 15, 4, 87.50),
(195, 160, 15, 1, 87.50),
(196, 161, 15, 1, 87.50),
(197, 162, 15, 1, 87.50),
(199, 164, 17, 1, 37.50),
(200, 165, 18, 1, 33.00),
(201, 166, 15, 1, 87.50),
(202, 167, 15, 3, 87.50),
(204, 168, 15, 1, 87.50),
(205, 169, 16, 1, 37.50),
(206, 170, 15, 1, 87.50),
(209, 171, 18, 8, 33.00),
(210, 171, 17, 5, 37.50),
(211, 171, 16, 4, 37.50),
(213, 173, 18, 30, 37.50),
(214, 174, 16, 1, 37.50),
(215, 174, 15, 1, 87.50),
(216, 175, 18, 1, 37.50);

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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=22 ;

--
-- Extraindo dados da tabela `livros`
--

INSERT INTO `livros` (`id`, `ativo`, `autor`, `categoria`, `data_entrada`, `editora`, `estoque`, `motivo_ativacao`, `motivo_inativacao`, `preco_custo`, `preco_venda`, `titulo`, `altura`, `codigo_barras`, `edicao`, `isbn`, `largura`, `paginas`, `peso`, `profundidade`, `sinopse`) VALUES
(15, '1', 'Luisa Lins', 'Terror', '2025-07-18', 'Republic', 43, 'aaa', NULL, 70.00, 87.50, 'O Temporal', 3, '3344444', 1, '222222', 3, 50, 3, 3, 'bla bla bla bla'),
(16, '1', 'Ygona', 'Amor', '2025-07-18', 'Record', 47, 'nbv', NULL, 30.00, 37.50, 'A lavagem', 10, '2223334', 2, '333333', 3, 90, 3, 3, 'HAHAHAHHAHAHAHHA'),
(17, '1', 'Ygona', 'Amor', '2025-07-18', 'Record', 45, 'll', NULL, 30.00, 37.50, 'Prisionerio B12', 10, '2223334', 2, '333333', 3, 90, 3, 3, 'qqqqqq'),
(18, '1', 'Ygona', 'mana', '2025-07-18', 'Record', 9, 'Estoque reposto, produto reativado.', NULL, 30.00, 37.50, 'Ka KA Pa', 10, '2223334', 2, '333333', 3, 90, 3, 3, 'sssssss');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=471 ;

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
(470, 54, 'Administrador', 'login', 'Cliente logado com sucesso', 'success', '2025-08-11 14:38:31');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=176 ;

--
-- Extraindo dados da tabela `pedidos`
--

INSERT INTO `pedidos` (`id`, `cliente_id`, `endereco_id`, `cartao_id`, `status`, `data_pedido`, `valor_total`, `valor_frete`, `codigo_cupom`, `valor_desconto`, `valor_subtotal`, `cartoes_adicionais`, `motivo_devolucao`) VALUES
(150, 39, 399, 64, 'TROCADO', '2025-08-04 11:49:48', 207.95, 32.95, NULL, 0.00, 175.00, NULL, 'kktk'),
(154, 39, 399, 64, 'TROCADO', '2025-08-05 09:05:43', 195.45, 32.95, NULL, 0.00, 162.50, NULL, 'aa'),
(157, 39, 399, 64, 'TROCADO', '2025-08-05 11:04:10', 252.45, 39.95, NULL, 0.00, 212.50, NULL, 'ddd'),
(158, 39, 399, 64, 'TROCADO', '2025-08-05 11:47:14', 350.00, 0.00, NULL, 0.00, 350.00, NULL, 'haanananaa'),
(159, 39, 399, 64, 'TROCADO', '2025-08-05 11:51:36', 350.00, 0.00, NULL, 0.00, 350.00, NULL, 'dddd'),
(160, 39, 399, 64, 'TROCADO', '2025-08-05 12:07:15', 113.45, 25.95, NULL, 0.00, 87.50, NULL, 'shsrhhshs'),
(161, 39, 399, 64, 'TROCADO', '2025-08-05 12:30:47', 113.45, 25.95, NULL, 0.00, 87.50, NULL, NULL),
(162, 39, 399, 64, 'TROCADO', '2025-08-05 13:03:27', 113.45, 25.95, NULL, 0.00, 87.50, NULL, NULL),
(163, 39, 399, 64, 'TROCADO', '2025-08-05 13:03:40', 20.20, 18.95, NULL, 0.00, 1.25, NULL, NULL),
(164, 39, 399, 64, 'TROCADO', '2025-08-05 13:04:05', 56.45, 18.95, NULL, 0.00, 37.50, NULL, NULL),
(165, 39, 399, 64, 'TROCADO', '2025-08-05 13:04:22', 51.95, 18.95, NULL, 0.00, 33.00, NULL, NULL),
(166, 39, 399, 64, 'CANCELADO', '2025-08-05 13:55:14', 113.45, 25.95, NULL, 0.00, 87.50, NULL, NULL),
(167, 39, 399, 64, 'TROCADO', '2025-08-07 11:33:24', 302.45, 39.95, NULL, 0.00, 262.50, NULL, NULL),
(168, 39, 399, 64, 'TROCADO', '2025-08-07 13:33:25', 114.70, 25.95, NULL, 0.00, 88.75, '[{"id":65,"numero":"4444444444444444","nomeTitular":"Lucia","bandeira":"Visa","cvv":"3345","dataValidade":"2025-08","preferencial":false}]', NULL),
(169, 39, 399, 64, 'ENTREGUE', '2025-08-07 13:40:10', 56.45, 18.95, NULL, 0.00, 37.50, NULL, NULL),
(170, 39, 399, 64, 'DEVOLUCAO', '2025-08-07 13:46:22', 120.95, 25.95, NULL, 0.00, 95.00, NULL, 'hmhm'),
(171, 39, 399, 64, 'DEVOLUCAO', '2025-08-07 14:14:58', 619.00, 0.00, NULL, 0.00, 619.00, NULL, 'mamamma'),
(173, 39, 399, 65, 'ENTREGUE', '2025-08-08 11:29:55', 1125.00, 0.00, NULL, 0.00, 1125.00, NULL, NULL),
(174, 39, 399, 64, 'CANCELADO', '2025-08-08 15:31:33', 150.95, 25.95, NULL, 0.00, 125.00, '[{"id":65,"numero":"4444444444444444","nomeTitular":"Lucia","bandeira":"Visa","cvv":"3345","dataValidade":"2025-08","preferencial":true}]', NULL),
(175, 39, 399, 64, 'ENTREGUE', '2025-08-08 15:34:39', 18.95, 18.95, 'TROCA-U4YJ6D', 37.50, 37.50, NULL, NULL);

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
  ADD CONSTRAINT `FK66bgjrjsk3v6526p446u2q7ct` FOREIGN KEY (`livro_id`) REFERENCES `livros` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK42mycompce3b7yt3l6ukdwsxy` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE;

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
