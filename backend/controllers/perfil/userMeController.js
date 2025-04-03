const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const userMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }, // Usa o userId do token
            select: { id: true, nome: true, profilePicture: true, usernick: true, isadmin: true },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar o usuário');
    };
}

module.exports = userMe;