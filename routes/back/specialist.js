const express = require('express');
const AuthGuard = require('../../middleware/auth');
const controller = require('../../controllers/back/settings/specialist');

const multer = require('multer');
const config = require('../../config');
const path = require('path');
const storage = multer.diskStorage({
    destination: config.common.uploads,
    filename: (req, file, cb) => {
        cb(null, 'specialist-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).array('specialist_file');

const router = express.Router();

// Get all logs route 
router.get('/', AuthGuard, controller.list);
router.post('/add', AuthGuard, controller.add);
router.post('/update', AuthGuard, controller.update);
router.post('/chosen', AuthGuard, controller.chosen);
router.post('/delete', AuthGuard, controller.delete);
router.post('/updatepwd', AuthGuard, controller.updatepwd);
router.post('/updateanswer', AuthGuard, controller.updateanswer);
router.post('/updateclinics', AuthGuard, controller.updateclinics);
router.post('/getSpecialistByClinic', AuthGuard, controller.getSpecialistByClinic);

router.post('/import', AuthGuard, (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) {
            controller.import(req, res, next);
        }
    });
});

module.exports = router;