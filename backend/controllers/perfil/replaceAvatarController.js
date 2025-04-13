const replaceAvatarModel = require('../../models/perfil/replaceAvatarModel');
const asyncHandler = require('../../utils/asyncHandler');
const createHttpError = require('http-errors');

const replaceAvatar = asyncHandler(async (req, res) => {
    try {
        const url_profile_picture = req.params.avatar;
        const userId = req.user.id;
        const { usernick } = req.body;

        if(!usernick || !url_profile_picture) {
            throw createHttpError(400, "Usuário não informado");
        }

        await replaceAvatarModel(usernick, url_profile_picture, userId);

        res.status(201).json({ msg: "Sucesso ao atualizar profile picture" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Erro ao atualizar profile picture" });
    }
});

module.exports = replaceAvatar;