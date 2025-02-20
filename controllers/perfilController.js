const prisma = require('../models/prisma');
var cookieParser = require('cookie-parser');
// importação do middleware para verificar a autenticação do token
const { remove_session } = require('../middlewares/index');

exports.userMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }, // Usa o userId do token
            select: { id: true, nome: true, profilePicture: true, usernick: true, isadmin: true },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('Usuário não encontrado');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar o usuário');
    };
};

exports.userByNick = async (req, res) => {
    const { usernick } = req.params;
    const userId = req.user.id; // ID do usuário autenticado
    const isAdmin = req.user.isadmin;

    try {
        // Busca o usernick do usuário autenticado
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { usernick: true },
        });

        if (!currentUser) {
            return res.status(404).json({ message: 'Usuário autenticado não encontrado' });
        }

        // Define a flag `isCurrentUser` comparando o usernick da URL com o usernick do usuário logado
        const isCurrentUser = currentUser.usernick === usernick;

        // Busca o perfil do usuário acessado
        const user = await prisma.user.findUnique({
            where: { usernick: usernick },
            select: {
                nome: true,
                profilePicture: true,
                usernick: true,
                isadmin: true,
                posts: {
                    select: {
                        id: true,
                        content: true,
                        createdAt: true,
                        comments: true,
                        likes: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                },
            },
        });


        if (user) {
            user.isCurrentUser = isCurrentUser; // Adiciona a flag `isCurrentUser`
            user.my_user_admin = isAdmin; // Adiciona a flag 'isadmin' para permissão de adm
            
            // Adiciona o campo `likedByCurrentUser` em cada post
            for (let post of user.posts) {
                post.likedByCurrentUser = post.likes.some(like => like.userId === userId);
            }

            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar o usuário' });
    };
};

exports.removeSession = (req, res) => {
    try {
        remove_session(req, res);
    } catch (error) {
        console.error('Erro ao encerrar sessão do user, Erro: ', error);
        res.status(500).json({ message: 'Erro interno ao encerrar sessão, entre em contato com o suporte'});
    }
}

exports.replaceAvatar = async (req, res) => {
    try {
        const url_profile_picture = req.params.avatar;
        const userId = req.user.id;

        const user = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                profilePicture: url_profile_picture
            }
        })

        if(!user) {
            res.json({ msg: "Erro ao atualizar profile picture" })
        }

        res.status(201).json({ msg: "Sucesso ao atualizar profile picture" })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao atualizar foto de perfil." });
    }
}
