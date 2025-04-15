const prisma = require('../prisma');
const createHttpError = require('http-errors');

const deletePostModel = async (idPost, user) => {
    idPost = parseInt(idPost, 10);

    if (isNaN(idPost)) {
        throw createHttpError(400, 'ID do post inválido.');
    }

    // Verifica se o post existe
    const post = await prisma.post.findUnique({
        where: { id: idPost }
    });

    if (!post) {
        throw createHttpError(404, 'Post não encontrado.');
    }

    // Verifica permissão do usuário
    if (post.userId !== user.id && !user.isadmin) {
        throw createHttpError(403, 'Você não tem permissão para deletar este post.');
    }

    // Move o post para a tabela 'PostDeleted'
    const postDeleted = await prisma.postdeleted.create({
        data: {
            postId:     post.id,
            content:    post.content,
            userId:     post.userId,
            createdAt:  post.createdAt
        },
    });

    // Se um Administrador deletar o post de OUTRO usuário, cria a notificação
    if (user.isadmin && post.userId !== user.id) {
        await prisma.notification.create({
            data: {
                userId:         post.userId, // Dono do post que será notificado
                triggeredById:  user.id, // Administrador que deletou o post
                postDeletedId:  postDeleted.id, // Referência ao post deletado
                action:         "postDeleteByAdm",
                createdAt:      new Date()
            }
        });
    }

    await prisma.notification.deleteMany({
        where: { postId: idPost }
    });

    await prisma.comment.deleteMany({
        where: { postId: idPost }
    });

    await prisma.like.deleteMany({
        where: { postId: idPost }
    });

    await prisma.post.delete({
        where: { id: idPost }
    });
}

module.exports = deletePostModel;