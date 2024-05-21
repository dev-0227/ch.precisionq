const connection = require('../../utilities/database');
var md5 = require('md5');
const accounts = {
    chosen: (entry, callback) => {
        let query = "SELECT * FROM `managers` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    update: (entry, callback) => {
        let query = "UPDATE `managers` SET `fname`= ?, `lname` = ?, `email` = ?, `phone` = ?, `address` = ? WHERE `id`= ? ";
        connection.query(query, [entry.fname, entry.lname, entry.email, entry.phone, entry.address, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    checkpwd: (entry, callback) => {
        let query = "SELECT * FROM `managers` WHERE `id`= ? AND `password` = ?"
        connection.query(query, [entry.id,md5(entry.opwd)], (err, result) => {
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
}
module.exports = accounts;