const express = require('express');
const controller = require('../../controllers/back/audit_event');
const router = express.Router();



router.post('/logger', controller.logger);


module.exports = router;