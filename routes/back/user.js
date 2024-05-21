const express = require('express');
const AuthGuard = require('../../middleware/auth');
const controller = require('../../controllers/back/settings/user');

const router = express.Router();

// Get all logs route 
router.get('/', AuthGuard, controller.list);
router.post('/getUsersByClinic', AuthGuard, controller.getUsersByClinic);
router.post('/add', AuthGuard, controller.add);
router.post('/update', AuthGuard, controller.update);
router.post('/chosen', AuthGuard, controller.chosen);
router.post('/delete', AuthGuard, controller.delete);
router.post('/updatepwd', AuthGuard, controller.updatepwd);
router.post('/updateanswer', AuthGuard, controller.updateanswer);
router.post('/clinics', AuthGuard, controller.clinics);
router.post('/updateclinics', AuthGuard, controller.updateclinics);
router.post('/updatehedisdaily', AuthGuard, controller.updatehedisdaily);
router.post('/updatehedisncompliant', AuthGuard, controller.updatehedisncompliant);
router.get('/connectorclinics', AuthGuard, controller.connectorclinics);
router.post('/updatepermissions', AuthGuard, controller.updatepermissions);
router.post('/getPermissionsByName', AuthGuard, controller.getPermissionsByName);
router.post('/getDoctorsByClinic', AuthGuard, controller.getDoctorsByClinic);
router.post('/getAllDoctorsByClinic', AuthGuard, controller.getAllDoctorsByClinic);

module.exports = router;