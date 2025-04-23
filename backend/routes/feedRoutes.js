const express = require('express');
const router = express.Router();

const { auth_user } = require('../middlewares/index');

const posts = require('../controllers/feed/listPostsController')
const searchPostId = require('../controllers/feed/searchPostIdController')
const createPost = require('../controllers/feed/createPostController')
const likedPostOrNot = require('../controllers/feed/likedPostOrNotController')
const deletePostId = require('../controllers/feed/deletePostIdController')


// Rota para retornar todos os posts do DB
router.get('/posts', auth_user, posts); 

// Retorna um post com base no id do post( postId )
router.get('/posts/:postId', searchPostId);

// Rota para criar um post
router.post('/create/post', auth_user, createPost);

// Rota para curtir/descurtir um post
router.post('/posts/:postId/like', auth_user, likedPostOrNot);

// Deletar um post do DB com base no id dele
router.delete('/delete/post', auth_user, deletePostId);

module.exports = router;