const { countPosts } = require('../../models/relatorio/relatorioModel');
const asyncHandler = require('../../utils/asyncHandler');

const countPostController = asyncHandler(async (req, res) => {
    const resposta = await countPosts();
    res.json({ quantidade: resposta });
});

module.exports = countPostController;