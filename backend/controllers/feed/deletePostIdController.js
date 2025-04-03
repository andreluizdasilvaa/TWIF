const prisma = require('../../models/prisma');
const deletePostModel = require('../../models/feed/deletePostModel')

const deletePostId = async (req, res) => {
    try {
        let { idPost } = req.body;

        await deletePostModel(idPost, req.user);

        res.status(200).json({ message: "Post deletado com sucesso." });
    } catch (error) {
        console.error('Erro ao deletar o post:', error);
        res.status(500).json({ message: "Erro interno ao deletar o post, entre em contato com o suporte." });
    }
};

module.exports = deletePostId;