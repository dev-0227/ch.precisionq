const connection = require('../../../utilities/database');
var md5 = require('md5');
const accounts = {
    list: (entry, callback) => {
        var where = "";
        let query = "SELECT u.*, r.name as role_name FROM `managers` as u LEFT JOIN `roles` as r ON u.type = r.code ";
        if(entry.search.value!=""){
            where += "WHERE ";
            where += "fname LIKE '%"+entry.search.value+"%' ";
            where += "OR lname LIKE '%"+entry.search.value+"%' ";
            where += "OR email LIKE '%"+entry.search.value+"%' ";
            where += "OR phone LIKE '%"+entry.search.value+"%' ";
            query += where;
        }
        query += "ORDER BY fname ";
        query += "LIMIT "+entry.start+","+entry.length+"";
        connection.query(query, (err, result) => {
            query = "SELECT count(*) as total FROM `managers` "+where+""
            connection.query(query, (err1, result1) => {
                if(err1)callback(err, result);
                var total = 0;
                
                if(result1.length>0)total = result1[0]['total']
                callback(err, { data: result, recordsFiltered: total, recordsTotal: total });
            });
            
        });
    },
    getUsersByClinic: (entry, callback) => {
        let query = "SELECT u.id, u.fname, u.lname FROM `managers` as u  WHERE FIND_IN_SET(?, u.clinic) ORDER BY fname";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    add: (account, callback) => {
        let query = "INSERT INTO `managers` (`id`, `fname`, `lname`, `emrid`, `email`, `phone`, `ext`, `qr_phone`,`address`,`city`,`state`,`zip`,`type`,`status`,`clinic1`,`created`) VALUES (NULL, ? , ? ,? , ? , ?,  ? ,? , ? , ?, ?, ?, ?, ?, ?, ? )";
        connection.query(query, [account.fname, account.lname, account.emrid, account.email, account.phone, account.ext, account.qr_phone, account.addr, account.city, account.state, account.zip, account.type, account.status, account.clinic, account.created], (err, result) => {
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
        let query = "UPDATE `managers` SET `fname`= ?, `lname` = ?, `emrid` = ?, `email` = ?, `phone` = ?, `ext` = ?, `qr_phone` = ?, `address` = ?, `city` = ?, `state` = ?, `zip` = ?, `type` = ?, `status` = ?, `clinic1` = ?, `created` = ? WHERE `id`= ? ";
        connection.query(query, [entry.fname, entry.lname, entry.emrid, entry.email, entry.phone, entry.ext, entry.qr_phone, entry.addr, entry.city, entry.state, entry.zip, entry.type, entry.status, entry.clinic, entry.created, entry.id], (err, result) => {
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
            if(result.length==0){
                let query = "INSERT INTO `security_authentification` (`id`, `user_id`, `question_id`, `answer`) VALUES (NULL, ? , ? , ? )";
                connection.query(query, [entry.id, entry.question_id, entry.answer], (err, result) => {
                    callback(err, result);
                });
            } else{
                let query = "UPDATE `security_authentification` SET `answer` = ? WHERE `user_id`= ? AND `question_id`= ? ";
                connection.query(query, [entry.answer, entry.id, entry.question_id], (err, result) => {
                    callback(err, result);
                });
            }
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
    clinics: (entry, callback) => {
        let query = "SELECT * FROM `managers` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            if(!err && result.length>0){
                if(result[0]['clinic']=='0'){
                    query = "SELECT c.id, c.name FROM  clinics AS c"; 
                }else{
                    query = "SELECT c.id, c.name FROM managers AS u  JOIN clinics AS c ON FIND_IN_SET(c.id, u.`clinic`)  WHERE u.id = ?"; 
                }
                connection.query(query, [entry.id], (err, result) => {
                    callback(err, result);
                });
            }
        })
        
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
    updatepermissions: (entry, callback) => {

        var permissions = entry.permissions.split(',');
        var permission = [];
        for(var i=0; i<permissions.length; i++){
            var p = permissions[i].split('_');
            var value = '000';
            if(permission[p[0]]){
                value = permission[p[0]];
            }
            permission[p[0]] = value.replaceAt(p[1]-1,p[2]);
        }
        var diff = "";
        var role_values = entry.role_values.split(',');
        permission.forEach(function (value, perm_id) {
            var is_diff = false;
            for(var j=0; j<role_values.length; j++){
                var p = role_values[j].split("_");
                if(p[0] == perm_id && p[1] == value)is_diff = true;
            }
            if(!is_diff){
                if(diff!="")diff += ',';
                diff += perm_id+"_"+value;
            }

        });

        var query = "UPDATE `managers` SET `permissions` = ? WHERE `id`= ?";
       
        connection.query(query, [diff, entry.id], (err, result) => {
            callback(err, result);
        });

    },
    getPermissionsByName: (entry, callback) => {

        let query = "SELECT * FROM `managers` WHERE `id`= ? "
        connection.query(query, [entry.user_id], (err, users) => {
            if(!err && users.length>0){
                var user = users[0];
                let query = "SELECT rp.value as value, pe.id as perm_id FROM `rolepermissions` as rp";
                query += " LEFT JOIN permissions as pe ON pe.id=rp.perm_id"
                query += " WHERE rp.role_id= ? and pe.name=? "
                connection.query(query, [user.type, entry.name], (err, result) => {
                    if(!err && result.length>0){
                        var value = result[0]['value']?result[0]['value']:'000';
                        var perm_id = result[0]['perm_id']?result[0]['perm_id']:'0';
                        var more = []
                        if(user.permissions)more = user.permissions.split(',');
                        for(var i=0; i<more.length; i++){
                            var p = more[i].split("_");
                            if(p[0] == perm_id)value = p[1];
                        }
                        callback(err, value);
                    }
                    
                });
            }
            
        });
    },
    getDoctorsByClinic: (entry, callback) => {
        let query = "SELECT id, fname, lname FROM `managers`  WHERE (`type`='5') AND FIND_IN_SET(?, `clinic`) ORDER BY type desc ";
        connection.query(query, [entry.clinic_id], (err, result) => {
            callback(err, result);
        });
    },
    getAllDoctorsByClinic: (entry, callback) => {
        let query = "SELECT id, fname, lname, type, speciality FROM `managers`  WHERE FIND_IN_SET(type, (";
        query += "SELECT GROUP_CONCAT(value) FROM `f_settings` WHERE type='appointment_doctor'";
        query += ")) AND FIND_IN_SET(?, `clinic`) ORDER BY type desc ";
        connection.query(query, [entry.clinic_id], (err, result) => {
            callback(err, result);
        });
    }
    
}
module.exports = accounts;