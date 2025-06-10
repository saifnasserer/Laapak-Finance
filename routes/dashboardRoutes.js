const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// @route   GET api/dashboard
// @desc    Get all dashboard data
// @access  Public
router.get('/', dashboardController.getDashboardData);

module.exports = router;
