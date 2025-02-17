const express = require('express');
const feedController = require('../controllers/feedController');
const { auth_user } = require('../middlewares/index');

const router = express.Router();

router.get('/feed/posts', auth_user, feedController.posts); 

module.exports = router;