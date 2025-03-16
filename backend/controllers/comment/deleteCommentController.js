const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.isadmin;

    try {
        // Verifica se o comentário existe
        const comment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });

        if (!comment) return res.status(404).json({ msg: 'Comentário não encontrado' });

        // Verifica se o usuário tem permissão para excluir o comentário (mesmo usuário ou admin)
        if (comment.userId !== userId && !isAdmin) {
            return res.status(403).json({ msg: 'Você não tem permissão para excluir este comentário' });
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

        res.status(200).json({ msg: 'Comentário e notificação deletados com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Erro ao excluir o comentário e notificação' });
    }
}

module.exports = deleteComment;