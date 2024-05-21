const express = require('express');
//const tokenMid = require('../middlewares/tokens');
const controller = require('../../controllers/back/paid');

const router = express.Router();

// Get all logs route 
router.get('/getdesc', controller.getdesc);
router.get('/getgroups', controller.getgroups);
router.get('/getclinicspec', controller.getclinicspec);
router.post('/getins', controller.getins);
router.post('/getdaterange', controller.getdaterange);

router.post('/getInsamount', controller.getInsamount);
router.post('/getVisitsPTs', controller.getVisitsPTs);
router.post('/getBestCPT', controller.getBestCPT);
router.post('/getTotalvisitpts', controller.getTotalvisitpts);
router.post('/getGroupamount', controller.getGroupamount);
router.post('/getsubGroupamount', controller.getsubGroupamount);

router.post('/gettopins', controller.gettopins);
router.post('/gettopinsclaim', controller.gettopinsclaim);
router.post('/gettopinspts', controller.gettopinspts);
router.post('/getavgpcppayment', controller.getavgpcppayment);
router.post('/getpcppts', controller.getpcppts);
router.post('/getprenpvisits', controller.getprenpvisits);
router.post('/getinsbypcp', controller.getinsbypcp);
router.post('/gettoppatients', controller.gettoppatients);
router.post('/getbestinsareas', controller.getbestinsareas);

router.post('/getpcpview', controller.getpcpview);

router.post('/getcptsbyins', controller.getcptsbyins);

router.post('/getcptinsbill', controller.getcptinsbill);

router.post('/getsuperbill', controller.getsuperbill);

module.exports = router;