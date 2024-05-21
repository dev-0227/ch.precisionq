const connection = require('../../utilities/database');
const events = {
    
    log: (entry, callback) => {
        let query = "INSERT INTO `f_audit_event` ";
        query += "(`id`, `user_id`, `clinic_id`,`patient_id`,`pt_emr_id`,`type_id`,`subtype_id`,`action_id`,`outcome_id`,`period`,`description`,`model_name`,`model_id`,`recorded`) ";
        query += "VALUES (NULL, ? , ? , ? , ?, ?, ?, ?, ?, ?, ?,?, ?, ? )";
        connection.query(query, [
            entry.user_id?entry.user_id:'', 
            entry.clinic_id?entry.clinic_id:'', 
            entry.patient_id?entry.patient_id:'', 
            entry.pt_emr_id?entry.pt_emr_id:'', 
            entry.type_id?entry.type_id:'', 
            entry.subtype_id?entry.subtype_id:'', 
            entry.action_id?entry.action_id:'', 
            entry.outcome_id?entry.outcome_id:'', 
            entry.period?entry.period:null, 
            entry.description?entry.description:'', 
            entry.model_name?entry.model_name:'', 
            entry.model_id?entry.model_id:'', 
            new Date()
            ], 
            (err, result) => {
                callback(err, result);
            }
        );
    },
    logger: (entry) => {
        let query = "INSERT INTO `f_audit_event` ";
        query += "(`id`, `user_id`, `clinic_id`,`patient_id`,`pt_emr_id`,`type_id`,`subtype_id`,`action_id`,`outcome_id`,`period`,`description`,`model_name`,`model_id`,`recorded`) ";
        query += " VALUES (NULL, ";
        query += entry.user_id?entry.user_id:"NULL";
        query += ", ";
        query += entry.clinic_id?entry.clinic_id:"NULL";
        query += ", ";
        query += entry.patient_id?entry.patient_id:"NULL";
        query += ", ";
        query += entry.pt_emr_id?entry.pt_emr_id:"NULL";
        query += ", ";
        query += entry.type_id;
        query += ", ";
        query += entry.subtype_id?entry.subtype_id:"NULL";
        query += ", ";
        query += entry.action_id?entry.action_id:"NULL";
        query += ", ";
        query += entry.outcome_id?entry.outcome_id:"NULL";
        query += ", ";
        query += entry.period?entry.period:"NULL";
        query += ", '";
        query += entry.description?entry.description:"";
        query += "', '";
        query += entry.model_name?entry.model_name:"";
        query += "', ";
        query += entry.model_id?entry.model_id:"NULL";
        query += ", '";
        var d = new Date;
        query += [d.getFullYear(),
            d.getMonth()+1,
            d.getDate()].join('-')+' '+
           [d.getHours(),
            d.getMinutes(),
            d.getSeconds()].join(':');
        query += "')";
        return new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) {
                    reject(err);
                    } else {
                    resolve(result);
                    }
                }
            );
        });
    },
    update: (entry) => {
        let query = "UPDATE `f_audit_event` SET `description` = ?, `model_name` = ?, `model_id` = ? WHERE `id`= ? ";
        connection.query(query, [entry.description, entry.model_name, entry.model_id, entry.id], (err, result) => {
            
        });
    },
}
module.exports = events;