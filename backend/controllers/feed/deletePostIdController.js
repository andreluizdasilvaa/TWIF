const deletePostModel = require('../../models/feed/deletePostModel');
const asyncHandler = require('../../utils/asyncHandler');

const deletePostId = asyncHandler(async (req, res) => {
    let { idPost } = req.body;

    await deletePostModel(idPost, req.user);

    res.status(200).json({ message: "Post deletado com sucesso." });
});

module.exports = deletePostId;