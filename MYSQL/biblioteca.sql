-- phpMyAdmin SQL Dump
-- version 3.4.9
-- http://www.phpmyadmin.net
--
-- Servidor: localhost
-- Tempo de Geração: 26/09/2025 às 15h10min
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=109 ;

--
-- Extraindo dados da tabela `cartao`
--

INSERT INTO `cartao` (`id`, `bandeira`, `cvv`, `data_validade`, `nome_titular`, `numero`, `cliente_id`, `preferencial`) VALUES
(105, 'Mastercard', '3333', '2025-12', 'Matheus', '3333333333333333333', 39, '0');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=75 ;

--
-- Extraindo dados da tabela `cliente`
--

INSERT INTO `cliente` (`id`, `ativo`, `cpf`, `data_cadastro`, `email`, `motivo_ativacao`, `motivo_inativacao`, `nome`, `senha`, `telefone`, `genero`, `nascimento`, `tipotelefone`, `perfil`) VALUES
(39, '1', '422.113.848-38', '2025-07-23', 'luciasilva@gmail.com', NULL, NULL, 'Lucia Meneguel ', '$2a$10$DNE9sx10C7bk10NjqiK2nO5WO/7WvRPgaSQnFjdIPAfRU6NNnLPHW', '(11) 97507-2008', 'MASCULINO', '2004-09-20', 'celular', 'CLIENTE'),
(54, '1', NULL, '2025-08-04', 'admin@livros.com', NULL, NULL, 'Administrador', '$2a$10$NIlHTEv6jYa/hZaZm78hyuJz7bcOLA1cY3sT.8ca6O3Sws/uRWWvm', NULL, NULL, NULL, NULL, 'ADMIN');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=486 ;

--
-- Extraindo dados da tabela `endereco`
--

INSERT INTO `endereco` (`id`, `bairro`, `cep`, `cidade`, `complemento`, `estado`, `numero`, `rua`, `tipo`, `cliente_id`, `logradouro`, `pais`, `tipo_logradouro`, `tipo_residencia`, `nome_endereco`) VALUES
(398, 'Rodeio', '08775639', 'Mogi das Cruzes', '22', 'SP', '22', 'Professor Jurandyr de Oliveira', 'COBRANCA', 39, 'Dos anges', 'Brasil', 'Avenida', 'Casa', NULL),
(399, 'bairro', '11111111', 'Mogi das Cruzes', '22', 'SP', '22', 'Professor Jurandyr de Oliveira', 'ENTREGA', 39, 'dos anges', 'Brasil', 'Avenida', 'Casa', 'Minha Casa');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=234 ;

--
-- Extraindo dados da tabela `itens_pedido`
--

INSERT INTO `itens_pedido` (`id`, `pedido_id`, `livro_id`, `quantidade`, `preco_unitario`, `quantidade_devolucao`, `status`) VALUES
(231, 186, 15, 3, 87.50, 0, 'EM_PROCESSAMENTO'),
(232, 187, 15, 1, 87.50, 0, 'EM_PROCESSAMENTO'),
(233, 187, 16, 3, 37.50, 0, 'EM_PROCESSAMENTO');

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
(15, '1', 'Luisa Lins', 'Terror', '2025-07-18', 'Republic', 29, 'aaa', NULL, 70.00, 87.50, 'O Temporal', 3, '3344444', 1, '222222', 3, 50, 3, 3, 'bla bla bla bla'),
(16, '1', 'Ygona', 'Amor', '2025-07-18', 'Record', 15, 'nbv', NULL, 30.00, 37.50, 'A lavagem', 10, '2223334', 2, '333333', 3, 90, 3, 3, 'HAHAHAHHAHAHAHHA'),
(17, '1', 'Ygona', 'Amor', '2025-07-18', 'Record', 23, 'll', NULL, 30.00, 37.50, 'Prisionerio B12', 10, '2223334', 2, '333333', 3, 90, 3, 3, 'qqqqqq'),
(18, '1', 'Ygona', 'mana', '2025-07-18', 'Record', 7, 'Estoque reposto, produto reativado.', NULL, 30.00, 37.50, 'Ka KA Pa', 10, '2223334', 2, '333333', 3, 90, 3, 3, 'sssssss');

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=494 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=188 ;

--
-- Extraindo dados da tabela `pedidos`
--

INSERT INTO `pedidos` (`id`, `cliente_id`, `endereco_id`, `cartao_id`, `status`, `data_pedido`, `valor_total`, `valor_frete`, `codigo_cupom`, `valor_desconto`, `valor_subtotal`, `cartoes_adicionais`, `motivo_devolucao`) VALUES
(186, 39, 399, NULL, 'EM_PROCESSAMENTO', '2025-09-26 13:00:26', 475.00, 0.00, NULL, 50.00, 525.00, NULL, NULL),
(187, 39, NULL, NULL, 'EM_PROCESSAMENTO', '2025-09-26 13:06:41', 350.00, 0.00, NULL, 50.00, 400.00, NULL, NULL);

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
