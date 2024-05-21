const express = require('express');
const multer = require('multer');
const controller = require('../../controllers/back/settings/clinic');
const path = require('path');
const config = require('../../config');
const router = express.Router();
const AuthGuard = require('../../middleware/auth');

const storage = multer.diskStorage({
    destination: config.common.uploads+"logos/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).array('logo');

// Get all logs route 
router.get('/', AuthGuard, controller.list);
router.post('/add', AuthGuard, controller.add);
router.post('/update', AuthGuard, controller.update);
router.post('/chosen', AuthGuard, controller.chosen);
router.post('/delete',AuthGuard,  controller.delete);
router.post('/updatewebcheck', AuthGuard, controller.updatewebcheck);
router.post('/updateportalcheck', AuthGuard, controller.updateportalcheck);
router.post('/updatecontactcheck', AuthGuard, controller.updatecontactcheck);
router.post('/updateapcheck', AuthGuard, controller.updateapcheck);
router.post('/getclinicmanagers', AuthGuard, controller.getclinicmanagers);
router.post('/addclinicmanagers', AuthGuard, controller.addclinicmanagers);
router.post('/chosenclinicmanagers', AuthGuard, controller.chosenclinicmanagers);
router.post('/updateVCard', AuthGuard, controller.updateVCard);
router.post('/uploadlogo', (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) {
            res.status(200).json({ data: req.files[0].path });
        }
    });
});

module.exports = router;