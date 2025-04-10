const prisma = require('../../models/prisma');
const replaceAvatarModel = require('../../models/perfil/replaceAvatarModel');

const replaceAvatar = async (req, res) => {
    try {
        const url_profile_picture = req.params.avatar;
        const userId = req.user.id;
        const { usernick } = req.body;

        if(!usernick || !url_profile_picture) {
            return res.status(400).json({ msg: "Usuário não informado" });
        }

        // Verifica se o usuário é administrador ou se está atualizando a própria foto de perfil
        const userToUpdate = await prisma.user.findUnique({
            where: {
                usernick: usernick
            }
        });

        if (!userToUpdate) {
            return res.status(404).json({ msg: "Usuário não encontrado" });
        }

        if (userToUpdate.id !== userId && !req.user.isadmin) {
            return res.status(403).json({ msg: "Você não tem permissão para atualizar a foto de perfil deste usuário" });
        }

        const user = await prisma.user.update({
            where: {
                usernick: usernick
            },
            data: {
                profilePicture: url_profile_picture
            }
        });

        res.status(201).json({ msg: "Sucesso ao atualizar profile picture" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Erro ao atualizar profile picture" });
    }
};

module.exports = replaceAvatar;