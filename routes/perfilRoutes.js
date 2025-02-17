const express = require('express');
const perfilController = require('../controllers/perfilController');
const { auth_user } = require('../middlewares/index');

const router = express.Router();

router.get('/user/me', auth_user, perfilController.userMe);
router.get('/api/perfil/:usernick', auth_user, perfilController.userByNick)

module.exports = router;