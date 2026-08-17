const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {

  try {
    const { clienteId, email, senha } = req.body;
    
    const cliente = await Cliente.findOne({
      where: { id: clienteId, email },
      include: [Endereco, Cartao] 
    });

    if (!cliente) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    
    if (!senhaValida) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

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