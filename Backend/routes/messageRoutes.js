const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const router = express.Router();
const {sendMessage, allMessages} = require('../controllers/messageControllers.js');

router.route('/').post(protect,sendMessage);
router.route('/:chatId').get(protect,allMessages);

module.exports = router;