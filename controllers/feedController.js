const bcrypt = require('bcrypt');
const prisma = require('../models/prisma');

var cookieParser = require('cookie-parser');

exports.posts = async (req, res) => {
    try {
        const userId = req.user.id; // ID do usuário autenticado

        const posts = await prisma.post.findMany({
            include: {
                user: {
                    select: {
                        nome: true,
                        profilePicture: true,
                        usernick: true,
                    },
                },
                comments: true,
                likes: {
                    select: {
                        userId: true,
                    },
                },
            },
            orderBy: [
                {
                    likes: {
                        _count: 'desc',
                    },
                },
                {
                    createdAt: 'desc', // Ordem decrescente pela data de criação
                },
            ],
        });

        // Adiciona o campo 'likedByCurrentUser' em cada post usando um loop for
        for (let i = 0; i < posts.length; i++) {
            const post = posts[i];
            let likedByCurrentUser = false;

            // Itera sobre cada curtida do post para verificar se o usuário curtiu
            for (let j = 0; j < post.likes.length; j++) {
                if (post.likes[j].userId === userId) {
                    likedByCurrentUser = true;
                    break; // Interrompe a busca após encontrar a curtida do usuário
                }
            }

            post.likedByCurrentUser = likedByCurrentUser;
        }

        res.status(200).json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            msg: 'Erro interno ao enviar posts p/Feed, entre em contato com o suporte',
        });
    }
}

exports.searchPostId = async (req, res) => {
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

exports.createPost = async (req, res) => {
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

exports.likedPostOrNot = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id; 

    try {
        // Verifica se o usuário já curtiu a postagem
        const existingLike = await prisma.like.findUnique({
            where: {
                userId_postId: {
                    userId: userId,
                    postId: parseInt(postId),
                },
            },
        });

        if (existingLike) {
            // Se já curtiu, remove a curtida (descurtir)
            await prisma.like.delete({
                where: {
                    id: existingLike.id,
                },
            });
            return res.json({ message: 'Curtida removida' });
        } else {
            // Caso contrário, adiciona uma nova curtida
            await prisma.like.create({
                data: {
                    userId: userId,
                    postId: parseInt(postId),
                },
            });
            return res.json({ message: 'Post curtido' });
        }
    } catch (error) {
        console.error('Erro ao curtir/descurtir post, Erro: ', error);
        res.status(500).json({ message: 'Erro interno ao curtir/descurtir post, entre em contato com o suporte'});
    }
}

exports.deletePostId = async (req, res) => {
    let { idPost } = req.body; // Supondo que o ID do post seja enviado no corpo da requisição

    idPost = parseInt(idPost, 10);

    if (isNaN(idPost)) {
        return res.status(400).json({ message: 'ID do post inválido.' });
    }

    try {
        // Verifica se o post existe
        const post = await prisma.post.findUnique({
            where: {
                id: idPost,
            },
        });

        // Se o post não existir, retorna erro
        if (!post) {
            return res.status(404).json({ message: 'Post não encontrado.' });
        }

        // Verifica se o usuário é o autor do post ou um administrador
        if (post.userId !== req.user.id && !req.user.isadmin) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar este post.' });
        }

        // Deleta comentários e likes associados ao post
        await prisma.comment.deleteMany({
            where: {
                postId: idPost,
            },
        });

        await prisma.like.deleteMany({
            where: {
                postId: idPost,
            },
        });

        // Deleta o post
        await prisma.post.delete({
            where: {
                id: idPost,
            },
        });

        // Retorna sucesso
        res.status(200).json({ message: 'Post deletado com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao deletar o post." });
    }
}