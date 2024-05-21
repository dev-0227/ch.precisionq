const connection = require('../../utilities/database');


const valueSet = {
    publicationState: (entry, callback) => {
        let query = "SELECT * FROM `f_vs_publication_status` "
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    jurisdiction: (entry, callback) => {
        let query = "SELECT * FROM `f_vs_jurisdiction` "
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    observationCategory: (entry, callback) => {
        let query = "SELECT * FROM `f_vs_observation_category` "
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    specimenType: (entry, callback) => {
        let query = "SELECT * FROM `f_vs_specimentype` "
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    permittedDataType: (entry, callback) => {
        let query = "SELECT * FROM `f_vs_permit_data_type` "
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    diagnosticRepStatus: (callback) => {
        let query = "SELECT * FROM `f_vs_diagnostic_rep_status` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    diagnosticSerSect: (callback) => {
        let query = "SELECT * FROM `f_vs_diagnostic_ser_sect` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    reportCodes: (callback) => {
        let query = "SELECT * FROM `f_vs_report_codes` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    encounterType: (callback) => {
        let query = "SELECT * FROM `f_vs_enc_type` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    encounterStatus: (callback) => {
        let query = "SELECT * FROM `f_vs_enc_status` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    encounterClass: (callback) => {
        let query = "SELECT * FROM `f_vs_enc_class` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    encounterPriority: (callback) => {
        let query = "SELECT * FROM `f_vs_act_priority` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    encounterServiceType: (callback) => {
        let query = "SELECT * FROM `f_vs_service_type` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    encounterSubjectStatus: (callback) => {
        let query = "SELECT * FROM `f_vs_enc_subject_status` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    encounterParticipantType: (callback) => {
        let query = "SELECT * FROM `f_vs_enc_participant_type` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    encounterReasonUse: (callback) => {
        let query = "SELECT * FROM `f_vs_enc_reason_use` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    encounterReasonCodes: (callback) => {
        let query = "SELECT * FROM `f_vs_enc_reason` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
}
module.exports = valueSet;