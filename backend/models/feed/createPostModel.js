const prisma = require('../prisma');

const createPostModel = async (conteudo, userId) => {
    return await prisma.post.create({
        data: {
            content: conteudo,
            userId: userId
        },
    });
};

module.exports = createPostModel;