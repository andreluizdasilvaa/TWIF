const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const listComment = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await prisma.comment.findMany({
            where: { postId: parseInt(postId) },
            include: {
                user: {
                    select: {
                        id: true,   
                        nome: true,
                        usernick: true,
                        profilePicture: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error('Erro ao listar os comentários:', error);
        res.status(500).json({ msg: 'Erro ao listar os comentários' });
    }
}

module.exports = listComment;