const express = require('express');
const controller = require('../../controllers/back/settings/vital');
const router = express.Router();
const AuthGuard = require('../../middleware/auth');

// Get all logs route 
router.get('/', AuthGuard, controller.list);
router.post('/add', AuthGuard, controller.add);
router.post('/chosen', AuthGuard, controller.chosen);
router.post('/update', AuthGuard, controller.update);
router.post('/delete', AuthGuard, controller.delete);

module.exports = router;