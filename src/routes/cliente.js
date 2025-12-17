const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {

  try {
    const { clienteId, email, senha } = req.body;
    
    // 1. Busca o cliente no banco
    const cliente = await Cliente.findOne({
      where: { id: clienteId, email },
      include: [Endereco, Cartao] 
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // 2. Verifica a senha (supondo que está armazenada como hash)
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    
    if (!senhaValida) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // 3. Retorna os dados do cliente (sem a senha)
    const clienteSemSenha = { ...cliente.toJSON() };
    delete clienteSemSenha.senha;
    
    res.json(clienteSemSenha);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

router.get('/clientes', ClienteController.listar);
router.post('/clientes', ClienteController.criar);

module.exports = router;