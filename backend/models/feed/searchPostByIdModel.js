const prisma = require('../../models/prisma');

const searchPostByIdModel = async (postId) => {
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
}

module.exports = searchPostByIdModel;