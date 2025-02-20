const express = require('express');
const commentController = require('../controllers/commentController');
const { auth_user } = require('../middlewares/index');

const router = express.Router();

// Rota GET para listar os comentários
router.get('/posts/:postId/comments', auth_user, commentController.listComment);

// Rota GET para listar os comentários de um post específico a partir do perfil do usuário
router.get('/users/:userId/posts/:postId/comments', auth_user, commentController.listUserComment);

// Rota POST para criar um comentário
router.post('/posts/:postId/comments', auth_user, commentController.createComment);

// Rota DELETE para excluir um comentário
router.delete('/feed/posts/:postId/comments/:commentId', auth_user, commentController.deleteComment);

module.exports = router;