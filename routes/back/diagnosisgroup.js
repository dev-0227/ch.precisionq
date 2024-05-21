const express = require('express');
//const tokenMid = require('../middlewares/tokens');
const controller = require('../../controllers/back/diagnosisgroup');

const router = express.Router();

// Get all logs route 
router.get('/', controller.list);
router.post('/add', controller.add);
router.post('/update', controller.update);
router.post('/chosen', controller.chosen);
router.post('/delete', controller.delete);
router.get('/ref', controller.ref);

module.exports = router;