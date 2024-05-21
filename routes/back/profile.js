const express = require('express');
//const tokenMid = require('../middlewares/tokens');
const controller = require('../../controllers/back/profile');

const router = express.Router();

// Get all logs route 
router.get('/');
router.post('/update', controller.update);
router.post('/chosen', controller.chosen);
router.post('/updatepwd', controller.updatepwd);
router.post('/updateanswer', controller.updateanswer);

module.exports = router;