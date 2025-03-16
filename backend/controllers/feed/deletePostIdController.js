const prisma = require('../../models/prisma');

const deletePostId = async (req, res) => {
    let { idPost } = req.body;

    idPost = parseInt(idPost, 10);

    if (isNaN(idPost)) {
        return res.status(400).json({ message: 'ID do post inválido.' });
    }

    try {
        // Verifica se o post existe
        const post = await prisma.post.findUnique({
            where: { id: idPost }
        });

        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado.' });
        }

        // Verifica permissão do usuário
        if (post.userId !== req.user.id && !req.user.isadmin) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar este post.' });
        }

        // Move o post para a tabela 'PostDeleted'
        const postDeleted = await prisma.postDeleted.create({
            data: {
                postId: post.id,
                content: post.content,
                userId: post.userId,
                createdAt: post.createdAt
            },
        });

        // Se um Administrador deletar o post de OUTRO usuário, cria a notificação
        if (req.user.isadmin && post.userId !== req.user.id) {
            await prisma.notification.create({
                data: {
                    userId: post.userId, // Dono do post que será notificado
                    triggeredById: req.user.id, // Administrador que deletou o post
                    postDeletedId: postDeleted.id, // Referência ao post deletado
                    action: "postDeleteByAdm",
                    createdAt: new Date()
                }
            });
        }

        await prisma.notification.deleteMany({
            where: { postId: idPost }
        });

        await prisma.comment.deleteMany({
            where: { postId: idPost }
        });

        await prisma.like.deleteMany({
            where: { postId: idPost }
        });

        await prisma.post.delete({
            where: { id: idPost }
        });

        res.status(200).json({ message: "Post deletado com sucesso." });
    } catch (error) {
        console.error('Erro ao deletar o post:', error);
        res.status(500).json({ message: "Erro interno ao deletar o post, entre em contato com o suporte." });
    }
};

module.exports = deletePostId;