const createPostModel = require('../../models/feed/createPostModel');
const asyncHandler = require('../../utils/asyncHandler');

const createPost = asyncHandler(async (req, res, next) => {
        const { conteudo } = req.body;

        if (!conteudo) {
            res.redirect('/feed?error=1');
            return;
        };

        await createPostModel(conteudo, req.user.id);

        res.status(201).json({msg: "Post criado com sucesso!"});
});

module.exports = createPost;