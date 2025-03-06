const express = require('express');
const router = express.Router();

const loginController = require('../controllers/auth/loginController');
const registerController = require('../controllers/auth/registerController');
const removeSessionController = require('../controllers/auth/removeSessionController');

router.post('/login', loginController);
router.post('/register', registerController);
router.delete('/logout', removeSessionController);

module.exports = router;