const express = require('express');
const { saveSession, getSessions } = require('../controllers/sessionController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, saveSession).get(protect, getSessions);

module.exports = router;
