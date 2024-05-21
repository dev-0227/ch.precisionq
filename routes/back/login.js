const express = require('express');
//const tokenMid = require('../middlewares/tokens');
const controller = require('../../controllers/back/login');

const router = express.Router();

// Get all logs route 
router.post('/login', controller.login);
router.get('/test', controller.test);
router.post('/getsecurity', controller.getsecurity);
router.post('/checksecurity', controller.checksecurity);
router.post('/resetpwdemail', controller.resetpwdemail);
router.post('/updatepwd', controller.updatepwd);
router.post('/updateloginouttime', controller.updateloginouttime);
router.post('/logout', controller.logout);
module.exports = router;