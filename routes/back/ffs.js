const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../../config');
const controller = require('../../controllers/back/ffs');

const storage = multer.diskStorage({
    destination: config.common.uploads,
    filename: (req, file, cb) => {
        cb(null, 'ffs-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).array('ffsfile');

const router = express.Router();

router.post('/ffsloader', (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) {
            controller.ffsloader(req, res, next);
        }
    });
});
router.post('/getins', controller.getins);
router.post('/getdaterange', controller.getdaterange);
router.post('/getfulldaterange', controller.getfulldaterange);
router.post('/getcopaynonpaid', controller.getcopaynonpaid);
router.post('/getinvoicedata', controller.getinvoicedata);
router.post('/payments', controller.payments);
router.post('/sendinvoiceemail', controller.sendinvoiceemail);
router.post('/sendinvoicesms', controller.sendinvoicesms);
router.post('/checksid', controller.checksid);
router.post('/setsid', controller.setsid);
router.post('/getinvoicestatus', controller.getinvoicestatus);
router.post('/getmultibill', controller.getmultibill);
router.post('/getdeductiblereport', controller.getdeductiblereport);

module.exports = router;