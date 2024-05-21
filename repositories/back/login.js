const connection = require('../../utilities/database');
var md5 = require('md5');
const accounts = {
    getuser: (entry) => {
        let query = "SELECT id FROM `managers` WHERE email = '"+entry.email+"'";
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
    login: (account, callback) => {
        let query = "SELECT * FROM `managers` WHERE `email`= ? AND `password` = ?"
        
        connection.query(query, [account.email,md5(account.password)], (err, result) => {
            callback(err, result);
        });
    },
    getsecurity: (user_id, callback) => {
        let query = "SELECT squestion.id,squestion.question FROM `security_authentification` LEFT JOIN `squestion` ON `squestion`.id = `security_authentification`.question_id WHERE `user_id`= ?"
        connection.query(query, [user_id], (err, result) => {
            callback(err, result);
        });
    },
    checksecurity: (entry, callback) => {
        let query = "SELECT * FROM `security_authentification` WHERE `user_id`= ? AND `question_id` = ?  AND `answer` = ?"
        connection.query(query, [entry.userid,entry.qid,entry.answer], (err, result) => {
            callback(err, result);
        });
    },
    getfirstclinic: (user_id, callback) => {
        let query = "SELECT clinic FROM `managers` WHERE `id`= ?"
        connection.query(query, [user_id], (err, result) => {
            if(result.lenth>0){
                let res = result[0]['clinic'].split(",");
                if(res[0] == 0 || res[0] == "undefined"){
                    let query1 = "SELECT id FROM `clinics`"
                    connection.query(query1, (err, result1) => {
                        callback(err, result1);
                    });
                }
                else{
                    let query1 = "SELECT id FROM `clinics` WHERE `id`= ?"
                    connection.query(query1, [res[0]], (err, result1) => {
                        callback(err, result1);
                    });
                }
            }else{
                callback(err, result);
            }
            
            
        });
    },
    updatepwd: (entry, callback) => {
        let query = "UPDATE `managers` SET `password` = ? WHERE `id`= ? ";
        connection.query(query, [md5(entry.pwd), entry.id], (err, result) => {
            callback(err, result);
        });
    },
    tracklogin: (userid) => {
        let query = "INSERT INTO `conectorworkreport` (`id`, `userid`, `logintime`,`status`) VALUES (NULL, ? , ? , ?)";
        return new Promise((resolve, reject) => {
            connection.query(query, [userid,new Date(),0], (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
    updateloginouttime: (entry, callback) => {
        let query = "UPDATE `conectorworkreport` SET `logouttime` = ?, `status` = 1 WHERE `id`= ? ";
        connection.query(query, [new Date(), entry.id], (err, result) => {
            callback(err, result);
        });
    },
}
module.exports = accounts;