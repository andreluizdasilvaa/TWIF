const prisma = require('../prisma');
const createHttpError = require('http-errors');

const deleteCommentModel = async (commentId, userId, isAdmin) => {
     // Verifica se o comentário existe
     const comment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });

     if (!comment) { createHttpError(404, 'Comentário não encontrado'); }

     // Verifica se o usuário tem permissão para excluir o comentário (mesmo usuário ou admin)
     if (comment.userId !== userId && !isAdmin) {
        createHttpError(403, 'Você não tem permissão para excluir este comentário');
     }

     // Exclui a notificação associada ao comentário
     await prisma.notification.deleteMany({
         where: {
             postId: comment.postId,  // Post relacionado ao comentário
             triggeredById: comment.userId,  // Usuário que fez o comentário
             action: 'comment'  // Tipo de ação (comentário)
         }
     });

     // Exclui o comentário do banco de dados
     await prisma.comment.delete({ where: { id: parseInt(commentId) } });
}

module.exports = deleteCommentModel;