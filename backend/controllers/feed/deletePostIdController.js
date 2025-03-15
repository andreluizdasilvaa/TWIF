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
            include: {
                likes: true,  // Certifique-se de incluir os likes e comentários
                comments: true,
            }
        });

        // Se o post não existir, retorna erro
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado.' });
        }

        // Verifica se o usuário é o autor do post ou um administrador
        if (post.userId !== req.user.id && !req.user.isadmin) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar este post.' });
        }

        // Verifica se 'likes' e 'comments' existem e são arrays antes de usar o map()
        const likes = post.likes || [];  // Fallback para um array vazio se não houver likes
        const comments = post.comments || [];  // Fallback para um array vazio se não houver comentários

        // Cria o post na tabela 'PostDeleted'
        await prisma.postDeleted.create({
            data: {
                content: post.content,
                userId: post.userId,
                createdAt: post.createdAt,
                likes: {
                    create: likes.map(like => ({
                        userId: like.userId,
                    })),
                },
                comments: {
                    create: comments.map(comment => ({
                        content: comment.content,
                        userId: comment.userId,
                        createdAt: comment.createdAt,
                    })),
                },
            },
        });

        // Deleta comentários e likes associados ao post original
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

        // Remove o post da tabela 'Post'
        await prisma.post.delete({
            where: {
                id: idPost,
            },
        });

        res.status(200).json({ message: 'Post deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao mover o post para a tabela de deletados." });
    }
}

module.exports = deletePostId;