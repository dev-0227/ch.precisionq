const express = require('express');
const controller = require('../../controllers/back/valueset');
const router = express.Router();
const AuthGuard = require('../../middleware/auth');

router.get('/publicationState', AuthGuard, controller.publicationState);
router.get('/jurisdiction', AuthGuard, controller.jurisdiction);
router.get('/observationCategory', AuthGuard, controller.observationCategory);
router.get('/specimenType', AuthGuard, controller.specimenType);
router.get('/permittedDataType', AuthGuard, controller.permittedDataType);

router.get('/diagnosticRepStatus', AuthGuard, controller.diagnosticRepStatus);
router.get('/diagnosticSerSect', AuthGuard, controller.diagnosticSerSect);
router.get('/reportCodes', AuthGuard, controller.reportCodes);

router.get('/encounterType', AuthGuard, controller.encounterType);
router.get('/encounterStatus', AuthGuard, controller.encounterStatus);
router.get('/encounterClass', AuthGuard, controller.encounterClass);
router.get('/encounterPriority', AuthGuard, controller.encounterPriority);
router.get('/encounterServiceType', AuthGuard, controller.encounterServiceType);
router.get('/encounterSubjectStatus', AuthGuard, controller.encounterSubjectStatus);
router.get('/encounterParticipantType', AuthGuard, controller.encounterParticipantType);
router.get('/encounterReasonUse', AuthGuard, controller.encounterReasonUse);
router.get('/encounterReasonCodes', AuthGuard, controller.encounterReasonCodes);


module.exports = router;