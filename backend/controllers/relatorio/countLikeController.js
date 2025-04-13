const { countLikes } = require('../../models/relatorio/relatorioModel');
const asyncHandler = require('../../utils/asyncHandler');

const countLikeController = asyncHandler(async (req, res) => {
    const resposta = await countLikes();
    res.json({ quantidade: resposta });

});

module.exports = countLikeController;