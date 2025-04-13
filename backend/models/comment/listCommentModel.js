const prisma = require('../prisma');

const listCommentModel = async (postId) => {
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
        orderBy: { createdAt: 'desc' },
    });
    return comments;
}
module.exports = listCommentModel;