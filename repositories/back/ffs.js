const connection = require('../../utilities/database');

const ffs = {
    getffs: (clinicid, callback) => {
        let query = "SELECT COUNT(*) AS total FROM `ffs_table` WHERE clinicid ="+clinicid;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getclinic: (clinicid) => {
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
    searchparams: (clinicid) => {
        let query = "SELECT `desc`,`agerange`,`age` FROM `gsetting` WHERE `type`= 'multisearch' AND clinicid="+clinicid;
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
    getiCPTs: () => {
        let query = "SELECT name FROM `gsetting` WHERE type = 'icpt'";
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
    getfulldaterange: (entry) => {
        let query = "SELECT MAX(date) AS max,MIN(date) AS min FROM `ffs_table` WHERE clinicid = "+entry.clinicid;
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
    getdaterange: (entry) => {
        let query = "SELECT MAX(date) AS max,MIN(date) AS min FROM `ffs_table` WHERE clinicid = "+entry.clinicid+" AND ( ffs_table.PTCopay IS NOT NULL AND CAST(ffs_table.PTCopay AS float) > 0)";
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
    ffsloader: (entry, callback) => {
        let query = "INSERT INTO `ffs_table` (`id`, `clinicid`, `userid`, `ENC_CL`,`ENC_ID`,`PT_ID`,`PCP_ID`,`VTYPE`,`VID`,`VCODE`,`STATUS`,`date`,`CLStatus`,`CLDate`,`PTCopay`,`deduct`,`PayID`,`payorId`,`PayorT`,`type`,`T_date`,`T_mss`,`T_id`,`CPT`,`CPT_DESC`,`Mod1`,`ICD`,`ICD_DESC`,`CPT_PAY`,`MsgCode`,`InsName`) VALUES (NULL, ? , ? , ? , ?, ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? )";
        connection.query(query, [entry.clinicid, entry.userid, entry.ENC_CL, entry.ENC_ID, entry.PT_ID, entry.PCP_ID, entry.VTYPE, entry.VID, entry.VCODE, entry.STATUS, entry.date, entry.CLStatus, entry.CLDate, entry.PTCopay, entry.deduct, entry.PayID, entry.payorId, entry.PayorT, entry.type, entry.T_date, entry.T_mss, entry.T_id, entry.CPT, entry.CPT_DESC, entry.Mod1, entry.ICD, entry.ICD_DESC, entry.CPT_PAY, entry.MsgCode, entry.InsName], (err, result) => {
            callback(err, result);
        });
    },
    getins: (entry, callback) => {
        let query = "SELECT InsName FROM `ffs_table` WHERE clinicid ="+entry.clinicid+" GROUP BY InsName ORDER BY InsName";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getcopaynonpaid: (entry) => {
        if(entry.ins ==null||entry.ins == "0"){
            var where = "ffs_table.clinicid ="+entry.clinicid+" AND ffs_table.date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND ffs_table.date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND  payorT != 2";
        }
        else{
            var where = "ffs_table.clinicid ="+entry.clinicid+" AND ffs_table.date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND ffs_table.date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND  payorT != 2 AND ffs_table.InsName = '"+entry.ins+"'";
        }
        let query = "";
        if(entry.dcheck == 1 && entry.pcheck == 1){
            query = "SELECT ffs_table.id,ffs_table.ENC_ID,ffs_table.InsName,ffs_table.VTYPE,ffs_table.CPT,ffs_table.date,ffs_table.deduct,ffs_table.PTCopay,ffs_table.CPT_PAY,ffs_table.PT_ID FROM `ffs_table` WHERE "+where+" AND (ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > 0) AND (ffs_table.deduct IS NOT NULL AND CAST(ffs_table.deduct AS float) > 0) GROUP BY ffs_table.InsName,ffs_table.ENC_ID ORDER BY ffs_table.deduct DESC,ffs_table.PT_ID";
        }
        else if(entry.dcheck == 1 && entry.pcheck == 0){
            query = "SELECT ffs_table.id,ffs_table.ENC_ID,ffs_table.InsName,ffs_table.VTYPE,ffs_table.CPT,ffs_table.date,ffs_table.deduct,ffs_table.PTCopay,ffs_table.CPT_PAY,ffs_table.PT_ID FROM `ffs_table` WHERE "+where+" AND (ffs_table.deduct IS NOT NULL AND CAST(ffs_table.deduct AS float) > 0) GROUP BY ffs_table.InsName,ffs_table.ENC_ID ORDER BY ffs_table.deduct DESC,ffs_table.PT_ID";
        }
        else if(entry.dcheck == 0 && entry.pcheck == 1){
            query = "SELECT ffs_table.id,ffs_table.ENC_ID,ffs_table.InsName,ffs_table.VTYPE,ffs_table.CPT,ffs_table.date,ffs_table.deduct,ffs_table.PTCopay,ffs_table.CPT_PAY,ffs_table.PT_ID FROM `ffs_table` WHERE "+where+" AND (ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > 0) ORDER BY ffs_table.PT_ID,ffs_table.InsName";
        }
        else{
            query = "SELECT ffs_table.id,ffs_table.ENC_ID,ffs_table.InsName,ffs_table.VTYPE,ffs_table.CPT,ffs_table.date,ffs_table.deduct,ffs_table.PTCopay,ffs_table.CPT_PAY,ffs_table.PT_ID FROM `ffs_table` WHERE "+where+" AND (ffs_table.CPT_PAY IS NULL OR CAST(ffs_table.CPT_PAY AS float) = 0) AND (ffs_table.PTCopay IS NOT NULL AND CAST(ffs_table.PTCopay AS float) > 0) GROUP BY ffs_table.InsName,ffs_table.ENC_ID ORDER BY ffs_table.PT_ID,ffs_table.InsName";
        }
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
    getptinfo: (id) => {
        let query = "SELECT * FROM `patient_list` WHERE clinicid ="+id;
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
    getinvoicedata: (entry) => {
        let query = "SELECT ffs_table.id,ffs_table.ENC_ID,ffs_table.ENC_CL,ffs_table.VTYPE,ffs_table.CPT,ffs_table.CPT_DESC,ffs_table.date,ffs_table.deduct,ffs_table.PTCopay,ffs_table.PT_ID,ffs_table.InsName,ffs_table.MsgCode FROM `ffs_table` WHERE id = "+entry.id;
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
    setpaymentsession: (clinicid,id, sesssionid) => {
        let query = "INSERT INTO `copay_payment` (`id`, `clinicid`, `pay_id`, `sid`, `flag`) VALUES (NULL, "+clinicid+" , "+id+" , '"+sesssionid+"', 0)";
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
    checksid: (entry, callback) => {
        let query = "SELECT id FROM `copay_payment` WHERE pay_id ='"+entry.id+"' AND flag = 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    setsid: (entry, callback) => {
        let query = "UPDATE `copay_payment` SET `flag` = ? WHERE sid =?";
        connection.query(query, [1, entry.sid], (err, result) => {
            callback(err, result);
        });
    },
    setpdfinvoice: (entry) => {
        let query = "SELECT * FROM `coinvoice_status` WHERE type = 1 AND pay_id = ?";
        connection.query(query, [entry.id], (err, result) => {
            if(result.length == 0){
                let query = "INSERT INTO `coinvoice_status` (`id`, `pay_id`, `type`, `date`) VALUES (NULL, ? , ? , ? )";
                return new Promise((resolve, reject) => {
                    connection.query(query, [entry.id, 1, new Date()], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "UPDATE `coinvoice_status` SET `date` = ? WHERE `pay_id`= ? AND `type`= 1";
                return new Promise((resolve, reject) => {
                    connection.query(query, [new Date(),entry.id], (err, rows) => {
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
    setemailinvoice: (entry) => {
        let query = "SELECT * FROM `coinvoice_status` WHERE type = 2 AND pay_id = ?";
        connection.query(query, [entry.id], (err, result) => {
            if(result.length == 0){
                let query = "INSERT INTO `coinvoice_status` (`id`, `pay_id`, `type`, `date`) VALUES (NULL, ? , ? , ? )";
                return new Promise((resolve, reject) => {
                    connection.query(query, [entry.id, 2, new Date()], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "UPDATE `coinvoice_status` SET `date` = ? WHERE `pay_id`= ? AND `type`= 2";
                return new Promise((resolve, reject) => {
                    connection.query(query, [new Date(),entry.id], (err, rows) => {
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
    setsmsinvoice: (entry) => {
        let query = "SELECT * FROM `coinvoice_status` WHERE type = 3 AND pay_id = ?";
        connection.query(query, [entry.id], (err, result) => {
            if(result.length == 0){
                let query = "INSERT INTO `coinvoice_status` (`id`, `pay_id`, `type`, `date`) VALUES (NULL, ? , ? , ? )";
                return new Promise((resolve, reject) => {
                    connection.query(query, [entry.id, 3, new Date()], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "UPDATE `coinvoice_status` SET `date` = ? WHERE `pay_id`= ? AND `type`= 3";
                return new Promise((resolve, reject) => {
                    connection.query(query, [new Date(),entry.id], (err, rows) => {
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
    getinvoicestatus: (entry) => {
        let query = "SELECT * FROM `coinvoice_status` WHERE pay_id = "+entry.id+" GROUP BY `type` ORDER BY `type`";
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
    getmultibillins: (entry) => {
        let query = "SELECT InsName FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND clinicid = "+entry.clinicid+" GROUP BY InsName ORDER BY InsName";
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
    getmultibill: (entry) => {
        let query = "SELECT CPT,CPT_DESC,InsName,MAX(ffs_table.CPT_PAY) AS max FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND clinicid = "+entry.clinicid+" AND CPT IS NOT NULL GROUP BY CPT,InsName ORDER BY CPT,InsName";
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
    getacodessuper: (entry) => {
        let query = "SELECT CPT FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY CPT";
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
    getnogroupcodessuper: (entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics) => {
        let query = "SELECT ffs_table.clinicid,clinics.name AS clinicname,ffs_table.CPT,ffs_table.CPT_DESC,ffs_table.InsName,MAX(ffs_table.CPT_PAY) AS max,ffs_table.VTYPE,ffs_table.ICD,ffs_table.ICD_DESC,ffs_table.Mod1 FROM `ffs_table` JOIN `clinics` ON `clinics`.id = `ffs_table`.clinicid WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.CPT NOT IN "+tmpgcodestring+(entry.type == 1?" AND ffs_table.clinicid = "+entry.clinicid:"")+(entry.type == 3?" AND ffs_table.clinicid != "+entry.clinicid+" AND ffs_table.CPT NOT IN "+tmpacodestring:"")+((entry.type == 3||entry.type == 2)&&aspecclinics.length > 0?" AND ffs_table.clinicid IN "+tmpaspecclinicstring:"")+" AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY ffs_table.clinicid,ffs_table.CPT,ffs_table.InsName ORDER BY ffs_table.CPT,ffs_table.InsName";
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
    getgroupcodessuper: (entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics) => {
        let query = "SELECT ffs_table.clinicid,clinics.name AS clinicname,gsetting.name AS name,t1.name AS subname,ffs_table.CPT,ffs_table.CPT_DESC,ffs_table.InsName,MAX(ffs_table.CPT_PAY) AS max,ffs_table.VTYPE,ffs_table.ICD,ffs_table.ICD_DESC,ffs_table.Mod1 FROM `ffs_table` JOIN `clinics` ON `clinics`.id = `ffs_table`.clinicid JOIN `paidcptcode` ON `paidcptcode`.cpt = `ffs_table`.CPT LEFT JOIN `gsetting` ON `gsetting`.id = `paidcptcode`.gid AND gsetting.type='pgroup' LEFT JOIN gsetting AS t1 ON t1.id = paidcptcode.sgid AND t1.type='spgroup' WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.Mod1 != 95"+(entry.type == 1?" AND ffs_table.clinicid="+entry.clinicid:"")+(entry.type == 3?" AND ffs_table.clinicid != "+entry.clinicid+" AND ffs_table.CPT NOT IN "+tmpacodestring:"")+((entry.type == 3||entry.type == 2)&&aspecclinics.length > 0?" AND ffs_table.clinicid IN "+tmpaspecclinicstring:"")+" AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) "+(entry.group==1?"":" AND paidcptcode.gid="+entry.group)+" GROUP BY ffs_table.clinicid,ffs_table.CPT,ffs_table.InsName ORDER BY gsetting.name,t1.name DESC,ffs_table.CPT,ffs_table.InsName";
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
    getmodgroupcodessuper: (entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics) => {
        let query = "SELECT ffs_table.clinicid,clinics.name AS clinicname,gsetting.name AS name,t1.name AS subname,ffs_table.CPT,ffs_table.CPT_DESC,ffs_table.InsName,MAX(ffs_table.CPT_PAY) AS max,ffs_table.VTYPE,ffs_table.ICD,ffs_table.ICD_DESC,ffs_table.Mod1 FROM `ffs_table` JOIN `clinics` ON `clinics`.id = `ffs_table`.clinicid JOIN `paidcptcode` ON `paidcptcode`.cpt = `ffs_table`.CPT AND paidcptcode.selectmodifier IS NOT NULL LEFT JOIN `gsetting` ON `gsetting`.id = `paidcptcode`.tmpgid AND gsetting.type='pgroup' LEFT JOIN gsetting AS t1 ON t1.id = paidcptcode.tmpsgid AND t1.type='spgroup' WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.Mod1 = 95"+(entry.type == 1?" AND ffs_table.clinicid="+entry.clinicid:"")+(entry.type == 3?" AND ffs_table.clinicid != "+entry.clinicid+" AND ffs_table.CPT NOT IN "+tmpacodestring:"")+((entry.type == 3||entry.type == 2)&&aspecclinics.length > 0?" AND ffs_table.clinicid IN "+tmpaspecclinicstring:"")+" AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) "+(entry.group==1?"":" AND paidcptcode.tmpgid="+entry.group)+" GROUP BY ffs_table.clinicid,ffs_table.CPT,ffs_table.InsName ORDER BY gsetting.name,t1.name DESC,ffs_table.CPT,ffs_table.InsName";
       
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
    getdeductiblereportbypcp: (entry) => {
        let query = "SELECT users.fullname,SUM(tb1.deduct) AS totalded,SUM(tb1.CPT_PAY) AS totalpaid FROM (SELECT * FROM `ffs_table` WHERE ffs_table.clinicid ="+entry.clinicid+" AND ffs_table.date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND ffs_table.date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND  payorT != 2 AND (ffs_table.deduct IS NOT NULL AND CAST(ffs_table.deduct AS float) > 0) GROUP BY ENC_ID) tb1 LEFT JOIN `users` ON `users`.userid = `tb1`.PCP_ID WHERE `users`.clinicid = "+entry.clinicid+" GROUP BY tb1.PCP_ID ORDER BY users.fullname";
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
    getdeductiblereportbyins: (entry) => {
        let query = "SELECT tb1.InsName,SUM(tb1.deduct) AS totalded,SUM(tb1.CPT_PAY) AS totalpaid FROM (SELECT * FROM `ffs_table` WHERE ffs_table.clinicid ="+entry.clinicid+" AND ffs_table.date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND ffs_table.date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND  payorT != 2 AND (ffs_table.deduct IS NOT NULL AND CAST(ffs_table.deduct AS float) > 0) GROUP BY ffs_table.InsName,ENC_ID) tb1 GROUP BY tb1.InsName ORDER BY tb1.InsName";
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
}
module.exports = ffs;