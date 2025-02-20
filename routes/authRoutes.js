const express = require('express');
const router = express.Router();

const loginController = require('../controllers/auth/loginController');
const registerController = require('../controllers/auth/registerController');

router.post('/', loginController);
router.post('/register', registerController);

module.exports = router;