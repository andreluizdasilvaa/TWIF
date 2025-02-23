const express = require('express');
const router = express.Router();

const { auth_user, auth_admin } = require('../middlewares/index');

const countComment = require('../controllers/relatorio/countCommentController');
const countUser = require('../controllers/relatorio/countUserController');
const countLike = require('../controllers/relatorio/countLikeController');
const countPost = require('../controllers/relatorio/countPostController');
const countAdminsUsers = require('../controllers/relatorio/countAdminsUsersController');

router.get('/comentarios', auth_user, auth_admin, countComment);
router.get('/usuarios', auth_user, auth_admin, countUser);
router.get('/curtidas', auth_user, auth_admin, countLike);
router.get('/posts', auth_user, auth_admin, countPost);
router.get('/usuarios/admins', auth_user, auth_admin, countAdminsUsers);

module.exports = router;