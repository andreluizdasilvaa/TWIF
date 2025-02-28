const express = require('express');
const pagesController = require('../controllers/pagesController');
const { auth_user, auth_admin, } = require('../middlewares/index');

const router = express.Router();

router.get('/', pagesController.homeLogin);
router.get('/register', pagesController.register);
router.get('/suporte', pagesController.support);
router.get('/sobrenos', pagesController.about_us);

router.get('/feed', auth_user, pagesController.feed);
router.get('/perfil/:usernick', auth_user, pagesController.userProfile);
router.get('/comments', auth_user, pagesController.comments);
router.get('/relatorios', auth_user, auth_admin, pagesController.relatorios);

router.get('/user404', pagesController.userPage404);
router.get('/notaccess', pagesController.semAcesso);
router.get('*', pagesController.notfound);

module.exports = router;