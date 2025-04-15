const searchPostByIdModel = require('../../models/feed/searchPostByIdModel');
const asyncHandler = require('../../utils/asyncHandler');
const createHttpError = require('http-errors');

const searchPostId = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId || isNaN(postId)) {
        throw createHttpError(400, "Invalid postId");
    }

    const post = await searchPostByIdModel(postId);

    res.status(200).json(post);
});

module.exports = searchPostId;