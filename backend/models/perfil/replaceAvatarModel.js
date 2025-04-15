const prisma = require('../prisma');
const createHttpError = require('http-errors');

const replaceAvatarModel = async (usernick, url_profile_picture, userId) => {
    // Verifica se o usuário é administrador ou se está atualizando a própria foto de perfil
    const userToUpdate = await prisma.user.findUnique({
        where: {
            usernick: usernick
        }
    });

    if (!userToUpdate) {
        throw createHttpError(404, "Usuário não encontrado");
    }

    if (userToUpdate.id !== userId && !req.user.isadmin) {
        throw createHttpError(403, "Você não tem permissão para atualizar a foto de perfil deste usuário");
    }

    const user = await prisma.user.update({
        where: {
            usernick: usernick
        },
        data: {
            profilePicture: url_profile_picture
        }
    });
};

module.exports = replaceAvatarModel;