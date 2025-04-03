const prisma = require('../prisma');

const toggleLikeModel = async (postId, userId) => {
    try {
        // Verifica se o usuário já curtiu a postagem
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: parseInt(postId),
                },
            },
        });

        if (existingLike) {
            // Se já curtiu, remove a curtida (descurtir)
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });

            // Remove a notificação correspondente
            await prisma.notification.deleteMany({
                where: {
                    userId: (await prisma.post.findUnique({
                        where: { id: parseInt(postId) },
                        select: { userId: true },
                    })).userId,
                    triggeredById: userId,
                    postId: parseInt(postId),
                    action: 'like',
                },
            });

            return 'unliked'; // Retorna a ação realizada
        } else {
            // Caso contrário, adiciona a curtida
            await prisma.like.create({
                data: {
                    userId: userId,
                    postId: parseInt(postId),
                },
            });

            // Adiciona uma notificação correspondente
            await prisma.notification.create({
                data: {
                    userId: (await prisma.post.findUnique({
                        where: { id: parseInt(postId) },
                        select: { userId: true },
                    })).userId,
                    triggeredById: userId,
                    postId: parseInt(postId),
                    action: 'like',
                },
            });

            return 'liked'; // Retorna a ação realizada
        }
    } catch (error) {
        throw new Error("Erro interno ao curtir/descurtir um post");
    };
};

module.exports = toggleLikeModel;