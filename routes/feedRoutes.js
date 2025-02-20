const express = require('express');
const feedController = require('../controllers/feedController');
const { auth_user } = require('../middlewares/index');
const { feed } = require('../controllers/pagesController');

const router = express.Router();

// Rota para retornar todos os posts do DB
router.get('/feed/posts', auth_user, feedController.posts); 

// Retorna um post com base no id do post( postId )
router.get('/posts/:postId', feedController.searchPostId);

// Rota para criar um post
router.post('/feed', auth_user, feedController.createPost);

// Rota para curtir/descurtir um post
router.post('/posts/:postId/like', auth_user, feedController.likedPostOrNot);

// Deletar um post do DB com base no id dele
router.delete('/delete/post', auth_user, feedController.deletePostId)

module.exports = router;