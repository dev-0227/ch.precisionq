const connection = require('../../utilities/database');
var md5 = require('md5');
const setting = {
    getquestions: (callback) => {
        let query = "SELECT * FROM `squestion` WHERE status = 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getallquestions: (callback) => {
        let query = "SELECT * FROM `squestion` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getallvkey: (entry,callback) => {
        let query = "SELECT * FROM `valkeyforlog` WHERE clinicid = "+entry.clinicid;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getallrole: (entry,callback) => {
        let query = "SELECT * FROM `rolem` WHERE clinicid = "+entry.clinicid+" ORDER BY name";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getallworkpc: (entry,callback) => {
        let query = "SELECT * FROM `work_pc` WHERE clinicid = "+entry.clinicid+" ORDER BY pc_name";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addsq: (entry, callback) => {
        let query = "INSERT INTO `squestion` (`id`, `question`, `status`) VALUES (NULL, ? , ? )";
        connection.query(query, [entry.question, entry.status], (err, result) => {
            callback(err, result);
        });
    },
    chosensq: (entry, callback) => {
        let query = "SELECT * FROM `squestion` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatesq: (entry, callback) => {
        let query = "UPDATE `squestion` SET `question`= ?, `status` = ? WHERE `id`= ? ";
        connection.query(query, [entry.question, entry.status, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletesq: (entry, callback) => {
        let query = "DELETE FROM `squestion` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    addvkey: (entry, callback) => {
        let query = "INSERT INTO `valkeyforlog` (`id`, `clinicid`, `name`, `status`) VALUES (NULL, ? , ? , ? )";
        connection.query(query, [entry.clinicid, entry.name, entry.status], (err, result) => {
            callback(err, result);
        });
    },
    chosenvkey: (entry, callback) => {
        let query = "SELECT * FROM `valkeyforlog` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatevkey: (entry, callback) => {
        let query = "UPDATE `valkeyforlog` SET `name`= ?, `status` = ? WHERE `id`= ? ";
        connection.query(query, [entry.name, entry.status, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletevkey: (entry, callback) => {
        let query = "DELETE FROM `valkeyforlog` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    addrole: (entry, callback) => {
        let query = "INSERT INTO `rolem` (`id`, `clinicid`, `name`, `status`) VALUES (NULL, ? , ? , ? )";
        connection.query(query, [entry.clinicid, entry.name, entry.status], (err, result) => {
            callback(err, result);
        });
    },
    chosenrole: (entry, callback) => {
        let query = "SELECT * FROM `rolem` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updaterole: (entry, callback) => {
        let query = "UPDATE `rolem` SET `name`= ?, `status` = ? WHERE `id`= ? ";
        connection.query(query, [entry.name, entry.status, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deleterole: (entry, callback) => {
        let query = "DELETE FROM `rolem` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    addworkpc: (entry, callback) => {
        let query = "INSERT INTO `work_pc` (`id`, `clinicid`, `pc_name`) VALUES (NULL, ? , ?)";
        connection.query(query, [entry.clinicid, entry.name], (err, result) => {
            callback(err, result);
        });
    },
    deleteworkpc: (entry, callback) => {
        let query = "DELETE FROM `work_pc` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    allClinic: (callback) => {
        let query = "SELECT id,name FROM `clinics` WHERE status = 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getchosenclinics: (entry, callback) => {
        let query = "SELECT c.id, c.name FROM `clinics` AS c LEFT JOIN managers AS m ON FIND_IN_SET(c.id, m.clinic) WHERE m.id= ?";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getchoseninsurances: (callback) => {
        let query = "SELECT id,insName FROM `insurances` WHERE Inactive = 0 ORDER BY insName";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    gethedisyear: (callback) => {
        let query = "SELECT idate FROM `hedisdaterange` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    gethediscolor: (callback) => {
        let query = "SELECT * FROM `hedis_color` WHERE 1 ORDER BY scheck";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getdatehedisloaded: (entry,callback) => {
        let query = "SELECT cyear FROM `hedis_track` WHERE clinicid = "+entry.clinicid+" AND insid = "+entry.insid+" GROUP BY cyear";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getoutputbtn: (entry, callback) => {
        let query = "SELECT * FROM `confilename` WHERE `insid`= ? "
        connection.query(query, [entry.insid], (err, result) => {
            callback(err, result);
        });
    },
    getchosenclinic: (clinicid) => {
        let query = "SELECT * FROM `clinics` WHERE id = "+clinicid;
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
    getchosenins: (insid) => {
        let query = "SELECT id,insName FROM `insurances` WHERE id = "+insid;
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
    getPhone: (clinicid) => {
        let query = "SELECT `name`,`desc`,`age` FROM `gsetting` WHERE `type`='phonenumber' AND clinicid = "+clinicid;
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
    getLogoaddress: (clinicid) => {
        let query = "SELECT `value` FROM `gsetting` WHERE `type`='logo_address'";
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
    getPriceSMS: (clinicid) => {
        let query = "SELECT `value` FROM `gsetting` WHERE `type`='pricesms' AND clinicid = "+clinicid;
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
    getPricecall: (clinicid) => {
        let query = "SELECT `value` FROM `gsetting` WHERE `type`='pricecall' AND clinicid = "+clinicid;
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
    getcallactive: (clinicid) => {
        let query = "SELECT `active_call` FROM `clinic_sms_account` WHERE  clinic_id = "+clinicid;
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
    getAutoAmountSMS: (clinicid) => {
        let query = "SELECT `autoamount`,`counts` FROM `communiation_info` WHERE clinicid = "+clinicid;
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
    getAutopayment: (clinicid) => {
        let query = "SELECT `auto` FROM `communiation_info` WHERE clinicid = "+clinicid;
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
    updatePriceSMS: (price,clinicid) => {
        let query = "SELECT * FROM `gsetting` WHERE `type`= 'pricesms' AND clinicid = ?";
        connection.query(query,[clinicid], (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `gsetting` SET `value`='"+price+"' WHERE `type`= 'pricesms' AND clinicid = "+clinicid;
                return new Promise((resolve, reject) => {
                    connection.query(query, (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "INSERT INTO `gsetting` (`id`, `type`, `clinicid`, `value`) VALUES (NULL, 'pricesms', ?, ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query,[clinicid,price], (err, rows) => {
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
    updatePricecall: (price,clinicid) => {
        let query = "SELECT * FROM `gsetting` WHERE `type`= 'pricecall' AND clinicid = ?";
        connection.query(query,[clinicid], (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `gsetting` SET `value`='"+price+"' WHERE `type`= 'pricecall' AND clinicid = "+clinicid;
                return new Promise((resolve, reject) => {
                    connection.query(query, (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "INSERT INTO `gsetting` (`id`, `type`, `clinicid`, `value`) VALUES (NULL, 'pricecall', ?, ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query,[clinicid,price], (err, rows) => {
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
    updateRepAmountSMS: (price,clinicid) => {
        let query = "SELECT id FROM `communiation_info` WHERE clinicid = ?";
        connection.query(query,[clinicid], (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `communiation_info` SET `autoamount`='"+price+"' WHERE clinicid = "+clinicid;
                return new Promise((resolve, reject) => {
                    connection.query(query, (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "INSERT INTO `communiation_info` (`id`, `clinicid`, `autoamount`) VALUES (NULL, ?, ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query,[clinicid,price], (err, rows) => {
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
    updateRepCountsSMS: (price,clinicid) => {
        let query = "SELECT id FROM `communiation_info` WHERE clinicid = ?";
        connection.query(query,[clinicid], (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `communiation_info` SET `counts`='"+price+"' WHERE clinicid = "+clinicid;
                return new Promise((resolve, reject) => {
                    connection.query(query, (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "INSERT INTO `communiation_info` (`id`, `clinicid`, `counts`) VALUES (NULL, ?, ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query,[clinicid,price], (err, rows) => {
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
    updatePhone: (entry) => {
        let query = "SELECT id FROM `gsetting` WHERE `type`= 'phonenumber' AND clinicid="+entry.clinicid;
        connection.query(query, (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `gsetting` SET `name`='"+entry.number+"', `desc`='"+entry.price+"' WHERE `type`= 'phonenumber' AND clinicid="+entry.clinicid;
                return new Promise((resolve, reject) => {
                    connection.query(query, (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "INSERT INTO `gsetting` (`id`, `clinicid`, `type`, `name`, `desc`) VALUES (NULL, "+entry.clinicid+",'phonenumber', '"+entry.number+"', '"+entry.price+"')";
                return new Promise((resolve, reject) => {
                    connection.query(query, (err, rows) => {
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
    updateActivatesms: (entry) => {
        let query = "UPDATE `gsetting` SET `age`= "+entry.value+" WHERE `type`= 'phonenumber' AND clinicid="+entry.clinicid;
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
    updateActivatecall: (entry, callback) => {
        let query = "SELECT id FROM `clinic_sms_account` WHERE `clinic_id`= "+entry.clinicid;
        connection.query(query, (err, result) => {
            if(result.length > 0){
                query = "UPDATE `clinic_sms_account` SET `active_call`= ?  WHERE `clinic_id`= ?";
                connection.query(query, [entry.value,entry.clinicid], (err, result) => {
                    callback(err, result);
                });
            }
        })
        
    },
    updateAutopayment: (entry) => {
        let query = "SELECT id FROM `communiation_info` WHERE clinicid="+entry.clinicid;
        connection.query(query, (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `communiation_info` SET `auto`= ? WHERE clinicid="+entry.clinicid;
                return new Promise((resolve, reject) => {
                    connection.query(query,[entry.value], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "INSERT INTO `communiation_info` (`id`, `clinicid`, `auto`) VALUES (NULL, ?, ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query,[entry.clinicid,entry.value], (err, rows) => {
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
    getavaiuserchosenclinic: () => {
        let query = "SELECT id,fname,lname,clinic FROM `managers` WHERE type != '3' AND status = '1' ORDER BY fname";
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
    getLanguage: () => {
        let query = "SELECT id,name FROM `gsetting` WHERE type = 'lkeys'";
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
    getHedisalerts: (entry) => {
        let query = "";
        if(entry.type == 1){
            query = "SELECT `id`,`name`,`desc` FROM `gsetting` WHERE type = 'hedis_letter' AND agerange="+entry.langid;
        }
        else if(entry.type == 2){
            query = "SELECT `id`,`name`,`desc` FROM `gsetting` WHERE type = 'hedis_email' AND agerange="+entry.langid;
        }
        else
            query = "SELECT `id`,`name`,`desc` FROM `gsetting` WHERE type = 'hedis_sms' AND agerange="+entry.langid;
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
    setHedisalerts: (entry, callback) => {
        if(entry.id == 0){
            if(entry.type == 1)
                tmptype = "hedis_letter";
            else if(entry.type == 2){
                tmptype = "hedis_email";
            }
            else
                tmptype = "hedis_sms";

            let query = "INSERT INTO `gsetting` (`id`, `name`, `desc`, `type`, `agerange`) VALUES (NULL, ?, ?, ?, ?)";
            connection.query(query, [entry.subject, entry.body, tmptype, entry.langid], (err, result) => {
                callback(err, result);
            });
        }
        else{
            let query = "UPDATE `gsetting` SET `name`=?, `desc`=? WHERE id= ?";
            connection.query(query, [entry.subject, entry.body, entry.id], (err, result) => {
                callback(err, result);
            });
        }
    },
    getptinfo: (entry) => {
        let query = "SELECT patient_list.*,pt_info.language FROM `patient_list` LEFT JOIN pt_info ON pt_info.ptid = patient_list.patientid WHERE patient_list.patientid="+entry.ptid+" AND patient_list.clinicid="+entry.clinicid+" GROUP BY patient_list.patientid";
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
    contact: (entry) => {
        let query = "INSERT INTO `contact_data` (`id`, `name`, `email`, `phone`, `message`, `date`, `status`) VALUES (NULL, ?, ?, ?, ?, ?, ?)";
        return new Promise((resolve, reject) => {
            connection.query(query,[entry.name,entry.email,entry.phone,entry.message,new Date(),1], (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
    getcontacts: (callback) => {
        let query = "SELECT * FROM `contact_data`";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getcontactquestions: (callback) => {
        let query = "SELECT * FROM `contact_questions`";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addcontactq: (entry, callback) => {
        let query = "INSERT INTO `contact_questions` (`id`, `question`, `status`) VALUES (NULL, ? , ? )";
        connection.query(query, [entry.question, entry.status], (err, result) => {
            callback(err, result);
        });
    },
    chosencontactq: (entry, callback) => {
        let query = "SELECT * FROM `contact_questions` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatecontactq: (entry, callback) => {
        let query = "UPDATE `contact_questions` SET `question`= ?, `status` = ? WHERE `id`= ? ";
        connection.query(query, [entry.question, entry.status, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletecontactq: (entry, callback) => {
        let query = "DELETE FROM `contact_questions` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletecontact: (entry, callback) => {
        let query = "DELETE FROM `contact_data` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getcredithistory: (entry, callback) => {
        let query = "SELECT credit_track.* FROM `credit_track` WHERE credit_track.clinicid = ?";
        connection.query(query,[entry.clinicid], (err, result) => {
            callback(err, result);
        });
    },

    getcontactr: (callback) => {
        let query = "SELECT * FROM `contact_res`";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addcontactr: (entry, callback) => {
        let query = "INSERT INTO `contact_res` (`id`, `name`, `status`) VALUES (NULL, ? , ? )";
        connection.query(query, [entry.name, entry.status], (err, result) => {
            callback(err, result);
        });
    },
    chosencontactr: (entry, callback) => {
        let query = "SELECT * FROM `contact_res` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatecontactr: (entry, callback) => {
        let query = "UPDATE `contact_res` SET `name`= ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletecontactr: (entry, callback) => {
        let query = "DELETE FROM `contact_res` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },


    getcontactm: (callback) => {
        let query = "SELECT * FROM `contact_modules`";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addcontactm: (entry, callback) => {
        let query = "INSERT INTO `contact_modules` (`id`, `name`, `status`) VALUES (NULL, ? , ? )";
        connection.query(query, [entry.name, entry.status], (err, result) => {
            callback(err, result);
        });
    },
    chosencontactm: (entry, callback) => {
        let query = "SELECT * FROM `contact_modules` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatecontactm: (entry, callback) => {
        let query = "UPDATE `contact_modules` SET `name`= ?, `status` = ? WHERE `id`= ? ";
        connection.query(query, [entry.name, entry.status, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletecontactm: (entry, callback) => {
        let query = "DELETE FROM `contact_modules` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    generatemodule: (entry, callback) => {
        let query = "UPDATE `contact_modules` SET `quiz`= ?, `res` = ? WHERE `id`= ? ";
        connection.query(query, [entry.quiz.toString(), entry.res.toString(), entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getmodules: (entry) => {
        let query = "SELECT * FROM `contact_modules` WHERE quiz != '' AND res != '' AND id = ?"
        return new Promise((resolve, reject) => {
            connection.query(query,[entry.id], (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
    getaquiz: (tmp) => {
        let query = "SELECT * FROM `contact_questions` WHERE id IN "+tmp
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
    getares: (tmp) => {
        let query = "SELECT * FROM `contact_res` WHERE id IN "+tmp
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
    addconnection: (entry) => {
        let query = "INSERT INTO `connections` (`id`, `clinicid`, `contacttype`, `pttype`, `fname`, `lname`, `mname`, `dob`, `lang`, `email`, `phone1`, `phone2`, `address1`, `address2`, `city`, `state`, `zip`, `question`, `dates`, `times`, `date`, `status`) VALUES (NULL, ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ? , ? )";
        return new Promise((resolve, reject) => {
            connection.query(query, [entry.clinicid, entry.contacttype, entry.pttype, entry.fname, entry.lname, entry.mname, entry.dob, entry.lang, entry.email, entry.phone1, entry.phone2, entry.address1, entry.address2, entry.city, entry.state, entry.zip, entry.question, entry.dates.toString(), entry.times.toString(),new Date(), 0], (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
    updateconnectiondesctype: (entry) => {
        let query = "SELECT id FROM `gsetting` WHERE `type`= 'connectiondesctype' AND clinicid="+entry.clinicid;
        connection.query(query, (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `gsetting` SET `age`= ? WHERE `type`= 'connectiondesctype' AND clinicid= ?";
                return new Promise((resolve, reject) => {
                    connection.query(query,[entry.value,entry.clinicid], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "INSERT INTO `gsetting` (`id`, `clinicid`, `type`, `age`) VALUES (NULL, ?,'connectiondesctype', ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query,[entry.clinicid,entry.value], (err, rows) => {
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
    updateqrcodevalue: (entry) => {
        let query = "SELECT id FROM `gsetting` WHERE `type`= 'qrcodetype' AND clinicid="+entry.clinicid;
        connection.query(query, (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `gsetting` SET `age`= ? WHERE `type`= 'qrcodetype' AND clinicid= ?";
                return new Promise((resolve, reject) => {
                    connection.query(query,[entry.value,entry.clinicid], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "INSERT INTO `gsetting` (`id`, `clinicid`, `type`, `age`) VALUES (NULL, ?,'qrcodetype', ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query,[entry.clinicid,entry.value], (err, rows) => {
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
    updateqrcodeemails: (entry) => {
        let query = "SELECT id FROM `gsetting` WHERE `type`= 'qrcodetype' AND clinicid="+entry.clinicid;
        connection.query(query, (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `gsetting` SET `desc`= ? WHERE `type`= 'qrcodetype' AND clinicid= ?";
                return new Promise((resolve, reject) => {
                    connection.query(query,[entry.value,entry.clinicid], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "INSERT INTO `gsetting` (`id`, `clinicid`, `type`, `desc`) VALUES (NULL, ?,'qrcodetype', ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query,[entry.clinicid,entry.value], (err, rows) => {
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
    updateconnectiondesc: (entry) => {
        let query = "SELECT id FROM `gsetting` WHERE `type`= 'connectiondesctype' AND clinicid="+entry.clinicid;
        connection.query(query, (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `gsetting` SET `desc`= ? WHERE `type`= 'connectiondesctype' AND clinicid="+entry.clinicid;
                return new Promise((resolve, reject) => {
                    connection.query(query,[entry.sdesc], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "INSERT INTO `gsetting` (`id`, `clinicid`, `type`, `desc`) VALUES (NULL, ?,'connectiondesctype', ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query,[entry.clinicid,entry.sdesc], (err, rows) => {
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
    updateconnectiongdesc: (gdesc) => {
        let query = "SELECT id FROM `gsetting` WHERE `type`= 'connectiongdesc'";
        connection.query(query, (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `gsetting` SET `desc`= ? WHERE `type`= 'connectiongdesc'";
                return new Promise((resolve, reject) => {
                    connection.query(query,[gdesc], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "INSERT INTO `gsetting` (`id`, `type`, `desc`) VALUES (NULL,'connectiongdesc', ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query,[gdesc], (err, rows) => {
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
    getcgdesc: () => {
        let query = "SELECT `desc` FROM `gsetting` WHERE `type`= 'connectiongdesc'";
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
    getcsdesc: (clinicid) => {
        let query = "SELECT `desc`,`age` FROM `gsetting` WHERE `type`= 'connectiondesctype' AND clinicid = "+clinicid
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
    getqrcodetype: (clinicid) => {
        let query = "SELECT `id`,`age`,`desc` FROM `gsetting` WHERE `type`= 'qrcodetype' AND clinicid = "+clinicid
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
    deleteconnections: (entry, callback) => {
        let query = "DELETE FROM `connections` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getconnections: (entry, callback) => {
        let query = "SELECT * FROM `connections` WHERE clinicid="+entry.clinicid;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    chosenconnection: (entry, callback) => {
        let query = "SELECT * FROM `connections` WHERE id="+entry.id;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addtwiliosubaccount: (entry, callback) => {
        let query = "SELECT id FROM `clinic_sms_account` WHERE `clinic_id`= "+entry.cid;
        connection.query(query, (err, result) => {
            if(result.length > 0){
                query = "UPDATE `clinic_sms_account` SET `phone_sid`= ? ,`phone_token`=?,`phone_num`=? ,`tw_api_key`=? ,`tw_api_secret` = ? ,`tw_app_sid` = ? , `tw_identity` = ? WHERE `clinic_id`= ?";
                connection.query(query, [entry.csid,entry.ctoken,entry.cphone,entry.tapikey,entry.tapisec,entry.tappsid,entry.identity,entry.cid], (err, result) => {
                    callback(err, result);
                });
            }else{
                query = "INSERT INTO `clinic_sms_account` (`clinic_id`, `phone_sid`, `phone_token`, `phone_num`,`tw_api_key`,`tw_api_secret`,`tw_app_sid`,`tw_identity`) VALUES ( ? , ? , ? , ? ,?,?,?,? )";
                connection.query(query, [entry.cid,entry.csid,entry.ctoken,entry.cphone,entry.tapikey,entry.tapisec,entry.tappsid,entry.identity], (err, result) => {
                    callback(err, result);
                });
            }

        })
        
    },
    gettwiliosubaccount: (entry, callback) => {
        let query = "SELECT * FROM `clinic_sms_account` WHERE `clinic_id`= ?";
        connection.query(query, [entry.cid], (err, result) => {
            callback(err, result);
        });
        
    },
    getAppointmentDoctorType: (entry, callback) => {
        let query = "SELECT * FROM `f_settings` WHERE `type`= 'appointment_doctor'";
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
        
    },
    setAppointmentDoctorType: (entry, callback) => {
        let query = "UPDATE `f_settings` SET `value`=? WHERE `type`= 'appointment_doctor' AND `item`=?";
        connection.query(query, [entry.value, entry.item], (err, result) => {
            callback(err, result);
        });
        
    },
}
module.exports = setting;