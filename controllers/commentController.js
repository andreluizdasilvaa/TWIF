const prisma = require('../models/prisma');

var cookieParser = require('cookie-parser');

exports.listComment = async (req, res) => {
    const { postId } = req.params;

    try {
        const comments = await prisma.comment.findMany({
            where: { postId: parseInt(postId) },
            include: {
                user: {
                    select: {
                        id: true,   
                        nome: true,
                        usernick: true,
                        profilePicture: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error('Erro ao listar os comentários:', error);
        res.status(500).json({ msg: 'Erro ao listar os comentários' });
    }
}

exports.listUserComment = async (req, res) => {
    const { userId, postId } = req.params;

    try {
        // Verifica se o usuário está acessando os comentários de um post que pertence a ele
        const userPosts = await prisma.post.findMany({
            where: {
                userId: parseInt(userId), // Verifica se o post pertence ao usuário
                id: parseInt(postId) // Verifica o ID do post
            }
        });

        // Se não houver posts correspondentes, retorna 404
        if (userPosts.length === 0) {
            return res.status(404).json({ msg: 'Post não encontrado ou não pertence ao usuário' });
        }

        // Busca os comentários do post específico
        const comments = await prisma.comment.findMany({
            where: { postId: parseInt(postId) },
            include: {
                user: {
                    select: {
                        id: true,
                        nome: true,
                        usernick: true,
                        profilePicture: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' }, // Ordena os comentários pela data de criação
        });

        res.status(200).json(comments); // Retorna os comentários encontrados
    } catch (error) {
        console.error('Erro ao listar os comentários:', error);
        res.status(500).json({ msg: 'Erro ao listar os comentários' });
    }
}

exports.createComment = async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;

    try {
        if (!content || content.trim() === '') {
            return res.status(400).json({ msg: 'O comentário não pode estar vazio' });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: parseInt(postId),
                userId: req.user.id,
            },
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

        res.status(201).json(comment);
    } catch (error) {
        console.error('Erro ao criar comentário:', error);
        res.status(500).json({ msg: 'Erro ao criar o comentário' });
    }
}

exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.isadmin;
  
    try {
      const comment = await prisma.comment.findUnique({ where: { id: parseInt(commentId) } });
  
      if (!comment) return res.status(404).json({ msg: 'Comentário não encontrado' });
  
      if (comment.userId !== userId && !isAdmin) {
        return res.status(403).json({ msg: 'Você não tem permissão para excluir este comentário' });
      }
  
      await prisma.comment.delete({ where: { id: parseInt(commentId) } });
  
      res.status(200).json({ msg: 'Comentário deletado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Erro ao excluir o comentário' });
    }
}