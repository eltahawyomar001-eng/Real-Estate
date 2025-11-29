const express = require('express');
const router = express.Router();
const { getStats, getAgentStats, getDashboardStats } = require('../controllers/statsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin'), getStats);
router.get('/dashboard', authorize('agent', 'admin'), getDashboardStats);
router.get('/agent', authorize('agent', 'admin'), getAgentStats);

module.exports = router;
