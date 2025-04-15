const userByNickModel = require('../../models/perfil/userByNickModel')
const asyncHandler = require('../../utils/asyncHandler');

const userByNick = asyncHandler(async (req, res) => {
    const { usernick } = req.params;
    const userId = req.user.id; // ID do usuário autenticado
    const isAdmin = req.user.isadmin;

    const user = await userByNickModel(usernick, userId, isAdmin);

    res.status(200).json(user);
});

module.exports = userByNick;