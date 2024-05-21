const connection = require('../../utilities/database');

const patientlist = {
    getpts: (clinicid) => {
        let query = "SELECT patientid FROM `patient_list` WHERE clinicid = "+clinicid;
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
    setflagpts: (clinicid) => {
        let query = "UPDATE `patient_list` SET flag = 0 WHERE clinicid = "+clinicid;
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
    
    getnewpts: (clinicid, callback) => {
        let query = "SELECT COUNT(*) AS total FROM `patient_list` WHERE flag = 1 AND clinicid ="+clinicid;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },

    ptloader: (entry, callback) => {
        var query = "INSERT INTO `patient_list` (`id`, `clinicid`, `patientid`, `FNAME`,`LNAME`,`MNAME`,`PHONE`,`MOBILE`,`EMAIL`,`ADDRESS`,`CITY`,`ZIP`,`State`,`GENDER`,`AGE`,`DOB`,`flag`,`race`,`ethnicity_CDC`,`Language`,`marital_status`,`Deceased`,`Deceased_at`,`event_id`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        return new Promise((resolve, reject) => {
            connection.query(query, [entry.clinicid, entry.uid, entry.ufname, entry.ulname, entry.uminitial, entry.upPhone, entry.umobileno, entry.uemail, entry.upaddress, entry.upcity, entry.zipcode, entry.upstate, entry.sex, entry.Age, entry.DOB, 1, entry.race, entry.ethnicity, entry.language, entry.marital, entry.deceased, entry.deceasedDate, entry.event_id], (err, result) => {
                if (err) {
                    reject(err);
                    } else {
                    resolve(result);
                    }
                }
            );
        });
    },
    get: (entry, callback) => {
        var query = "";
        if(entry.pt_id!=""){
            query = "SELECT * FROM `patient_list` WHERE id='"+entry.pt_id+"'";
        }else if(entry.emr_id!=""){
            query = "SELECT * FROM `patient_list` WHERE patientid='"+entry.emr_id+"'";
        }else{
            query = "SELECT * FROM `patient_list` WHERE id='-1'";
        }
        
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    add: (entry, callback) => {
        var query = "INSERT INTO `patient_list` (`id`, `clinicid`, `patientid`, `FNAME`,`LNAME`,`MNAME`,`PHONE`,`MOBILE`,`EMAIL`,`ADDRESS`,`ADDRESS2`,`CITY`,`ZIP`,`State`,`GENDER`,`DOB`,`flag`,`race`,`ethnicity_CDC`,`Language`,`marital_status`,`Deceased`,`Deceased_at`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        connection.query(query, [entry.clinicid, entry.emr_id, entry.fname, entry.lname, entry.mname, entry.phone, entry.mobile, entry.email, entry.address, entry.address2, entry.city, entry.zip, entry.state, entry.gender, entry.dob, 0, entry.race, entry.ethnicity, entry.language, entry.marital, entry.deceased, entry.deceased_at], (err, result) => {
            callback(err, result);
        });
    },
    update: (entry, callback) => {
        var query = "UPDATE `patient_list` SET `patientid`=?, `FNAME`=?,`LNAME`=?,`MNAME`=?,`PHONE`=?,`MOBILE`=?,`EMAIL`=?,`ADDRESS`=?,`ADDRESS2`=?,`CITY`=?,`ZIP`=?,`State`=?,`GENDER`=?,`DOB`=?,`flag`=?,`race`=?,`ethnicity_CDC`=?,`Language`=?,`marital_status`=?,`Deceased`=?,`Deceased_at`=? WHERE id=?";
        connection.query(query, [entry.emr_id, entry.fname, entry.lname, entry.mname, entry.phone, entry.mobile, entry.email, entry.address, entry.address2, entry.city, entry.zip, entry.state, entry.gender, entry.dob, 0, entry.race, entry.ethnicity, entry.language, entry.marital, entry.deceased, entry.deceased_at, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    ptinfoloader: (entry, callback) => {
        var query = "INSERT INTO `pt_info` (`id`, `clinicid`, `ptid`, `language`,`race`,`ethnicity`) VALUES (NULL, ? , ? , ? , ?,  ?)";
        connection.query(query, [entry.clinicid, entry.uid, entry.language, entry.race, entry.ethnicity], (err, result1) => {
            callback(err, result1);
        });
    },
    getData: (entry, callback) => {
        let query = "";
        if(entry.flag == 1)
            query = "SELECT * FROM `patient_list` WHERE flag = 1 AND clinicid ="+entry.clinicid;
        else
            query = "SELECT * FROM `patient_list` WHERE clinicid ="+entry.clinicid;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getDataByPage: (entry, callback) => {
        let query = "";
        var search = "";
        if(entry.text != ""){
            search = " AND (";
            search += "patientid LiKE '%"+entry.text+"%' ";
            search += "OR FNAME LiKE '%"+entry.text+"%' ";
            search += "OR LNAME LiKE '%"+entry.text+"%' ";
            search += "OR PHONE LiKE '%"+entry.text+"%' ";
            search += "OR EMAIL LiKE '%"+entry.text+"%' ";
            search += "OR CITY LiKE '%"+entry.text+"%' ";
            search += "OR ZIP LiKE '%"+entry.text+"%' ";
            search += "OR Language LiKE '%"+entry.text+"%' ";
            search += ")";
            
        }
        if(entry.flag == 1)
            query = "SELECT COUNT(*) as total FROM `patient_list` WHERE flag = 1 AND clinicid ="+entry.clinicid+search;
        else
            query = "SELECT COUNT(*) as total FROM `patient_list` WHERE clinicid ="+entry.clinicid+search;
        
        connection.query(query, (err1, result1) => {
            if(!err1){
                var result = {};
                result.total = result1[0]['total'];
                var start = (entry.page-1) * entry.size;
                
                if(entry.flag == 1)
                    query = "SELECT * FROM `patient_list` WHERE flag = 1 AND clinicid ="+entry.clinicid+search+" Limit "+start+", "+entry.size;
                else
                    query = "SELECT * FROM `patient_list` WHERE clinicid ="+entry.clinicid+search+" Limit "+start+", "+entry.size;
                    
                connection.query(query, (err2, result2) => {
                    result.data = result2;
                    callback(err2, result);
                });
            }else{
                callback(err1, result1);
            }
        });
    },
    
    getTotal: (entry, callback) => {
        let query = "SELECT COUNT(*) AS total FROM `patient_list` WHERE clinicid ="+entry.clinicid;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getLanguages: (entry, callback) => {
        let query = "SELECT id, code, english FROM `f_vs_cov_languages` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getRace: (entry, callback) => {
        let query = "SELECT id, code, display, internalId FROM `f_vs_race` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getEthnicity: (entry, callback) => {
        let query = "SELECT id, code, display, internalId FROM `f_vs_ethnicity` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getMarital: (entry, callback) => {
        let query = "SELECT id, code, display FROM `f_vs_marital_status` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    setValue: (entry, callback) => {
        var tmp = "";
        if(entry.key == "FNAME"){
            tmp = "FNAME";
        }
        else if(entry.key == "LNAME"){
            tmp = "LNAME";
        }
        else if(entry.key == "PHONE"){
            tmp = "PHONE";
        }
        else if(entry.key == "MOBILE"){
            tmp = "MOBILE";
        }
        else if(entry.key == "EMAIL"){
            tmp = "EMAIL";
        }
        else if(entry.key == "ADDRESS"){
            tmp = "ADDRESS";
        }
        else if(entry.key == "ADDRESS2"){
            tmp = "ADDRESS2";
        }
        else if(entry.key == "CITY"){
            tmp = "CITY";
        }
        else if(entry.key == "ZIP"){
            tmp = "ZIP";
        }
        else if(entry.key == "GENDER"){
            tmp = "GENDER";
        }
        else if(entry.key == "DOB"){
            tmp = "DOB";
            entry.value = new Date(entry.value)
        }
        else if(entry.key == "LANGUAGE"){
            tmp = "Language";
        }
        else if(entry.key == "DECEASED"){
            tmp = "Deceased_at";
            entry.value = new Date(entry.value)
        }
        let query = "UPDATE `patient_list` SET "+tmp+" = ? WHERE id = ?";
        connection.query(query,[entry.value,entry.id], (err, result) => {
            callback(err, result);
        });
    },
    delete: (entry, callback) => {
        query = "DELETE  FROM `patient_list` WHERE id ="+entry.id;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    search: (entry, callback) => {
        var query = "SELECT * FROM `patient_list` WHERE ";
        if(entry.item=="name"){
            var names = entry.text.split(" ");
            if(names.length==1){
                query += "( FNAME LIKE '%"+names[0]+"%' ";
                query += "OR LNAME LIKE '%"+names[0]+"%') ";
            }else{
                query += "( FNAME LIKE '%"+names[0]+"%' ";
                query += "AND LNAME LIKE '%"+names[1]+"%') ";
            }
        }
        if(entry.item=="dob"){
            var dob = new Date(entry.text);
            query += "DOB ='"+dob.toISOString().split("T")[0]+"%' ";
        }
        if(entry.item=="emr_id"){
            query += "( id LIKE '%"+entry.text+"%' ";
            query += "OR patientid LIKE '%"+entry.text+"%') ";
        }
        if(entry.item=="phone"){
            query += "( PHONE LIKE '%"+entry.text+"%' ";
            query += "OR MOBILE LIKE '%"+entry.text+"%') ";
        }
        if(entry.item=="insurance"){
            query += "INS_ID PHONE '%"+entry.text+"%' ";
        }
        query += " AND clinicid='"+entry.clinic_id+"' ";
        query += " LIMIT 10;";
        
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
}
module.exports = patientlist;