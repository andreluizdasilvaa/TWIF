const prisma = require('../../models/prisma');
var cookieParser = require('cookie-parser');

const deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.isadmin;
  
    try {
      const comment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });
  
      if (!comment) return res.status(404).json({ msg: 'Comentário não encontrado' });
  
      if (comment.userId !== userId && !isAdmin) {
        return res.status(403).json({ msg: 'Você não tem permissão para excluir este comentário' });
      }
  
      await prisma.comment.delete({ where: { id: parseInt(commentId) } });
  
      res.status(200).json({ msg: 'Comentário deletado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Erro ao excluir o comentário' });
    }
}

module.exports = deleteComment;