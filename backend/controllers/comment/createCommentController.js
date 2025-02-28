const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const createComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    try {
        if (!content || content.trim() === '') {
            return res.status(400).json({ msg: 'O comentário não pode estar vazio' });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(postId),
                userId: req.user.id,
            },
            include: {
                user: {
                    select: {
                        nome: true,
                        usernick: true,
                        profilePicture: true,
                    },
                },
            },
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        res.status(500).json({ msg: 'Erro ao criar o comentário' });
    }
}

module.exports = createComment;