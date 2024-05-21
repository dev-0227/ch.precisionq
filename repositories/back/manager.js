const connection = require('../../utilities/database');
var md5 = require('md5');
const accounts = {
    list: (callback) => {
        let query = "SELECT * FROM `managers` WHERE type != '3' ORDER BY fname";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    checkuser: (email) => {
        let query = "SELECT id FROM `managers` WHERE email = '"+email+"'";
        return new Promise((resolve, reject) => {
            connection.query(query, (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
    add: (account, callback) => {
        let query = "INSERT INTO `managers` (`id`, `fname`, `lname`, `email`,`phone`,`address`,`type`,`status`) VALUES (NULL, ? , ? , ? , ?,  ? , ?, ? )";
        connection.query(query, [account.fname, account.lname, account.email, account.phone, account.address, account.type, account.status], (err, result) => {
            callback(err, result);
        });
    },
    chosen: (entry, callback) => {
        let query = "SELECT * FROM `managers` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    update: (entry, callback) => {
        let query = "UPDATE `managers` SET `fname`= ?, `lname` = ?, `email` = ?,  `phone` = ?,  `address` = ?, `type` = ?, `status` = ? WHERE `id`= ? ";
        connection.query(query, [entry.fname, entry.lname, entry.email, entry.phone, entry.address, entry.type, entry.status, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    delete: (entry, callback) => {
        let query = "DELETE FROM `managers` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatepwd: (entry, callback) => {
        let query = "UPDATE `managers` SET `password` = ? WHERE `id`= ? ";
        connection.query(query, [md5(entry.pwd), entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updateanswer: (entry, callback) => {
        let query = "SELECT * FROM `security_authentification` WHERE user_id = ? AND question_id = ?";
        connection.query(query, [entry.id,entry.question_id], (err, result) => {
            if(result.length == 0){
                let query = "INSERT INTO `security_authentification` (`id`, `user_id`, `question_id`, `answer`) VALUES (NULL, ? , ? , ? )";
                connection.query(query, [entry.id, entry.question_id, entry.answer], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                let query = "UPDATE `security_authentification` SET `answer` = ? WHERE `user_id`= ? AND `question_id`= ? ";
                connection.query(query, [entry.answer, entry.id, entry.question_id], (err, result) => {
                    callback(err, result);
                });
            }
        });
        
    },
    updateclinics: (entry, callback) => {
        let clinics = "";
        if(entry.clinics.length > 0){
            for(var i = 0;i < entry.clinics.length; i++){
                if(i < entry.clinics.length - 1)
                    clinics += parseInt(entry.clinics[i])+",";
                else
                    clinics += parseInt(entry.clinics[i]);
            }
        }
        let query = "UPDATE `managers` SET `clinic` = ? WHERE `id`= ?";
        connection.query(query, [clinics, entry.id], (err, result) => {
            callback(err, result);
        });
        
    },
    updatehedisdaily: (entry, callback) => {
        let query = "UPDATE `managers` SET `hedisdaily` = ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatehedisncompliant: (entry, callback) => {
        let query = "UPDATE `managers` SET `hedisnoncompliant` = ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.id], (err, result) => {
            callback(err, result);
        });
    },
}
module.exports = accounts;