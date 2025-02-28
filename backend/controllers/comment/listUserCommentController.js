const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const listUserComment = async (req, res) => {
    const { userId, postId } = req.params;

    try {
        // Verifica se o usuário está acessando os comentários de um post que pertence a ele
        const userPosts = await prisma.post.findMany({
            where: {
                userId: parseInt(userId), // Verifica se o post pertence ao usuário
                id: parseInt(postId) // Verifica o ID do post
            }
        });

        // Se não houver posts correspondentes, retorna 404
        if (userPosts.length === 0) {
            return res.status(404).json({ msg: 'Post não encontrado ou não pertence ao usuário' });
        }

        // Busca os comentários do post específico
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
            orderBy: { createdAt: 'desc' }, // Ordena os comentários pela data de criação
        });

        res.status(200).json(comments); // Retorna os comentários encontrados
    } catch (error) {
        console.error('Erro ao listar os comentários:', error);
        res.status(500).json({ msg: 'Erro ao listar os comentários' });
    }
}
    
module.exports = listUserComment;