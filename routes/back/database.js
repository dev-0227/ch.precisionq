const express = require('express');
const controller = require('../../controllers/back/database');
const AuthGuard = require('../../middleware/auth');

const router = express.Router();

router.post('/import_entity_types', AuthGuard, controller.import_entity_types);
router.post('/import_event_types', AuthGuard, controller.import_event_types);
router.post('/import_event_sub_types', AuthGuard, controller.import_event_sub_types);
router.post('/import_languages', AuthGuard, controller.import_languages);
router.post('/import_coverage_types', AuthGuard, controller.import_coverage_types);
router.post('/import_currencies', AuthGuard, controller.import_currencies);
router.post('/import_race', AuthGuard, controller.import_race);
router.post('/import_ethnicity', AuthGuard, controller.import_ethnicity);
router.post('/import_fhir_types', AuthGuard, controller.import_fhir_types);
router.post('/import_jurisdiction', AuthGuard, controller.import_jurisdiction);
router.post('/import_qpp_measures_data', AuthGuard, controller.import_qpp_measures_data);

module.exports = router;