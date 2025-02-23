const prisma = require('../../models/prisma');

var cookieParser = require('cookie-parser');

const searchPostId = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await prisma.post.findUnique({
            where: { id: parseInt(postId) },
            include: {
                user: {
                    select: {
                        nome: true,
                        usernick: true,
                        profilePicture: true,
                    },
                },
            },
        });

        if (!post) {
            return res.status(404).json({ msg: 'Post não encontrado' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Erro ao buscar o post:', error);
        res.status(500).json({ msg: 'Erro ao buscar o post' });
    }
}

module.exports = searchPostId;