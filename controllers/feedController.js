const bcrypt = require('bcrypt');
const prisma = require('../models/prisma');

var cookieParser = require('cookie-parser');

exports.posts = async (req, res) => {
    try {
        const userId = req.user.id; // ID do usuário autenticado

        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: {
                        nome: true,
                        profilePicture: true,
                        usernick: true,
                    },
                },
                comments: true,
                likes: {
                    select: {
                        userId: true,
                    },
                },
            },
            orderBy: [
                {
                    likes: {
                        _count: 'desc',
                    },
                },
                {
                    createdAt: 'desc', // Ordem decrescente pela data de criação
                },
            ],
        });

        // Adiciona o campo 'likedByCurrentUser' em cada post usando um loop for
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            let likedByCurrentUser = false;

            // Itera sobre cada curtida do post para verificar se o usuário curtiu
            for (let j = 0; j < post.likes.length; j++) {
                if (post.likes[j].userId === userId) {
                    likedByCurrentUser = true;
                    break; // Interrompe a busca após encontrar a curtida do usuário
                }
            }

            post.likedByCurrentUser = likedByCurrentUser;
        }

        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Erro interno ao enviar posts p/Feed, entre em contato com o suporte',
        });
    }
}