const express = require('express');
const router = express.Router();

const { auth_user } = require('../middlewares/index');

const listComment = require('../controllers/comment/listCommentController')
const createComment = require('../controllers/comment/createCommentController')
const deleteComment = require('../controllers/comment/deleteCommentController')

// Rota GET para listar os comentários
router.get('/posts/:postId/comments', auth_user, listComment);

// Rota POST para criar um comentário
router.post('/posts/:postId/comments', auth_user, createComment);

// Rota DELETE para excluir um comentário
router.delete('/feed/posts/:postId/comments/:commentId', auth_user, deleteComment);

module.exports = router;