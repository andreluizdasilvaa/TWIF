const { countAdminsUsers } = require('../../models/relatorio/relatorioModel');
const asyncHandler = require('../../utils/asyncHandler');

const countAdminsUsersController = asyncHandler(async (req, res) => {
    const resposta = await countAdminsUsers();
    res.json({ quantidade: resposta });
});

module.exports = countAdminsUsersController;