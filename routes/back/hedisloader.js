const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../../config');
const controller = require('../../controllers/back/hedisloader');

const storage = multer.diskStorage({
    destination: config.common.uploads,
    filename: (req, file, cb) => {
        cb(null, 'statment-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).array('qualityfile');

const encupload = multer({
    storage: storage
}).array('encfile');
const labupload = multer({
    storage: storage
}).array('labfile');
const vaccineupload = multer({
    storage: storage
}).array('vaccinefile');
const prevnextupload = multer({
    storage: storage
}).array('prevnextfile');

const router = express.Router();

// Get all logs route 
router.post('/tmpqualityloader', (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) {
            controller.tmpqualityloader(req, res, next);
        }
    });
});
router.post('/qualityloader', (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) {
            controller.qualityloader(req, res, next);
        }
    });
});
router.post('/encloader', (req, res, next) => {
    encupload(req, res, (err) => {
        if (!err) {
            controller.encloader(req, res, next);
        }
    });
});
router.post('/labloader', (req, res, next) => {
    labupload(req, res, (err) => {
        if (!err) {
            controller.labloader(req, res, next);
        }
    });
});
router.post('/prevnextloader', (req, res, next) => {
    prevnextupload(req, res, (err) => {
        if (!err) {
            controller.prevnextloader(req, res, next);
        }
    });
});
router.post('/vaccineloader', (req, res, next) => {
    vaccineupload(req, res, (err) => {
        if (!err) {
            controller.vaccineloader(req, res, next);
        }
    });
});
router.post('/deletedata', controller.deletedata);
router.post('/getbackup', controller.getbackup);
router.post('/deletebackup', controller.deletebackup);
router.post('/backuphedis', controller.backuphedis);
router.post('/backupdatafromhedis', controller.backupdatafromhedis);
router.post('/checkhedisdata', controller.checkhedisdata);

module.exports = router;