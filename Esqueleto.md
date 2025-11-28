# File Tree: e-commerce-livraria-main

**Generated:** 11/19/2025, 8:31:48 AM
**Root Path:** `c:\Users\97857\Desktop\projects\e-commerce-livraria-main`

```
├── 📁 .mvn
│   └── 📁 wrapper
│       └── 📄 maven-wrapper.properties
├── 📁 MYSQL
│   └── 📄 biblioteca.sql
├── 📁 cypress
│   ├── 📁 e2e
│   │   └── 📁 compra
│   │       ├── 📄 clientes.cy.js
│   │       ├── 📄 fluxoCompraCompleto.cy.js
│   │       └── 📄 fluxo_conducao_adaptado_real.cy.js
│   ├── 📁 fixtures
│   │   └── ⚙️ example.json
│   └── 📁 support
│       ├── 📄 commands.js
│       └── 📄 e2e.js
├── 📁 src
│   ├── 📁 main
│   │   ├── 📁 java
│   │   │   └── 📁 com
│   │   │       └── 📁 biblioteca
│   │   │           └── 📁 biblioteca_online
│   │   │               ├── 📁 config
│   │   │               │   └── ☕ SecurityConfig.java
│   │   │               ├── 📁 controller
│   │   │               │   ├── ☕ CartaoController.java
│   │   │               │   ├── ☕ ClienteController.java
│   │   │               │   ├── ☕ EnderecoController.java
│   │   │               │   ├── ☕ LivroController.java
│   │   │               │   ├── ☕ LogController.java
│   │   │               │   ├── ☕ PedidoController.java
│   │   │               │   ├── ☕ VendasController.java
│   │   │               │   └── 📄 clienteController.js
│   │   │               ├── 📁 dto
│   │   │               │   ├── ☕ AtualizarStatusDTO.java
│   │   │               │   ├── ☕ ClienteRankingDTO.java
│   │   │               │   ├── ☕ CriarPedidoDTO.java
│   │   │               │   ├── ☕ ItemPedidoDTO.java
│   │   │               │   ├── ☕ LoginRequest.java
│   │   │               │   ├── ☕ PagamentoDTO.java
│   │   │               │   └── ☕ SenhaDTO.java
│   │   │               ├── 📁 model
│   │   │               │   ├── ☕ Cartao.java
│   │   │               │   ├── ☕ Cliente.java
│   │   │               │   ├── ☕ DevolucaoRequest.java
│   │   │               │   ├── ☕ Endereco.java
│   │   │               │   ├── ☕ ItemDevolucao.java
│   │   │               │   ├── ☕ ItemPedido.java
│   │   │               │   ├── ☕ Livro.java
│   │   │               │   ├── ☕ Log.java
│   │   │               │   ├── ☕ Pedido.java
│   │   │               │   └── ☕ StatusPedido.java
│   │   │               ├── 📁 repository
│   │   │               │   ├── ☕ CartaoRepository.java
│   │   │               │   ├── ☕ ClienteRepository.java
│   │   │               │   ├── ☕ EnderecoRepository.java
│   │   │               │   ├── ☕ LivroRepository.java
│   │   │               │   ├── ☕ LogRepository.java
│   │   │               │   └── ☕ PedidoRepository.java
│   │   │               ├── 📁 service
│   │   │               │   ├── ☕ CartaoService.java
│   │   │               │   ├── ☕ ClienteService.java
│   │   │               │   ├── ☕ EnderecoService.java
│   │   │               │   ├── ☕ FileStorageService.java
│   │   │               │   ├── ☕ LivroService.java
│   │   │               │   ├── ☕ LogService.java
│   │   │               │   ├── ☕ PedidoService.java
│   │   │               │   └── ☕ RelatorioService.java
│   │   │               ├── 📁 specs
│   │   │               │   └── ☕ LivroSpecification.java
│   │   │               └── ☕ BibliotecaOnlineApplication.java
│   │   └── 📁 resources
│   │       ├── 📁 static
│   │       │   ├── 📁 css
│   │       │   │   ├── 🎨 Carrinho.css
│   │       │   │   ├── 🎨 Clientes.css
│   │       │   │   ├── 🎨 Grafico.css
│   │       │   │   ├── 🎨 Livros.css
│   │       │   │   ├── 🎨 Pedidos.css
│   │       │   │   ├── 🎨 PedidosAdmin.css
│   │       │   │   ├── 🎨 Principal.css
│   │       │   │   ├── 🎨 ranking.css
│   │       │   │   └── 🎨 usuarios.css
│   │       │   ├── 📁 js
│   │       │   │   ├── 📄 Principal.js
│   │       │   │   ├── 📄 carrinho.js
│   │       │   │   ├── 📄 clientes.js
│   │       │   │   ├── 📄 grafico.js
│   │       │   │   ├── 📄 livros.js
│   │       │   │   ├── 📄 log.js
│   │       │   │   ├── 📄 pedidos.js
│   │       │   │   ├── 📄 pedidosADMIN.js
│   │       │   │   └── 📄 usuarios.js
│   │       │   ├── 🌐 CupomDesconto.html
│   │       │   ├── 🌐 carrinho.html
│   │       │   ├── 🌐 clientes.html
│   │       │   ├── 🌐 grafico.html
│   │       │   ├── 🌐 header.html
│   │       │   ├── 🌐 livros.html
│   │       │   ├── 🌐 log.html
│   │       │   ├── 🌐 logCliente.html
│   │       │   ├── 🌐 lucros.html
│   │       │   ├── 🌐 pedidos.html
│   │       │   ├── 🌐 pedidosADMIN.html
│   │       │   ├── 🌐 principal.html
│   │       │   ├── 🌐 ranking.html
│   │       │   └── 🌐 usuarios.html
│   │       └── 📄 application.properties
│   ├── 📁 routes
│   │   └── 📄 cliente.js
│   └── 📁 test
│       └── 📁 java
│           └── 📁 com
│               └── 📁 biblioteca
│                   └── 📁 biblioteca_online
│                       └── ☕ BibliotecaOnlineApplicationTests.java
├── 📁 uploads
│   ├── 🖼️ 0b1697eb-155c-468d-918b-29eb2863376e.webp
│   ├── 🖼️ 197feaec-12a6-48a3-8be0-f805f5e36508.png
│   ├── 🖼️ 268a02ff-8b47-4ff7-ae91-ff0164404632.webp
│   ├── 🖼️ 59f4529f-55c9-4264-b363-81c142f68465.jpg
│   ├── 🖼️ 86e44938-7ec4-40fc-aa96-8e5a0b6fcf44.jpg
│   ├── 🖼️ d3f99ab5-c2a7-4bf2-b872-189553f30d9b.jpg
│   └── 🖼️ e825a72e-a6f1-4b26-aa67-3a44c17b030c.jpg
├── ⚙️ .gitattributes
├── ⚙️ .gitignore
├── ⚙️ .hintrc
├── 📝 README.md
├── 📄 cypress.config.js
├── 📄 mvnw
├── 📄 mvnw.cmd
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── ⚙️ pom.xml
```

---
*Generated by FileTree Pro Extension*