const createPostModel = require('../../models/feed/createPostModel');
const asyncHandler = require('../../utils/asyncHandler');

const createPost = asyncHandler(async (req, res) => {
    const { conteudo } = req.body;
    const userId = req.user.id;

    if (!conteudo) {
        res.redirect('/feed?error=1');
        return;
    };

    await createPostModel(conteudo, userId);

    res.status(201).json({msg: "Post criado com sucesso!"});
});

module.exports = createPost;