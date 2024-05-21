const connection = require('../../../utilities/database');


const roles = {
    list: (callback) => {
        let query = "SELECT * FROM `f_vitals` WHERE 1 ORDER BY LOINC";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    add: (entry, callback) => {
        let query = "INSERT INTO `f_vitals` (`id`, `vname`, `vdescription`,`LOINC`,`LOINC_Name`, `UCUM_Units`,`SNOMED`,`ECL`) VALUES (NULL, ? , ? , ? , ?, ?, ?, ? )";
        connection.query(query, [entry.vname, entry.vdescription, entry.LOINC, entry.LOINC_Name, entry.UCUM_Units, entry.SNOMED,  entry.ECL], (err, result) => {
            callback(err, result);
        });
    },
    chosen: (entry, callback) => {
        let query = "SELECT * FROM `f_vitals` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    update: (entry, callback) => {
        let query = "UPDATE `f_vitals` SET `vname`= ?, `vdescription` = ?, `LOINC` = ?, `LOINC_Name`= ?, `UCUM_Units` = ?, `SNOMED` = ?, `ECL` = ? WHERE `id`= ? ";
        connection.query(query, [entry.vname, entry.vdescription, entry.LOINC, entry.LOINC_Name, entry.UCUM_Units, entry.SNOMED, entry.ECL,  entry.id], (err, result) => {
            callback(err, result);
        });
    },
    delete: (entry, callback) => {
        let query = "DELETE FROM `f_vitals` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
}
module.exports = roles;