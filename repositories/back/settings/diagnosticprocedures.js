const connection = require('../../../utilities/database');


const diagnosticProcedures = {
    list: (callback) => {
        let query = "SELECT r.*, m.name as observation FROM `f_diagnostic_report` as r LEFT JOIN `measure_observation_definition` as m ON m.id= r.obsid WHERE 1 ORDER BY id";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    create: (entry, callback) => {
        let query = "INSERT INTO `f_diagnostic_report` (`mid`, `obsid`,`name`,`description`, `type`,`status`,`category`,`snomed`,`locin`,`specimen`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
        connection.query(query, [entry.mid, entry.obsid, entry.name, entry.description, entry.type, entry.status, entry.category, entry.snomed, entry.locin, entry.specimen], (err, result) => {
            callback(err, result);
        });
    },
    chosen: (entry, callback) => {
        let query = "SELECT * FROM `f_diagnostic_report` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    update: (entry, callback) => {
        let query = "UPDATE `f_diagnostic_report` SET `mid`= ?, `obsid` = ?, `name` = ?, `description`= ?, `type` = ?, `status` = ?, `category` = ?, `snomed` = ?, `locin` = ?, `specimen` = ? WHERE `id`= ? ";
        connection.query(query, [entry.mid, entry.obsid, entry.name, entry.description, entry.type, entry.status, entry.category, entry.snomed, entry.locin, entry.specimen,  entry.id], (err, result) => {
            callback(err, result);
        });
    },
    delete: (entry, callback) => {
        let query = "DELETE FROM `f_diagnostic_report` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
}
module.exports = diagnosticProcedures;