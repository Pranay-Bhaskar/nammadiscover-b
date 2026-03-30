const express = require('express');
const router = express.Router();
const { applyExplorer, getMyApplication, getApplications, reviewApplication, getExplorers } = require('../controllers/explorerController');
const { protect, isAdmin } = require('../middleware/auth');

router.get('/', getExplorers);
router.post('/apply', protect, applyExplorer);
router.get('/my-application', protect, getMyApplication);
router.get('/applications', protect, isAdmin, getApplications);
router.put('/:id/review', protect, isAdmin, reviewApplication);

module.exports = router;
