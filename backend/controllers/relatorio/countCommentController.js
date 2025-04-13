const { countComments } = require('../../models/relatorio/relatorioModel');
const asyncHandler = require('../../utils/asyncHandler');

const countCommentController = asyncHandler(async (req, res) => {
    const resposta = await countComments();
    res.json({ quantidade: resposta });
});

module.exports = countCommentController;