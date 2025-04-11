const prisma = require('../../models/prisma');
const listCommentModel = require('../../models/comment/listCommentModel');

const listComment = async (req, res) => {
    const { postId } = req.params;

        if (!postId) {
            return res.status(400).json({ msg: 'ID do post não fornecido' });
        }

        await listCommentModel(postId);

        res.status(200).json(comments);
}

module.exports = listComment;