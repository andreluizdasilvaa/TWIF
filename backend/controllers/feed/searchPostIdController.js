const searchPostByIdModel = require('../../models/feed/searchPostByIdModel');
const asyncHandler = require('../../utils/asyncHandler');

const searchPostId = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    const post = await searchPostByIdModel(postId);

    res.status(200).json(post);
});

module.exports = searchPostId;