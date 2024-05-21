const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('../../config');
const controller = require('../../controllers/back/patientlist');
const AuthGuard = require('../../middleware/auth');

const storage = multer.diskStorage({
    destination: config.common.uploads,
    filename: (req, file, cb) => {
        cb(null, 'patientlist-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).array('ptfile');

const router = express.Router();

router.post('/ptloader', (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) {
            controller.ptloader(req, res, next);
        }
    });
});
router.post('/getData', AuthGuard,  controller.getData);
router.post('/getDataByPage', AuthGuard,  controller.getDataByPage);
router.get('/getLanguages', AuthGuard, controller.getLanguages);
router.get('/getRace', AuthGuard, controller.getRace);
router.get('/getEthnicity', AuthGuard, controller.getEthnicity);
router.get('/getMarital', AuthGuard, controller.getMarital);
router.post('/getTotal', AuthGuard, controller.getTotal);
router.post('/setValue', AuthGuard, controller.setValue);
router.post('/delete', AuthGuard, controller.delete);
router.post('/get', AuthGuard, controller.get);
router.post('/add', AuthGuard, controller.add);
router.post('/update', AuthGuard, controller.update);
router.post('/search', AuthGuard, controller.search);
module.exports = router;