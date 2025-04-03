const prisma = require('../prisma');

const deletePostModel = async (idPost, user) => {
    try {
        idPost = parseInt(idPost, 10);

        if (isNaN(idPost)) {
            throw new Error('ID do post inválido.');
        }

        // Verifica se o post existe
        const post = await prisma.post.findUnique({
            where: { id: idPost }
        });

        if (!post) {
            throw new Error('Post não encontrado.');
        }

        // Verifica permissão do usuário
        if (post.userId !== user.id && !user.isadmin) {
            throw new Error('Você não tem permissão para deletar este post.');
        }

        // Move o post para a tabela 'PostDeleted'
        const postDeleted = await prisma.postDeleted.create({
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

    } catch (error) {
        throw new Error("Erro interno ao deletar um post");
    }
}

module.exports = deletePostModel;