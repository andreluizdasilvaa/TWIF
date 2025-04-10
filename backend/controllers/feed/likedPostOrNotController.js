const toggleLikeModel = require('../../models/feed/toggleLikeModel')
const asyncHandler = require('../../utils/asyncHandler');

const likedPostOrNot = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    // Chama o modelo e obtém a resposta
    const action = await toggleLikeModel(postId, userId);

    // Envia a resposta com base na ação realizada
    return res.status(200).json({
        message: action === 'liked' ? 'Post curtido com sucesso' : 'Curtida removida com sucesso',
    });
});

module.exports = likedPostOrNot;
