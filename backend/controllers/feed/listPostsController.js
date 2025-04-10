const listPostModel = require('../../models/feed/listPostsModel');
const asyncHandler = require('../../utils/asyncHandler');

const posts = asyncHandler(async (req, res) => {
    const userId = req.user.id; // ID do usuário autenticado

    const posts = await listPostModel(userId);

    res.status(200).json(posts);
});

module.exports = posts;