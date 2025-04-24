const prisma = require('../../models/prisma');

const createSupportRequest = async (req, res) => {
  const { nome, email, problema } = req.body;


  try {
    const novoPedido = await prisma.SupportRequest.create({
      data: { nome, email, problema }
    });

    return res.status(201).json({ msg: "Pedido de suporte enviado com sucesso!" });
  } catch (error) {
    console.error('Erro ao criar pedido de suporte:', error);
    return res.status(500).json({ msg: "Erro interno ao processar pedido de suporte.", error: error.message });
  }
};

module.exports = { createSupportRequest };
