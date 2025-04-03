const prisma = require('../prisma');

const createPostModel = async (conteudo, userId) => {
    if (!conteudo || !userId) {
        throw new Error('Conteúdo e ID do usuário são obrigatórios.');
    }

    throw new Error('Erro simulado ao criar postagem no banco de dados.');

    const post = await prisma.post.create({
        data: {
            content: conteudo,
            userId: userId
        },
    });


    return post;
};

module.exports = createPostModel;