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

        // Remove os likes associados ao post
        await prisma.like.deleteMany({
            where: { postId: idPost }
        });

        // Remove os comentários associados ao post
        await prisma.comment.deleteMany({
            where: { postId: idPost }
        });

        // Move o post para a tabela 'PostDeleted'
        await prisma.postDeleted.create({
            data: {
                postId: post.id,
                content: post.content,
                userId: post.userId,
                createdAt: post.createdAt
            },
        });

        // Deleta o post da tabela 'Post'
        await prisma.post.delete({
            where: { id: idPost }
        });

        res.status(200).json({ message: 'Post deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao mover o post para a tabela de deletados." });
    }
};

module.exports = deletePostId;