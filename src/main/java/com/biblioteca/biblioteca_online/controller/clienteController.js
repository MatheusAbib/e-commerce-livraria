const bcrypt = require('bcrypt');
const Cliente = require('../models/Cliente'); 

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1. Busca o cliente pelo email
    const cliente = await Cliente.findOne({ where: { email } });
    
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // 2. Verifica a senha
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    
    if (!senhaValida) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    // 3. Retorna os dados do cliente (sem a senha)
    const clienteSemSenha = cliente.toJSON();
    delete clienteSemSenha.senha;
    
    res.json(clienteSemSenha);
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
};