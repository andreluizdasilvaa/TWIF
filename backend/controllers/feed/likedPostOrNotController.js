const prisma = require('../../models/prisma');
const toggleLikeModel = require('../../models/feed/toggleLikeModel')

const likedPostOrNot = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        // Chama o modelo e obtém a resposta
        const action = await toggleLikeModel(postId, userId);

        // Envia a resposta com base na ação realizada
        return res.status(200).json({
            message: action === 'liked' ? 'Post curtido com sucesso' : 'Curtida removida com sucesso',
        });

    } catch (error) {
        console.error('Erro ao curtir/descurtir post. Erro: ', error);
        return res.status(500).json({ message: 'Erro interno ao curtir/descurtir post, entre em contato com o suporte' });
    }
};

module.exports = likedPostOrNot;
