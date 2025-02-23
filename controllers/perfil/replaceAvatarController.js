const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');
// importação do middleware para verificar a autenticação do token
const { remove_session } = require('../../middlewares/index');

const replaceAvatar = async (req, res) => {
    try {
        const url_profile_picture = req.params.avatar;
        const userId = req.user.id;

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                profilePicture: url_profile_picture
            }
        })

        if(!user) {
            res.json({ msg: "Erro ao atualizar profile picture" })
        }

        res.status(201).json({ msg: "Sucesso ao atualizar profile picture" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar foto de perfil." });
    }
}

module.exports = replaceAvatar;