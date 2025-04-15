const listCommentModel = require('../../models/comment/listCommentModel');
const asyncHandler = require('../../utils/asyncHandler');
const createHttpError = require('http-errors');

const listComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId) throw createHttpError(400, 'ID do post não fornecido');
    
    const comments = await listCommentModel(postId);

    res.status(200).json(comments);
})

module.exports = listComment;