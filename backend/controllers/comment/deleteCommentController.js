const deleteCommentModel = require('../../models/comment/deleteCommentModel');
const asyncHandler = require('../../utils/asyncHandler');
const createHttpError = require('http-errors');

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.isadmin;

    await deleteCommentModel(commentId, userId, isAdmin);

    res.status(200).json({ msg: 'Comentário e notificação deletados com sucesso' });
});

module.exports = deleteComment;