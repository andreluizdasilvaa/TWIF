const { countUsers } = require('../../models/relatorio/relatorioModel');
const asyncHandler = require('../../utils/asyncHandler');

const countUserController = asyncHandler(async (req, res) => {
    const resposta = await countUsers();
    res.json({ quantidade: resposta });
});

module.exports = countUserController;