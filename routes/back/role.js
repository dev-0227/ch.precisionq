const express = require('express');
const controller = require('../../controllers/back/settings/role');
const AuthGuard = require('../../middleware/auth');
const router = express.Router();

// Get all logs route 
router.get('/', AuthGuard, controller.list);
router.post('/add', AuthGuard, controller.add);
router.post('/chosen', AuthGuard, controller.chosen);
router.post('/getPermission', AuthGuard, controller.getPermission);
router.post('/update', AuthGuard, controller.update);
router.post('/delete', AuthGuard, controller.delete);

module.exports = router;