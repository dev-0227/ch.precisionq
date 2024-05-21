const express = require('express');
const multer = require('multer');
const config = require('../../config');
const path = require('path');
const AuthGuard = require('../../middleware/auth');
const controller = require('../../controllers/back/hedissetting');

const storage = multer.diskStorage({
    destination: config.common.uploads,
    filename: (req, file, cb) => {
        cb(null, 'qpp-measures-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
}).array('qppfile');

const router = express.Router();

// Get all logs route 
router.get('/');
router.get('/gethdomain', controller.gethdomain);
router.post('/addhdomain', controller.addhdomain);
router.post('/updatehdomain', controller.updatehdomain);
router.post('/chosenhdomain', controller.chosenhdomain);
router.post('/deletehdomain', controller.deletehdomain);

router.get('/getmeasure', controller.getmeasure);
router.post('/addmeasure', controller.addmeasure);
router.post('/updatemeasure', controller.updatemeasure);
router.post('/chosenmeasure', controller.chosenmeasure);
router.post('/deletemeasure', controller.deletemeasure);
router.post('/updateoutcome', controller.updateoutcome);
router.post('/updatemeasureyearly', controller.updatemeasureyearly);
router.post('/getoutranges', controller.getoutranges);
router.post('/addoutrangevalue', controller.addoutrangevalue);
router.post('/deleteoutrangevalue', controller.deleteoutrangevalue);


router.get('/getcim', controller.getcim);
router.post('/addcim', controller.addcim);
router.post('/updatecim', controller.updatecim);
router.post('/chosencim', controller.chosencim);
router.post('/deletecim', controller.deletecim);
router.post('/updatecimrange', controller.updatecimrange);
router.post('/getcimranges', controller.getcimranges);
router.post('/addcimrangevalue', controller.addcimrangevalue);
router.post('/deletecimrangevalue', controller.deletecimrangevalue);


router.get('/gethdate', controller.gethdate);
router.post('/updatehdate', controller.updatehdate);

router.get('/getcolor', controller.getcolor);
router.post('/addcolor', controller.addcolor);
router.post('/updatecolor', controller.updatecolor);
router.post('/chosencolor', controller.chosencolor);
router.post('/deletecolor', controller.deletecolor);


router.get('/getimeasure', controller.getimeasure);
router.post('/addimeasure', controller.addimeasure);
router.post('/updateimeasure', controller.updateimeasure);
router.post('/chosenimeasure', controller.chosenimeasure);
router.post('/deleteimeasure', controller.deleteimeasure);

router.get('/getnmeasure', controller.getnmeasure);
router.post('/deletenmeasure', controller.deletenmeasure);
router.post('/applymeasure', controller.applymeasure);

router.get('/getmtime', controller.getmtime);
router.post('/addmtime', controller.addmtime);
router.post('/updatemtime', controller.updatemtime);
router.post('/chosenmtime', controller.chosenmtime);
router.post('/deletemtime', controller.deletemtime);

router.get('/getfilenames', controller.getfilenames);
router.post('/addfilename', controller.addfilename);
router.post('/deletefilename', controller.deletefilename);
router.post('/chosenfilename', controller.chosenfilename);
router.post('/updatefilename', controller.updatefilename);
router.post('/getfieldlists', controller.getfieldlists);
router.post('/addfield', controller.addfield);
router.post('/deletefield', controller.deletefield);
router.post('/editfield', controller.editfield);
router.post('/updatefield', controller.updatefield);
router.post('/setPosfield', controller.setPosfield);
router.get('/getfilealiases', controller.getfilealiases);
router.post('/updatefilealiases', controller.updatefilealiases);
router.get('/getidomain', controller.getidomain);
router.post('/addidomain', controller.addidomain);
router.post('/updateidomain', controller.updateidomain);
router.post('/chosenidomain', controller.chosenidomain);
router.post('/deleteidomain', controller.deleteidomain);
router.get('/qppMeasuresData', AuthGuard, controller.qppMeasuresData);
router.post('/qppMeasuresDataById', AuthGuard, controller.qppMeasuresDataById);
router.post('/getYearsQppMeasuresData', AuthGuard, controller.getYearsQppMeasuresData);

router.get('/measuresData', AuthGuard, controller.measuresData);
router.post('/measuresDataById', AuthGuard, controller.measuresDataById);
router.post('/addMeasureaData', AuthGuard, controller.addMeasureaData);
router.post('/updateMeasureaData', AuthGuard, controller.updateMeasureaData);
router.post('/deleteMeasureaData', AuthGuard, controller.deleteMeasureaData);
router.post('/importMeasuresData', AuthGuard, controller.importMeasuresData);


router.get('/getMeasureObservation', AuthGuard, controller.getMeasureObservation);
router.post('/getMeasureObservationById', AuthGuard, controller.getMeasureObservationById);
router.post('/getMeasureObservationByMeasure', AuthGuard, controller.getMeasureObservationByMeasure);
router.post('/addMeasureObservation', AuthGuard, controller.addMeasureObservation);
router.post('/updateMeasureObservation', AuthGuard, controller.updateMeasureObservation);
router.post('/deleteMeasureObservation', AuthGuard, controller.deleteMeasureObservation);
router.post('/csCalendarCycle', AuthGuard, controller.csCalendarCycle);
router.post('/vsPublicationState', AuthGuard, controller.vsPublicationState);
router.post('/vsJurisdiction', AuthGuard, controller.vsJurisdiction);
router.post('/vsObservationCategory', AuthGuard, controller.vsObservationCategory);
router.post('/vsSpecimenType', AuthGuard, controller.vsSpecimenType);
router.post('/vsPermittedDataType', AuthGuard, controller.vsPermittedDataType);


router.post('/importQppMeasuresData', AuthGuard, (req, res, next) => {
    upload(req, res, (err) => {
        if (!err) {
            controller.importQppMeasuresData(req, res, next);
        }
    });
});

router.get('/getstatusreason', controller.getstatusreason);
router.get('/getstatuscode', controller.getstatuscode);
router.get('/getcategorycode', controller.getcategorycode);
router.get('/gettopiccode', controller.gettopiccode);
router.get('/getmediumcode', controller.getmediumcode);
router.get('/getprioritycode', controller.getprioritycode);
router.get('/getedcategorycode', controller.getedcategorycode);
router.get('/getcomcategorycode', controller.getcomcategorycode);


module.exports = router;