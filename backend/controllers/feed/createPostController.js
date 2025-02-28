const prisma = require('../../models/prisma');

var cookieParser = require('cookie-parser');

const createPost = async (req, res) => {
    const { conteudo } = req.body;

    try {
        if (!conteudo) {
            res.redirect('/feed?error=1');
            return;
        }

        // cadastro no DB
        const post = await prisma.post.create({
            data: {
                content: conteudo,
                userId: req.user.id
            },
        });

        res.status(201).json({msg: "Post criado com sucesso!"});
    } catch (err) {
        console.error('Erro ao criar um Post, Erro: ',err);
        res.status(500).json({ msg: 'Erro interno ao criar um Post, entre em contato com o suporte'});
    };
}

module.exports = createPost;