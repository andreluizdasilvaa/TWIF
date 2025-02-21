const express = require('express');
const perfilController = require('../controllers/perfilController');
const { auth_user } = require('../middlewares/index');

const router = express.Router();

// retornar todas as informações do usuario que está acessando a rota
router.get('/user/me', auth_user, perfilController.userMe);

// Rota para acessar o perfil pelo usernick
router.get('/api/perfil/:usernick', auth_user, perfilController.userByNick);

// Troca de avatar
router.patch('/api/troca/avatar/:avatar', auth_user, perfilController.replaceAvatar);

module.exports = router;