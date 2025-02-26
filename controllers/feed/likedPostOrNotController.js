const prisma = require('../../models/prisma');

var cookieParser = require('cookie-parser');

const likedPostOrNot = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id; 

    try {
        // Verifica se o usuário já curtiu a postagem
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: parseInt(postId),
                },
            },
        });

        if (existingLike) {
            // Se já curtiu, remove a curtida (descurtir)
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            return res.json({ message: 'Curtida removida' });
        } else {
            // Caso contrário, adiciona uma nova curtida
            await prisma.like.create({
                data: {
                    userId: userId,
                    postId: parseInt(postId),
                },
            });
            return res.json({ message: 'Post curtido' });
        }
    } catch (error) {
        console.error('Erro ao curtir/descurtir post, Erro: ', error);
        res.status(500).json({ message: 'Erro interno ao curtir/descurtir post, entre em contato com o suporte'});
    }
}

module.exports = likedPostOrNot;