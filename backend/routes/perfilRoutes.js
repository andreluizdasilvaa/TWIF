const express = require('express');
const router = express.Router();

const { auth_user } = require('../middlewares/index');

const userMe = require('../controllers/perfil/userMeController');
const userByNick = require('../controllers/perfil/userByNickController');
const replaceAvatar = require('../controllers/perfil/replaceAvatarController');

// retornar todas as informações do usuario que está acessando a rota
router.get('/me', auth_user, userMe);

// Rota para acessar o perfil pelo usernick
router.get('/perfil/:usernick', auth_user, userByNick);

// Troca de avatar
router.patch('/troca/avatar/:avatar', auth_user, replaceAvatar);

module.exports = router;