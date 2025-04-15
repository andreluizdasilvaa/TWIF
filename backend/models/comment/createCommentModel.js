const prisma = require('../prisma');
const createHttpError = require('http-errors');

async function createCommentModel(postId, content, userId) {
    const comment = await prisma.comment.create({
        data: {
            content,
            postId: parseInt(postId),
            userId: userId,
            updatedAt: new Date(),
        },
        include: {
            user: {
                select: {
                    nome: true,
                    usernick: true,
                    profilePicture: true,
                },
            },
        },
    });

    const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
        select: { userId: true },
    });

    if (!post) throw createHttpError(404, 'Post não encontrado');

    const authorId = post.userId;

    if (authorId !== userId) {
        await prisma.notification.create({
            data: {
                userId: authorId,
                triggeredById: userId,
                postId: parseInt(postId),
                action: 'comment',
            },
        });
    }

    return comment;
}

module.exports = createCommentModel;