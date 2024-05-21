const express = require('express');
//const tokenMid = require('../middlewares/tokens');
const controller = require('../../controllers/back/paymentsetting');

const router = express.Router();

// Get all logs route 
router.get('/getgroups', controller.getgroups);
router.get('/getsubgroups', controller.getsubgroups);
router.post('/getexclusion', controller.getexclusion);
router.post('/setexclusion', controller.setexclusion);
router.post('/setmultisearchparams', controller.setmultisearchparams);
router.post('/getmultisearchparams', controller.getmultisearchparams);

//Group Area
router.post('/addgroup', controller.addgroup);
router.post('/updategroup', controller.updategroup);
router.post('/chosengroup', controller.chosengroup);
router.post('/deletegroup', controller.deletegroup);

//Subgroup Area
router.post('/addsubgroup', controller.addsubgroup);
router.post('/updatesubgroup', controller.updatesubgroup);
router.post('/chosensubgroup', controller.chosensubgroup);
router.post('/deletesubgroup', controller.deletesubgroup);

module.exports = router;