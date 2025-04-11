const createCommentModel = require('../../models/comment/createCommentModel')
const createHttpError = require('http-errors');
const asyncHandler = require('../../utils/asyncHandler');

const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === '') {
        createHttpError(400, 'O comentário não pode estar vazio');
    }

    const comment = await createCommentModel(postId, content, userId);
    res.status(201).json(comment);
});

module.exports = createComment;