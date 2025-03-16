const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const createComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    try {
        if (!content || content.trim() === '') {
            return res.status(400).json({ msg: 'O comentário não pode estar vazio' });
        }

        // Criação do comentário no banco de dados
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

        // Recupera o autor do post
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            select: { userId: true }, // Recupera o ID do usuário que postou
        });

        if (post) {
            const authorId = post.userId;

            // Cria a notificação para o autor do post
            await prisma.notification.create({
                data: {
                    userId: authorId, // Autor do post
                    triggeredById: req.user.id, // Usuário que fez o comentário
                    postId: parseInt(postId),
                    action: 'comment', // Tipo de ação: 'comment'
                },
            });
        }

        res.status(201).json(comment);
    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        res.status(500).json({ msg: 'Erro ao criar o comentário' });
    }
};

module.exports = createComment;