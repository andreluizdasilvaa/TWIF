const prisma = require('../../models/prisma');

const likedPostOrNot = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

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
                    })).userId, // Dono do post que receberia a notificação
                    triggeredById: userId,
                    postId: parseInt(postId),
                    action: 'like',
                },
            });

            return res.json({ message: 'Curtida removida' });
        } else {
            // Caso contrário, adiciona uma nova curtida
            await prisma.like.create({
                data: {
                    userId: userId,
                    postId: parseInt(postId),
                },
            });

            // Cria uma notificação para o dono do post
            const postOwner = await prisma.post.findUnique({
                where: { id: parseInt(postId) },
                select: { userId: true },
            });

            if (postOwner) {
                if (postOwner.userId !== userId) { // Evita notificar a si mesmo
                    await prisma.notification.create({
                        data: {
                            userId: postOwner.userId, // Dono do post que recebe a notificação
                            triggeredById: userId, // Quem curtiu
                            postId: parseInt(postId),
                            action: 'like',
                        },
                    });
                    return res.json({ message: 'Post curtido' });
                } else {
                    return res.json({ message: 'Post curtido' });
                }
            } else {
                return res.status(404).json({ message: 'Post não encontrado para curtir' });
            }
        }
    } catch (error) {
        console.error('Erro ao curtir/descurtir post. Erro: ', error);
        return res.status(500).json({ message: 'Erro interno ao curtir/descurtir post, entre em contato com o suporte' });
    }
};

module.exports = likedPostOrNot;
