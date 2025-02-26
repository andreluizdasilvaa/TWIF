const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');
// importação do middleware para verificar a autenticação do token
const { remove_session } = require('../../middlewares/index');

const userByNick = async (req, res) => {
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
}

module.exports = userByNick;