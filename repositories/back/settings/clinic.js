const connection = require('../../../utilities/database');
var md5 = require('md5');
const accounts = {
    list: (callback) => {
        let query = "SELECT * FROM `clinics` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    
    add: (account, callback) => {
        let query = "INSERT INTO `clinics` (`id`, `name`, `acronym`, `address1`,`address2`,`city`,`state`,`zip`,`country`,`phone`,`cel`,`email`,`web`,`portal`,`placeservice`,`status`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
        connection.query(query, [account.name, account.acronym, account.address1, account.address2, account.city, account.state, account.zip, account.country, account.tel, account.fax, account.email, account.web, account.portal, account.pos, account.status], (err, result) => {
            callback(err, result);
        });
    },
    chosen: (entry, callback) => {
        let query = "SELECT * FROM `clinics` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    update: (account, callback) => {
        let query = "UPDATE `clinics` SET `name`= ?, `acronym` = ?, `address1` = ?,  `address2` = ?,  `city` = ?, `state` = ?, `zip` = ?, `country` = ?, `phone` = ?, `cel` = ?, `email` = ?, `web` = ?, `portal` = ?, `placeservice` = ?, `status` = ?, `contact_name` = ?, `contact_email` = ?, `contact_tel` = ?, `contact_cel` = ?, `contact_web` = ?, `ex` = ? ";
        if(account.logo && account.logo !== undefined)query += ", `logo`= '"+account.logo+"'";
        query += "WHERE `id`= ? ";
        connection.query(query, [account.name, account.acronym, account.address1, account.address2, account.city, account.state, account.zip, account.country, account.tel, account.fax, account.email, account.web, account.portal, account.pos, account.status, account.cname, account.cemail, account.ctel, account.ccel, account.cweb, account.cex, account.id], (err, result) => {
            callback(err, result);
        });
    },
    delete: (entry, callback) => {
        let query = "DELETE FROM `clinics` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updateVCard: (entry, callback) => {
        let query = "UPDATE `clinics` SET `logo`=?, `fonts`=?, `layout`=?, `color`=?, `pattern`=? WHERE `id`= ? ";
        connection.query(query, [entry.logo, entry.fonts, entry.layout, entry.color, entry.pattern, entry.clinic_id], (err, result) => {
            callback(err, result);
        });
    },
    updatewebcheck: (entry, callback) => {
        let query = "UPDATE `clinics` SET `checkweb` = ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updateportalcheck: (entry, callback) => {
        let query = "UPDATE `clinics` SET `checkportal` = ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatecontactcheck: (entry, callback) => {
        let query = "UPDATE `clinics` SET `checkcontact` = ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updateapcheck: (entry, callback) => {
        let query = "UPDATE `clinics` SET `apcheck` = ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getclinicmanagers: () => {
        query = "SELECT id,fname,lname,clinic FROM `managers` WHERE 1 ORDER BY fname";
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
    addclinicmanagers: (entry) => {
        let query = "SELECT * FROM `clinicmanagers` WHERE clinicid = ?";
        connection.query(query, [entry.clinicid], (err, result) => {
            if(result.length == 0){
                let query = "INSERT INTO `clinicmanagers` (`id`, `clinicid`, `manager`, `status`) VALUES (NULL, ? , ? , ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query, [entry.clinicid, entry.manager, 1], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "UPDATE `clinicmanagers` SET `manager` = ? WHERE `id`= ?";
                return new Promise((resolve, reject) => {
                    connection.query(query, [entry.manager,result[0]['id']], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
        });
    },
    chosenclinicmanagers: (entry, callback) => {
        let query = "SELECT * FROM `clinicmanagers` WHERE `clinicid`= ? "
        connection.query(query, [entry.clinicid], (err, result) => {
            callback(err, result);
        });
    },
}
module.exports = accounts;