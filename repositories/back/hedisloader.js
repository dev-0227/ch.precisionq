const connection = require('../../utilities/database');
function _calculateAge(currentdate,birthday) { // birthday is a date
    var ageDifMs = new Date(currentdate) - new Date(birthday).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970)-1;
}
function yearsDiff(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    let yearsDiff =  date2.getFullYear() - date1.getFullYear();
    return yearsDiff;
}
function monthsDiff(d1, d2) {
    let date1 = new Date(d1);
    let date2 = new Date(d2);
    let years = yearsDiff(d1, d2);
    let months =(years * 12) + (date2.getMonth() - date1.getMonth()) ;
    return months;
}
const hedisloader = {
    getimeasure: () => {
        let query = "SELECT name FROM `gsetting` WHERE `type` = 'imeasure'";
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
    getpatientsbyclinic: (clinicid) => {
        let query = "SELECT emr_id FROM `hedis_track` WHERE `emr_id` IS NOT NULL AND clinicid = "+clinicid+" GROUP BY emr_id";
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
    getfields: (entry) => {
        let query = "SELECT id,fields FROM `hedis_fields_variables` WHERE `variables` LIKE '%"+entry+"%'";
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
    getallpts: (clinicid) => {
        let query = "SELECT patientid,FNAME,LNAME,EMAIL,PHONE,DOB FROM `patient_list` WHERE clinicid = "+clinicid;
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
    getemrId: (clinicid,ptlname,dob) => {
        let query = "SELECT patientid,FNAME,LNAME,EMAIL,PHONE FROM `patient_list` WHERE DOB = '"+dob+"' AND '"+ptlname+"' LIKE concat('%',LNAME,'%') AND clinicid = "+clinicid;
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
    gettmpmeasure: (measure) => {
        let query = `SELECT id,Rates,quantity,multicheck FROM mh_table WHERE keywords LIKE "%${measure}%"`;
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
    getmeasure: (measure) => {
        let query = `SELECT id,Rates,quantity,multicheck FROM mh_table WHERE keywords LIKE "%${measure}%" AND multicheck <> 1`;
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
    getHedisMeasure: (measure) => {
        let query = `SELECT id,multiple,multipleQuantity FROM measure_hedis WHERE nameMap LIKE "%${measure}%" AND multiple <> 1`;
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
    getmultimeasure: (measure) => {
        let query = `SELECT id,Rates,quantity,multicheck FROM mh_table WHERE keywords LIKE "%${measure}%" AND multicheck = 1`;
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
    getMultipleHedisMeasure: (measure) => {
        let query = `SELECT id,multiple,multipleQuantity FROM measure_hedis WHERE nameMap LIKE "%${measure}%" AND multiple = 1`;
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
    getexistedmid: (clinicid,insid) => {
        let query = "SELECT mid FROM `hedis_track` WHERE clinicid="+clinicid+" AND insid="+insid+" GROUP BY mid";
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
    getgenerated: (clinicid,insid,cyear) => {
        let query = "SELECT COUNT(tb.mid) AS total FROM (SELECT mid FROM `hedis_track` WHERE gstatus = 1 AND clinicid="+clinicid+" AND insid="+insid+" AND cyear = '"+cyear+"' GROUP BY mid) tb";
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
    getreported: (clinicid,insid,cyear) => {
        let query = "SELECT COUNT(tb.mid) AS total FROM (SELECT mid FROM `hedis_track` WHERE rstatus = 1 AND clinicid="+clinicid+" AND insid="+insid+" AND cyear = '"+cyear+"' GROUP BY mid) tb";
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
    getnolonger: (clinicid,insid,cyear) => {
        let query = "SELECT COUNT(tb.mid) AS total FROM (SELECT mid FROM `hedis_track` WHERE hstatus = 3 AND clinicid="+clinicid+" AND insid="+insid+" AND cyear = '"+cyear+"' GROUP BY mid) tb";
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
    getnewpt: (clinicid,insid,cyear, callback) => {
        let query = "SELECT COUNT(tb.mid) AS total FROM (SELECT mid FROM `hedis_track` WHERE hstatus = 2 AND clinicid="+clinicid+" AND insid="+insid+" AND cyear = '"+cyear+"' GROUP BY mid) tb";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getlabs: (clinicid, callback) => {
        let query = "SELECT COUNT(*) AS total FROM `lab_HL7_data` WHERE clinicid = ?";
        connection.query(query, [clinicid], (err, result) => {
            callback(err, result);
        });
    },
    getencs: (clinicid, callback) => {
        let query = "SELECT COUNT(*) AS total FROM `encounters` WHERE clinicid = ?";
        connection.query(query, [clinicid], (err, result) => {
            callback(err, result);
        });
    },
    getvaccines: (clinicid, callback) => {
        let query = "SELECT COUNT(*) AS total FROM `vaccines` WHERE clinicid = ?";
        connection.query(query, [clinicid], (err, result) => {
            callback(err, result);
        });
    },
    getprevandnext: (clinicid, callback) => {
        let query = "SELECT COUNT(*) AS total FROM `hedis_track` WHERE clinicid = ?";
        connection.query(query, [clinicid], (err, result) => {
            callback(err, result);
        });
    },
    updatehstatus: (clinicid,insid) => {
        let query = "UPDATE `hedis_track` SET `hstatus`= 1 WHERE clinicid="+clinicid+" AND insid="+insid;
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
    updatenolonger: (clinicid,insid,tmpmid) => {
        let query = "UPDATE `hedis_track` SET `hstatus`= 3 WHERE clinicid="+clinicid+" AND insid="+insid+" AND mid NOT IN "+tmpmid;
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
    getcurrentData: (clinicid,insid,cyear) => {
        let query = "SELECT * FROM `hedis_track` WHERE clinicid="+clinicid+" AND insid="+insid+" AND cyear='"+cyear+"'";
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
    //existed = 1 new = 2 no longer = 3 multicheck = 0
    qualityloader: (entry,flag, callback) => {
        let query = "";
        if(flag == 1){
            query = "SELECT id FROM `hedis_track` WHERE cyear = ? AND clinicid = ? AND insid = ? AND mid = ? AND measureid = ? AND hstatus = 1";
            connection.query(query, [entry.cyear, entry.clinicid,entry.insid,entry.mid,entry.measureid], (err, result) => {
                if(result.length == 0){
                    let query = "INSERT INTO `hedis_track` (`id`, `cyear`, `clinicid`, `insid`,`emr_id`,`mid`,`ptfname`,`ptlname`,`dob`,`phone`,`email`,`mlob`,`measureid`,`measure`,`ins_pcp_id`,`flag`,`status`,`hstatus`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?,  ? , ? , ? , ?, ?, ? )";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.insid, entry.emr_id, entry.mid, entry.ptfname, entry.ptlname, entry.dob, entry.phone, entry.email, entry.mlob, entry.measureid, entry.measure, entry.ins_pcp_id, entry.flag, entry.status, entry.hstatus], (err, result) => {
                        callback(err, result);
                    });
                }   
            });
        }
        else{
            query = "SELECT id FROM `hedis_track` WHERE cyear = ? AND clinicid = ? AND insid = ? AND mid = ? AND measure = ?";
            
            connection.query(query, [entry.cyear, entry.clinicid,entry.insid,entry.mid,entry.measure], (err, result) => {
                if(result.length == 0){
                    let query = "INSERT INTO `hedis_track` (`id`, `cyear`, `clinicid`, `insid`,`emr_id`,`mid`,`ptfname`,`ptlname`,`dob`,`phone`,`email`,`mlob`,`measureid`,`measure`,`ins_pcp_id`,`flag`,`status`,`hstatus`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?,  ? , ? , ? , ?, ?, ? )";
                    
                    connection.query(query, [entry.cyear, entry.clinicid, entry.insid, entry.emr_id, entry.mid, entry.ptfname, entry.ptlname, entry.dob, entry.phone, entry.email, entry.mlob, entry.measureid, entry.measure, entry.ins_pcp_id, entry.flag, entry.status, entry.hstatus], (err, result) => {
                        callback(err, result);
                    });
                }   
            });
        }
        
    },
    tmpqualityloader: (entry, callback) => {
        let query = "INSERT INTO `hedis_track` (`id`, `cyear`, `clinicid`, `insid`,`emr_id`,`mid`,`ptfname`,`ptlname`,`dob`,`phone`,`email`,`mlob`,`measureid`,`measure`,`ins_pcp_id`,`flag`,`status`,`dos`,`value1`,`value2`,`cpt1`,`cpt2`,`icd1`,`icd2`,`icdv1`,`icdv2`,`gstatus`,`rstatus`,`hstatus`,`apptdate`,`apptpcp`,`apptvisit`,`nextdate`,`lastdate`,`lastpcp`,`lastvisit`) VALUES (NULL, ? , ? , ? , ?,  ? , ?, ?, ? , ? , ? , ?,  ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?,? )";
        connection.query(query, [entry.cyear, entry.clinicid, entry.insid, entry.emr_id, entry.mid, entry.ptfname, entry.ptlname, entry.dob, entry.phone, entry.email, entry.mlob, entry.measureid, entry.measure, entry.ins_pcp_id, entry.flag, entry.status, entry.dos, entry.value1, entry.value2, entry.cpt1, entry.cpt2, entry.icd1, entry.icd2, entry.icdv1, entry.icdv2, entry.gstatus, entry.rstatus, entry.hstatus, entry.apptdate, entry.apptpcp, entry.apptvisit, entry.nextdate, entry.lastdate, entry.lastpcp, entry.lastvisit], (err, result) => {
            callback(err, result);
        });
    },
    deletedata: (entry, callback) => {
        let query = "DELETE FROM `hedis_track` WHERE `clinicid`= ? AND `cyear`=? AND `insid`=?";
        connection.query(query, [entry.clinicid,entry.cyear,entry.insid], (err, result) => {
            callback(err, result);
        });
    },
    getchosenclinic: (clinicid) => {
        let query = "SELECT * FROM `clinics` WHERE `id` ="+clinicid;
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
    encloader: (entry, callback) => {
        let query = "INSERT INTO `encounters` (`id`, `cyear`, `clinicid`, `encounterId`,`patientid`,`pcpId`,`encType`,`visitType`,`date`,`icd`,`bmi`,`bmi_per`) VALUES (NULL, ? , ? , ? , ?,  ? , ?, ?, ? , ? , ? , ?)";
        connection.query(query, [entry.cyear, entry.clinicid, entry.encounterid, entry.patientId, entry.doctorid, entry.enctype, entry.ENC_VISIT_TYPE, entry.date, entry.ICD_CODE, entry.BMI, entry.BMI_PER], (err, result) => {
            callback(err, result);
        });
    },
    vitalloader: (entry, callback) => {
        if(entry.systollic!=null&&entry.diastollic!=null){
            let query = "INSERT INTO `vitals` (`id`, `cyear`, `clinicid`, `pid`,`encID`,`Value`,`Value2`,`BP`,`keyvalue`,`date`) VALUES (NULL, ? , ? , ? , ?,  ? , ?, ?, ? , ?)";
            connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, entry.encounterid, entry.systollic, entry.diastollic, entry.BP,"BP", entry.date], (err, result) => {
                callback(err, result);
            });
        }
        if(entry.MedVerf!=null){
            let query = "INSERT INTO `vitals` (`id`, `cyear`, `clinicid`, `pid`,`encID`,`Value`,`keyvalue`,`date`) VALUES (NULL, ? , ? , ? , ?,  ? , ?, ?)";
            connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, entry.encounterid, "Yes","Medication Review", entry.date], (err, result) => {
                callback(err, result);
            });
        }
        if(entry.PainScale!=null){
            let query = "INSERT INTO `vitals` (`id`, `cyear`, `clinicid`, `pid`,`encID`,`Value`,`keyvalue`,`date`) VALUES (NULL, ? , ? , ? , ?,  ? , ?, ?)";
            connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, entry.encounterid, entry.PainScale,"Pain", entry.date], (err, result) => {
                callback(err, result);
            });
        }
        if(entry.AdultCare!= null&&entry.AdultCare.includes("Functional")){
            let query = "INSERT INTO `vitals` (`id`, `cyear`, `clinicid`, `pid`,`encID`,`Value`,`keyvalue`,`date`) VALUES (NULL, ? , ? , ? , ?,  ? , ?, ?)";
            connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, entry.encounterid, entry.Advalue,"FSA", entry.date], (err, result) => {
                callback(err, result);
            });
        }
        if(entry.AdultCare!= null&&entry.AdultCare.includes("Advance")){
            let query = "INSERT INTO `vitals` (`id`, `cyear`, `clinicid`, `pid`,`encID`,`Value`,`keyvalue`,`date`) VALUES (NULL, ? , ? , ? , ?,  ? , ?, ?)";
            connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, entry.encounterid, entry.Advalue,"ACP", entry.date], (err, result) => {
                callback(err, result);
            });
        }
    },
    hedistrackloader: (entry, callback) => {
        let age = _calculateAge(entry.DOB,entry.cyear+"-12-31");
        let months = monthsDiff(new Date(entry.DOB),new Date());
        if(entry.systollic!=null&&entry.diastollic!=null){
            let measureid = null;
            let cpt1 = null;
            let cpt2 = null;
            let icd1 = null;
            let icd2 = null;
            var query = "SELECT mh_table.id,cpt_icd_map.CPT_1,cpt_icd_map.CPT_2,cpt_icd_map.ICD_10,cpt_icd_map.ICD_10_2,cpt_icd_map.ICD_10_3,cpt_icd_map.ICD_10_4 FROM `mh_table` LEFT JOIN `cpt_icd_map` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE cpt_icd_map.Des LIKE '%syst%' AND cpt_icd_map.Value = ? GROUP BY mh_table.id";
            connection.query(query, [entry.systollic], (err, syst) => {
                if(syst.length > 0){
                    measureid = syst[0]['id'];
                    cpt1 = syst[0]['CPT_1'];
                    icd1 = syst[0]['ICD_10'];
                    var query = "SELECT mh_table.id,cpt_icd_map.CPT_1,cpt_icd_map.CPT_2,cpt_icd_map.ICD_10,cpt_icd_map.ICD_10_2,cpt_icd_map.ICD_10_3,cpt_icd_map.ICD_10_4 FROM `mh_table` LEFT JOIN `cpt_icd_map` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE cpt_icd_map.Des LIKE '%dias%' AND cpt_icd_map.Value = ? GROUP BY mh_table.id";
                    connection.query(query, [entry.diastollic], (err, dias) => {
                        if(dias.length > 0){
                            cpt2 = dias[0]['CPT_1'];
                            icd2 = dias[0]['ICD_10'];
                            var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`Value2`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?, ? , ? , ? , ?)";
                            connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, measureid, 1, entry.userid, new Date(), entry.systollic, entry.diastollic, entry.date, cpt1, cpt2, icd1, icd2, "BP"], (err, result) => {
                                callback(err, result);
                            });
                        }
                    });
                }
                
            });
        }
        if(entry.PainScale!=null){
            let measureid = null;
            let cpt1 = null;
            let cpt2 = null;
            let icd1 = null;
            let icd2 = null;
            var query = "SELECT cpt_icd_map.M_ID AS id,cpt_icd_map.CPT_1,cpt_icd_map.CPT_2,cpt_icd_map.ICD_10,cpt_icd_map.ICD_10_2,cpt_icd_map.ICD_10_3,cpt_icd_map.ICD_10_4 FROM `cpt_icd_map` WHERE cpt_icd_map.Des LIKE '%Pain%' AND cpt_icd_map.Value = ?";
            connection.query(query, [entry.PainScale], (err, pain) => {
                if(pain.length > 0){
                    measureid = pain[0]['id'];
                    cpt1 = pain[0]['CPT_1'];
                    cpt2 = pain[0]['CPT_2'];
                    icd1 = pain[0]['ICD_10'];
                    icd2 = pain[0]['ICD_10_2'];
                    var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?, ? , ? , ?)";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, measureid, 1, entry.userid, new Date(), entry.PainScale, entry.date, cpt1, cpt2, icd1, icd2, "Pain"], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
        if(entry.MedVerf!=null){
            let measureid = null;
            let cpt1 = null;
            let cpt2 = null;
            let icd1 = null;
            let icd2 = null;
            var query = "SELECT mh_table.id,cpt_icd_map.CPT_1,cpt_icd_map.CPT_2,cpt_icd_map.ICD_10,cpt_icd_map.ICD_10_2,cpt_icd_map.ICD_10_3,cpt_icd_map.ICD_10_4 FROM `mh_table` LEFT JOIN `cpt_icd_map` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE cpt_icd_map.Des LIKE '%Medication Review%' GROUP BY mh_table.id";
            connection.query(query, (err, medrev) => {
                if(medrev.length > 0){
                    measureid = medrev[0]['id'];
                    cpt1 = medrev[0]['CPT_1'];
                    cpt2 = medrev[0]['CPT_2'];
                    icd1 = medrev[0]['ICD_10'];
                    icd2 = medrev[0]['ICD_10_2'];
                    var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?, ? , ? , ?)";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, measureid, 1, entry.userid, new Date(), "Yes", entry.date, cpt1, cpt2, icd1, icd2, "Medrev"], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
        if(entry.AdultCare!= null&&entry.AdultCare.includes("Advance")){
            let measureid = null;
            let cpt1 = null;
            let cpt2 = null;
            let icd1 = null;
            let icd2 = null;
            
            var query = "SELECT mh_table.id,cpt_icd_map.CPT_1,cpt_icd_map.CPT_2,cpt_icd_map.ICD_10,cpt_icd_map.ICD_10_2,cpt_icd_map.ICD_10_3,cpt_icd_map.ICD_10_4 FROM `mh_table` LEFT JOIN `cpt_icd_map` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE mh_table.keywords LIKE '%ACP%' GROUP BY mh_table.id";
            connection.query(query, (err, acp) => {
                if(acp.length > 0){
                    measureid = acp[0]['id'];
                    cpt1 = acp[0]['CPT_1'];
                    cpt2 = acp[0]['CPT_2'];
                    icd1 = acp[0]['ICD_10'];
                    icd2 = acp[0]['ICD_10_2'];
                    var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?, ? , ? , ?)";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, measureid, 1, entry.userid, new Date(), entry.Advalue, entry.date, cpt1, cpt2, icd1, icd2, "ACP"], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
        if(entry.AdultCare!= null&&entry.AdultCare.includes("Functional")){
            let measureid = null;
            let cpt1 = null;
            let cpt2 = null;
            let icd1 = null;
            let icd2 = null;
            
            var query = "SELECT mh_table.id,cpt_icd_map.CPT_1,cpt_icd_map.CPT_2,cpt_icd_map.ICD_10,cpt_icd_map.ICD_10_2,cpt_icd_map.ICD_10_3,cpt_icd_map.ICD_10_4 FROM `mh_table` LEFT JOIN `cpt_icd_map` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE mh_table.keywords LIKE '%FSA%' GROUP BY mh_table.id";
            connection.query(query, (err, fsa) => {
                if(fsa.length > 0){
                    measureid = fsa[0]['id'];
                    cpt1 = fsa[0]['CPT_1'];
                    cpt2 = fsa[0]['CPT_2'];
                    icd1 = fsa[0]['ICD_10'];
                    icd2 = fsa[0]['ICD_10_2'];
                    var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?, ? , ? , ?)";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, measureid, 1, entry.userid, new Date(), entry.Advalue, entry.date, cpt1, cpt2, icd1, icd2, "FSA"], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
        if(entry.BMI_PER!=null){
            var query = "SELECT icd FROM `cim_range` WHERE v1 <= ? AND v2 >= ? AND cimid = 1453";
            connection.query(query,[entry.BMI_PER,entry.BMI_PER], (err, tmpicd) => {
                if(tmpicd.length > 0){
                    var query = "SELECT cpt_icd_map.M_ID AS id,cpt_icd_map.CPT_1,cpt_icd_map.CPT_2,cpt_icd_map.ICD_10,cpt_icd_map.ICD_10_2,cpt_icd_map.ICD_10_3,cpt_icd_map.ICD_10_4 FROM `cpt_icd_map` WHERE Des LIKE '%Weight Assessment%' AND age_to >= ? AND age_from <= ? AND (ICD_10 = ? OR ICD_10_2 = ? OR ICD_10_3 = ? OR ICD_10_4 = ?)";
                    connection.query(query,[age,age,tmpicd[0]['icd'],tmpicd[0]['icd'],tmpicd[0]['icd'],tmpicd[0]['icd']], (err, weight) => {
                        if(typeof weight != "undefined"&&weight.length > 0){
                            var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`ICD3`,`ICD4`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ? , ?)";
                            connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, weight[0]['id'], 1, entry.userid, new Date(), entry.BMI_PER, entry.date, weight[0]['CPT_1'], weight[0]['CPT_2'], weight[0]['ICD_10'], weight[0]['ICD_10_2'], weight[0]['ICD_10_3'], weight[0]['ICD_10_4'], "WgtNutr Activity"], (err, result) => {
                                callback(err, result);
                            });
                        }
                    });
                }
            });
            var query = "SELECT mh_table.id,cpt_icd_map.CPT_1,cpt_icd_map.CPT_2,cpt_icd_map.ICD_10,cpt_icd_map.ICD_10_2,cpt_icd_map.ICD_10_3,cpt_icd_map.ICD_10_4 FROM `mh_table` LEFT JOIN `cpt_icd_map` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE mh_table.keywords LIKE '%WgtNutr Activity%' AND mh_table.Rates NOT LIKE '%Weight%' GROUP BY mh_table.id";
            connection.query(query, (err, tmpwgt) => {
                if(tmpwgt.length > 0){
                    for(var i = 0;i < tmpwgt.length;i++){
                        if(entry.ICD_CODE != null && entry.ICD_CODE != "" && (entry.ICD_CODE == tmpwgt[i]['ICD_10'] || entry.ICD_CODE == tmpwgt[i]['ICD_10_2'] || entry.ICD_CODE == tmpwgt[i]['ICD_10_3'] || entry.ICD_CODE == tmpwgt[i]['ICD_10_4'])){
                            var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`ICD3`,`ICD4`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?, ? , ? , ?, ? , ?)";
                            connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, tmpwgt[i]['id'], 1, entry.userid, new Date(), "Yes", entry.date, tmpwgt[i]['CPT_1'], tmpwgt[i]['CPT_2'], tmpwgt[i]['ICD_10'], tmpwgt[i]['ICD_10_2'], tmpwgt[i]['ICD_10_3'], tmpwgt[i]['ICD_10_4'], "WgtNutr Activity"], (err, result) => {
                                callback(err, result);
                            });
                        }
                    }
                }
            });
        }
        if(age>=3&&age<=21){
            var query = "SELECT mh_table.id,CPT_1,CPT_2,ICD_10,ICD_10_2,ICD_10_3,ICD_10_4 FROM `cpt_icd_map` LEFT JOIN `mh_table` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE cpt_icd_map.Des LIKE '%Well Care Visit%' AND cpt_icd_map.age_to >= ? AND cpt_icd_map.age_from <= ?";
            connection.query(query,[age,age], (err, wcv) => {
                if(wcv.length > 0){
                    measureid = wcv[0]['id'];
                    cpt1 = wcv[0]['CPT_1'];
                    cpt2 = wcv[0]['CPT_2'];
                    icd1 = wcv[0]['ICD_10'];
                    icd2 = wcv[0]['ICD_10_2'];
                    icd3 = wcv[0]['ICD_10_3'];
                    icd4 = wcv[0]['ICD_10_4'];
                    var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`ICD3`,`ICD4`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ? , ?)";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, measureid, 1, entry.userid, new Date(), "Yes", entry.date, cpt1, cpt2, icd1, icd2, icd3, icd4, "Adolescent Well"], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
        if(months <= 15){
            var query = "SELECT mh_table.id,CPT_1,CPT_2,ICD_10,ICD_10_2,ICD_10_3,ICD_10_4 FROM `cpt_icd_map` LEFT JOIN `mh_table` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE cpt_icd_map.Des LIKE '%Well-Child 0–15%'";
            connection.query(query, (err, w15) => {
                if(w15.length > 0){
                    measureid = w15[0]['id'];
                    cpt1 = w15[0]['CPT_1'];
                    cpt2 = w15[0]['CPT_2'];
                    icd1 = w15[0]['ICD_10'];
                    icd2 = w15[0]['ICD_10_2'];
                    icd3 = w15[0]['ICD_10_3'];
                    icd4 = w15[0]['ICD_10_4'];
                    var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`ICD3`,`ICD4`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ? , ?)";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, measureid, 1, entry.userid, new Date(), "Yes", entry.date, cpt1, cpt2, icd1, icd2, icd3, icd4, "W15 Visits"], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
        if(months <= 30&&months > 15){
            var query = "SELECT mh_table.id,CPT_1,CPT_2,ICD_10,ICD_10_2,ICD_10_3,ICD_10_4 FROM `cpt_icd_map` LEFT JOIN `mh_table` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE cpt_icd_map.Des LIKE '%Well-Child 0–30%'";
            connection.query(query, (err, w30) => {
                if(w30.length > 0){
                    measureid = w30[0]['id'];
                    cpt1 = w30[0]['CPT_1'];
                    cpt2 = w30[0]['CPT_2'];
                    icd1 = w30[0]['ICD_10'];
                    icd2 = w30[0]['ICD_10_2'];
                    icd3 = w30[0]['ICD_10_3'];
                    icd4 = w30[0]['ICD_10_4'];
                    var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`ICD3`,`ICD4`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ? , ?)";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, measureid, 1, entry.userid, new Date(), "Yes", entry.date, cpt1, cpt2, icd1, icd2, icd3, icd4, "W30 Visits"], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
    },
    labloader: (entry, callback) => {
        var query = "INSERT INTO `lab_HL7_data` (`id`, `cyear`, `clinicid`, `labid`,`TnameDetail`,`value`,`units`,`range`) VALUES (NULL, ? , ? , ? , ?,  ? , ?, ?)";
        connection.query(query, [entry.cyear, entry.clinicid, entry.RId_HL7, entry.name_HL7, entry.value_HL7, entry.units_HL7, entry.range_HL7], (err, result) => {
            var query = "SELECT id FROM `lab_HL7_data` WHERE clinicid = ? AND labid = ?";
            connection.query(query,[entry.clinicid,entry.RId_HL7], (err, result) => {
                var query = "INSERT INTO `lab_Data` (`id`, `cyear`, `clinicid`, `reportId`,`insuranceName`,`encID`,`pID`,`encType`,`ResultDate`) VALUES (NULL, ? , ? , ? , ?,  ? , ?, ?, ?)";
                connection.query(query, [entry.cyear, entry.clinicid, result[0]['id'], entry.insuranceName, entry.Lab_D_Encounter, entry.patientId, entry.enctype, entry.date], (err, result) => {
                    callback(err, result);
                });
                var query = "INSERT INTO `lab_orders` (`id`, `cyear`, `clinicid`, `reportId`,`testName`) VALUES (NULL, ? , ? , ? , ?)";
                connection.query(query, [entry.cyear, entry.clinicid, result[0]['id'], entry.LAB_testName], (err, result) => {
                    callback(err, result);
                });
            });
        });
        
    },
    labtrackloader: (entry, callback) => {
        if(entry.name_HL7!= null&&entry.name_HL7.includes("Occult")){
            let measureid = null;
            let cpt1 = null;
            let cpt2 = null;
            let icd1 = null;
            let icd2 = null;
            let icd3 = null;
            let icd4 = null;
            
            var query = "SELECT mh_table.id,cpt_icd_map.CPT_1,cpt_icd_map.CPT_2,cpt_icd_map.ICD_10,cpt_icd_map.ICD_10_2,cpt_icd_map.ICD_10_3,cpt_icd_map.ICD_10_4 FROM `mh_table` LEFT JOIN `cpt_icd_map` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE mh_table.keywords LIKE '%Colon Cancer%' AND mh_table.Rates LIKE '%GUAIC%' GROUP BY mh_table.id";
            connection.query(query, (err, colon) => {
                if(colon.length > 0){
                    measureid = colon[0]['id'];
                    cpt1 = colon[0]['CPT_1'];
                    cpt2 = colon[0]['CPT_2'];
                    icd1 = colon[0]['ICD_10'];
                    icd2 = colon[0]['ICD_10_2'];
                    icd3 = colon[0]['ICD_10_3'];
                    icd4 = colon[0]['ICD_10_4'];
                    var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`ICD3`,`ICD4`,`Subscriberno`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?, ? , ? , ?, ? , ? , ?)";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, measureid, 1, entry.userid, new Date(), entry.value_HL7, entry.date, cpt1, cpt2, icd1, icd2, icd3, icd4, entry.SUBID, "Colon Cancer"], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
        if(entry.name_HL7!= null&&entry.name_HL7.includes("MICROALBUMIN/CREATININ RATIO")){
            let measureid = null;
            let cpt1 = null;
            let cpt2 = null;
            let icd1 = null;
            let icd2 = null;
            let icd3 = null;
            let icd4 = null;
            
            var query = "SELECT mh_table.id,cpt_icd_map.CPT_1,cpt_icd_map.CPT_2,cpt_icd_map.ICD_10,cpt_icd_map.ICD_10_2,cpt_icd_map.ICD_10_3,cpt_icd_map.ICD_10_4 FROM `mh_table` LEFT JOIN `cpt_icd_map` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE mh_table.keywords LIKE '%Nephropathy%' GROUP BY mh_table.id";
            connection.query(query, (err, neph) => {
                if(neph.length > 0){
                    measureid = neph[0]['id'];
                    cpt1 = neph[0]['CPT_1'];
                    cpt2 = neph[0]['CPT_2'];
                    icd1 = neph[0]['ICD_10'];
                    icd2 = neph[0]['ICD_10_2'];
                    icd3 = neph[0]['ICD_10_3'];
                    icd4 = neph[0]['ICD_10_4'];
                    var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`ICD3`,`ICD4`,`Subscriberno`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?, ? , ? , ?, ? , ? , ?)";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, measureid, 1, entry.userid, new Date(), entry.value_HL7, entry.date, cpt1, cpt2, icd1, icd2, icd3, icd4, entry.SUBID, "Nephropathy"], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
        if(entry.name_HL7!= null&&entry.name_HL7.includes("A1C")){
            let measureid = null;
            let cpt1 = null;
            let cpt2 = null;
            let icd1 = null;
            let icd2 = null;
            let icd3 = null;
            let icd4 = null;
            
            var query = "SELECT mh_table.id,cpt_icd_map.CPT_1,cpt_icd_map.CPT_2,cpt_icd_map.ICD_10,cpt_icd_map.ICD_10_2,cpt_icd_map.ICD_10_3,cpt_icd_map.ICD_10_4 FROM `mh_table` LEFT JOIN `cpt_icd_map` ON `cpt_icd_map`.M_ID = `mh_table`.id WHERE mh_table.keywords LIKE '%A1C%' AND cpt_icd_map.Value = ? GROUP BY mh_table.id";
            connection.query(query,[entry.value_HL7], (err, a1c) => {
                if(a1c.length > 0){
                    measureid = a1c[0]['id'];
                    cpt1 = a1c[0]['CPT_1'];
                    cpt2 = a1c[0]['CPT_2'];
                    icd1 = a1c[0]['ICD_10'];
                    icd2 = a1c[0]['ICD_10_2'];
                    icd3 = a1c[0]['ICD_10_3'];
                    icd4 = a1c[0]['ICD_10_4'];
                    var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`ICD3`,`ICD4`,`Subscriberno`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?, ? , ? , ?, ? , ? , ?)";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.patientId, measureid, 1, entry.userid, new Date(), entry.value_HL7, entry.date, cpt1, cpt2, icd1, icd2, icd3, icd4, entry.SUBID, "A1C"], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
    },
    vaccineloader: (entry, callback) => {
        var query = "SELECT id FROM `vaccines` WHERE clinicid = ? AND cyear = ? AND VAC_ID = ?";
        connection.query(query, [entry.clinicid, entry.cyear, entry.encounterID, entry.patientID, entry.VAC_ID, entry.date], (err, result) => {
            if(result.length == 0){
                var query = "INSERT INTO `vaccines` (`id`, `cyear`, `clinicid`, `encounterID`,`patientID`,`doctorID`,`VisitType`,`VAC_ID`,`cvx_code`,`vaccinename`,`V_GIVEN`,`CPT`,`ICD`,`ICD_DESC`,`icd1`,`date`) VALUES (NULL, ? , ? , ? , ?, ? , ? , ? , ?, ? , ? , ? , ?, ? , ? , ?)";
                connection.query(query, [entry.cyear, entry.clinicid, entry.encounterID, entry.patientID, entry.doctorID, entry.VisitType, entry.VAC_ID, entry.cvx_code, entry.vaccinename, entry.V_GIVEN, entry.CPT, entry.ICD, entry.ICD_DESC, entry.icd1, entry.date], (err, result) => {
                    callback(err, result);
                });
            }
        });
    },
    getvaccinegroup: () => {
        let query = "SELECT * FROM `vaccine_table` WHERE 1";
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
    vaccinetrackloader: (entry,tmpgroup, callback) => {
        let age = _calculateAge(entry.DOB,entry.cyear+"-12-31");
        if(typeof entry.CPT != "undefined"&&!tmpgroup.includes(entry.CPT.toString())){
            var query = "SELECT * FROM `cpt_icd_map` WHERE age_to >= ? AND age_from <= ? AND (CPT_1 = ? OR CPT_2 = ?)";
            connection.query(query, [age,age, entry.CPT, entry.CPT], (err, result) => {
                if(typeof result != "undefined"&&result.length > 0){
                    var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`ICD3`,`ICD4`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?, ? , ? , ?, ? , ?)";
                    connection.query(query, [entry.cyear, entry.clinicid, entry.patientID, result[0]['M_ID'], 1, entry.userid, new Date(), "Yes", entry.date, result[0]['CPT_1'], result[0]['CPT_2'], result[0]['ICD_10'], result[0]['ICD_10_2'],result[0]['ICD_10_3'],result[0]['ICD_10_4'], "Immunizations"], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
        else if(typeof entry.CPT != "undefined"&&tmpgroup.includes(entry.CPT.toString())){
            var query = "SELECT vaccines FROM `vaccine_table` WHERE cptcode = ?";
            connection.query(query, [entry.CPT], (err, result) => {
                var obj = JSON.parse(result[0]['vaccines']);
                var tmp = "(0";
                for(var i = 0;i < obj.length;i++){
                    tmp += ","+obj[i];
                }
                tmp += ")";
                var query = "SELECT * FROM `cpt_icd_map` WHERE age_to >= "+age+" AND age_from <= "+age+" AND M_ID IN "+tmp;
                connection.query(query, (err, result) => {
                    if(result.length > 0){
                        for(var i = 0;i < result.length;i++){
                            var query = "INSERT INTO `hedis_list` (`id`, `Program_Year`, `clinicid`, `PT_EMR_ID`,`Measureid`,`M_status`,`Created_By`,`Created_By_Date`,`Value1`,`DOS`,`CPT1`,`CPT2`,`ICD1`,`ICD2`,`ICD3`,`ICD4`,`keyvalue`) VALUES (NULL, ? , ? , ? , ?,  ? , ? , ? , ? , ? , ? , ?, ? , ? , ?, ? , ?)";
                            connection.query(query, [entry.cyear, entry.clinicid, entry.patientID, result[i]['M_ID'], 1, entry.userid, new Date(), "Yes", entry.date, result[i]['CPT_1'], result[i]['CPT_2'], result[i]['ICD_10'], result[i]['ICD_10_2'],result[i]['ICD_10_3'],result[i]['ICD_10_4'], "Immunizations"], (err, result) => {
                                callback(err, result);
                            });
                        }
                    }
                });
            });
        }
    },
    updateprevnext: (entry, callback) => {
        let query = "SELECT id FROM `insurances` WHERE ? LIKE concat('%',`insName`,'%')";
        connection.query(query, [entry.insuranceName], (err, result) => {
            if(result.length > 0){
                if(entry.NxtApptDate == null){
                    query = "UPDATE `hedis_track` SET `status`= ?,`lastdate`= ?,`lastpcp`= ?,`lastvisit`= ? WHERE `clinicid`= ? AND `insid` = ? AND emr_id = ? AND cyear = ? AND status NOT IN (2,4,9,13)";
                    connection.query(query, [4, entry.PrevApptDate, entry.PrevApptPCP, entry.PrevApptVType, entry.clinicid, result[0]['id'], entry.patientid, entry.cyear], (err, result) => {
                        callback(err, result);
                    });
                }
                else{
                    query = "UPDATE `hedis_track` SET `status`= ?,`lastdate`= ?,`lastpcp`= ?,`lastvisit`= ?,`apptdate`= ?,`apptpcp`= ?,`apptvisit`= ? WHERE `clinicid`= ? AND `insid` = ? AND emr_id = ? AND cyear = ? AND status NOT IN (2,4,9,13)";
                    connection.query(query, [6, entry.PrevApptDate, entry.PrevApptPCP, entry.PrevApptVType, entry.NxtApptDate, entry.NxtApptPCP, entry.NxtApptVType, entry.clinicid, result[0]['id'], entry.patientid, entry.cyear], (err, result) => {
                        callback(err, result);
                    });
                }
            }
            // callback(err, result);
        });
    },
    backuphedis: (clinicid,insid,filename, num) => {
        let query = "INSERT INTO `hedis_backup` (`id`, `clinicid`, `insid`, `filename`,`date`, `num`) VALUES (NULL, ? , ? , ? , ?, ?)";
        return new Promise((resolve, reject) => {
            connection.query(query,[clinicid,insid,filename,new Date(),num], (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
    getbackup: (entry, callback) => {
        let query = "SELECT hedis_backup.* FROM `hedis_backup`  WHERE clinicid = ? and insid=?";
        connection.query(query, [entry.clinicid, entry.insuranceid], (err, result) => {
            callback(err, result);
        });
    },
    chosenbackup: (id) => {
        let query = "SELECT * FROM `hedis_backup` WHERE id = ?";
        return new Promise((resolve, reject) => {
            connection.query(query,[id], (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
    deletebackup: (entry, callback) => {
        let query = "DELETE FROM `hedis_backup` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    checkhedisdata: (clinicid,insid) => {
        let query = "SELECT COUNT(*) AS total FROM `hedis_track` WHERE clinicid = ? AND insid = ?";
        return new Promise((resolve, reject) => {
            connection.query(query,[clinicid,insid], (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
    getgrlists: (clinicid,insid,cyear) => {
        let query = "SELECT * FROM `hedis_track` WHERE (rstatus = 1 OR gstatus = 1) AND clinicid = ? AND insid = ? AND cyear = ?";
        return new Promise((resolve, reject) => {
            connection.query(query,[clinicid,insid,cyear], (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
}
module.exports = hedisloader;