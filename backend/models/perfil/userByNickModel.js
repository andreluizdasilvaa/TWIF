const prisma = require('../prisma');
const createHttpError = require('http-errors');

const userByNickModel = async (usernick, userId, isAdmin) => {
    // Busca o usernick do usuário autenticado
    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { usernick: true },
    });

    if (!currentUser) {
        throw createHttpError(404, "Usuário autenticado não encontrado");
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

        return user;
    }
    throw createHttpError(404, "Usuário não encontrado")
}

module.exports = userByNickModel;