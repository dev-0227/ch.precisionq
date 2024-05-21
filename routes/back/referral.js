

const express = require('express');
const EncounterController = require('../../controllers/back/hedis/encounter');
const AuthGuard = require('../../middleware/auth');
const router = express.Router();

router.post('/encounter', AuthGuard, EncounterController.encounter);
router.post('/encounter/create', AuthGuard, EncounterController.createEncounter);
router.post('/encounter/update', AuthGuard, EncounterController.updateEncounter);
router.post('/encounter/chosen', AuthGuard, EncounterController.chosenEncounter);
router.post('/encounter/delete', AuthGuard, EncounterController.deleteEncounter);

router.post('/appointment', AuthGuard, EncounterController.appointment);
router.post('/appointment/create', AuthGuard, EncounterController.createAppointment);
router.post('/appointment/update', AuthGuard, EncounterController.updateAppointment);
router.post('/appointment/chosen', AuthGuard, EncounterController.chosenAppointment);
router.post('/appointment/delete', AuthGuard, EncounterController.deleteAppointment);
router.post('/appointment/get', AuthGuard, EncounterController.getAppointment);

router.get('/appointmentType', AuthGuard, EncounterController.appointmentType);
router.post('/appointmentType/create', AuthGuard, EncounterController.createAppointmentType);
router.post('/appointmentType/update', AuthGuard, EncounterController.updateAppointmentType);
router.post('/appointmentType/chosen', AuthGuard, EncounterController.chosenAppointmentType);
router.post('/appointmentType/delete', AuthGuard, EncounterController.deleteAppointmentType);

router.get('/appointmentCategory', AuthGuard, EncounterController.appointmentCategory);
router.post('/appointmentCategory/create', AuthGuard, EncounterController.createAppointmentCategory);
router.post('/appointmentCategory/update', AuthGuard, EncounterController.updateAppointmentCategory);
router.post('/appointmentCategory/chosen', AuthGuard, EncounterController.chosenAppointmentCategory);
router.post('/appointmentCategory/delete', AuthGuard, EncounterController.deleteAppointmentCategory);

router.get('/appointmentSpecialty', AuthGuard, EncounterController.appointmentSpecialty);
router.post('/appointmentSpecialty/create', AuthGuard, EncounterController.createAppointmentSpecialty);
router.post('/appointmentSpecialty/update', AuthGuard, EncounterController.updateAppointmentSpecialty);
router.post('/appointmentSpecialty/chosen', AuthGuard, EncounterController.chosenAppointmentSpecialty);
router.post('/appointmentSpecialty/delete', AuthGuard, EncounterController.deleteAppointmentSpecialty);
router.post('/appointmentSpecialty/getSpecialtyByMeasure', AuthGuard, EncounterController.getAppointmentSpecialtyByMeasure);

router.post('/appointmentSpecialty/getReferralSpecialtyByClinic', AuthGuard, EncounterController.getReferralSpecialtyByClinic);

router.get('/referral', AuthGuard, EncounterController.referral);
router.post('/referral/chosen', AuthGuard, EncounterController.chosenReferral);
router.post('/referral/update', AuthGuard, EncounterController.updateReferral);
router.post('/referral/delete', AuthGuard, EncounterController.deleteReferral);
router.post('/referral/tracking/create', AuthGuard, EncounterController.createReferralTracking);

router.get('/referral/status', AuthGuard, EncounterController.referralStatus);
router.post('/referral/status/create', AuthGuard, EncounterController.createReferralStatus);
router.post('/referral/status/chosen', AuthGuard, EncounterController.chosenReferralStatus);
router.post('/referral/status/update', AuthGuard, EncounterController.updateReferralStatus);
router.post('/referral/status/delete', AuthGuard, EncounterController.deleteReferralStatus);

router.get('/referral/category', AuthGuard, EncounterController.referralCategory);
router.post('/referral/category/create', AuthGuard, EncounterController.createReferralCategory);
router.post('/referral/category/chosen', AuthGuard, EncounterController.chosenReferralCategory);
router.post('/referral/category/update', AuthGuard, EncounterController.updateReferralCategory);
router.post('/referral/category/delete', AuthGuard, EncounterController.deleteReferralCategory);

module.exports = router;