const prisma = require('../../models/prisma');

var cookieParser = require('cookie-parser');

const deletePostId = async (req, res) => {
    let { idPost } = req.body; // Supondo que o ID do post seja enviado no corpo da requisição

    idPost = parseInt(idPost, 10);

    if (isNaN(idPost)) {
        return res.status(400).json({ message: 'ID do post inválido.' });
    }

    try {
        // Verifica se o post existe
        const post = await prisma.post.findUnique({
            where: {
                id: idPost,
            },
        });

        // Se o post não existir, retorna erro
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado.' });
        }

        // Verifica se o usuário é o autor do post ou um administrador
        if (post.userId !== req.user.id && !req.user.isadmin) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar este post.' });
        }

        // Deleta comentários e likes associados ao post
        await prisma.comment.deleteMany({
            where: {
                postId: idPost,
            },
        });

        await prisma.like.deleteMany({
            where: {
                postId: idPost,
            },
        });

        // Deleta o post
        await prisma.post.delete({
            where: {
                id: idPost,
            },
        });

        // Retorna sucesso
        res.status(200).json({ message: 'Post deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao deletar o post." });
    }
}

module.exports = deletePostId;