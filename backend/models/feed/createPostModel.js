const prisma = require('../prisma');
const createHttpError = require('http-errors');

const createPostModel = async (conteudo, userId) => {
    if (!conteudo || !userId) {
        throw createHttpError(400, 'Conteúdo e ID do usuário são obrigatórios.');
    }

    const post = await prisma.post.create({
        data: {
            content: conteudo,
            userId: userId
        },
    });

    return post;
};

module.exports = createPostModel;