const connection = require('../../utilities/database');
var md5 = require('md5');
const diagnosisgroup = {
    list: (callback) => {
        let query = "SELECT * FROM `diagnosisgroups` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    
    add: (entry, callback) => {
        let query = "SELECT * FROM `diagnosisgroups` WHERE `name`= ? "
        connection.query(query, [entry.name], (err, result) => {
            if(!err){
                if(result.length>0){
                    callback(err, []);
                }else{
                    query = "INSERT INTO `diagnosisgroups` (`id`, `name`,`created_at`,`updated_at`,`created_by`,`updated_by`) VALUES (NULL, ?, ?, ?, ?, ? )";
                    connection.query(query, [entry.name, new Date(), new Date(), entry.userId, entry.userId], (err, result) => {
                        callback(err, result);
                    });
                }
            };
        });

        
    },
    chosen: (entry, callback) => {
        let query = "SELECT * FROM `diagnosisgroups` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    update: (entry, callback) => {
        let query = "UPDATE `diagnosisgroups` SET `name`= ?, `codes`= ?, `updated_at` = ?, `updated_by` = ? WHERE `id`= ? ";
        connection.query(query, [entry.name, entry.codes, new Date(), entry.userId, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    delete: (entry, callback) => {
        let query = "DELETE FROM `diagnosisgroups` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    ref: (entry, callback) => {
        let query = "select * FROM `icd_ref`;";
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    }
}
module.exports = diagnosisgroup;