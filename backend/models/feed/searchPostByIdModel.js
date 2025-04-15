const prisma = require('../../models/prisma');
const createHttpError = require('http-errors');

const searchPostByIdModel = async (postId) => {
    const post = await prisma.post.findUnique({
        where: { id: parseInt(postId) },
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

    if (!post) throw createHttpError(404, 'Post não encontrado');

    return post;
}

module.exports = searchPostByIdModel;