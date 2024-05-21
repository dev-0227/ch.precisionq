const express = require('express');
//const tokenMid = require('../middlewares/tokens');
const controller = require('../../controllers/back/manager');

const router = express.Router();

// Get all logs route 
router.get('/', controller.list);
router.post('/add', controller.add);
router.post('/update', controller.update);
router.post('/chosen', controller.chosen);
router.post('/delete', controller.delete);
router.post('/updatepwd', controller.updatepwd);
router.post('/updateanswer', controller.updateanswer);
router.post('/updateclinics', controller.updateclinics);
router.post('/updatehedisdaily', controller.updatehedisdaily);
router.post('/updatehedisncompliant', controller.updatehedisncompliant);

module.exports = router;