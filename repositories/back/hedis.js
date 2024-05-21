const connection = require('../../utilities/database');
var md5 = require('md5');
function DateFormat(serial) {
    let year = serial.getFullYear();
    let month = serial.getMonth() + 1;
    let dt = serial.getDate();
  
    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return month+'/'+dt+'/'+year;
}
const hedis = {
    getPCPID: (entry) => {
        let query = "SELECT * FROM `rolem` WHERE clinicid = "+entry.clinicid+" AND name LIKE '%Medical Provider%'";
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
    getUsers: (entry) => {
        let query = "SELECT users.userid,users.fullname,users.mp_check FROM `users` WHERE status = 0 AND clinicid = "+entry.clinicid;
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
    getinsheislist: (entry,callback) => {
        let query = "SELECT `insurances`.insName,`hedis_track`.insid FROM `hedis_track` INNER JOIN `insurances` ON `insurances`.id = `hedis_track`.insid WHERE `hedis_track`.clinicid = "+entry.clinicid+" AND `hedis_track`.cyear = "+entry.cyear+" GROUP BY `hedis_track`.insid ORDER BY `hedis_track`.insid";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getavailabledaily: (entry,callback) => {
        let query = "SELECT * FROM `managers` WHERE `managers`.id = "+entry.userid+" AND `managers`.hedisdaily = 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getavailablencompliant: (entry,callback) => {
        let query = "SELECT * FROM `managers` WHERE `managers`.id = "+entry.userid+" AND `managers`.hedisnoncompliant = 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getIns: (insid) => {
        let query = "SELECT * FROM `insurances` WHERE id ="+insid;
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
    getClinic: (clinicid) => {
        let query = "SELECT * FROM `clinics` WHERE id ="+clinicid;
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
    getFile: (fileid) => {
        let query = "SELECT * FROM `confilename` WHERE id ="+fileid;
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
    getFieldlists: (fileid) => {
        let query = "SELECT * FROM `confieldname` WHERE filenameid ="+fileid;
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
    getData: (entry) => {
        let query = "SELECT hedis_track.*,mh_table.Rates,mh_table.outcomecheck,mh_table.multicheck,mh_table.yearlycheck,mh_table.quantity,hedisnotes.id AS notecheck FROM `hedis_track` LEFT JOIN hedisnotes ON hedisnotes.mid = hedis_track.mid LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid WHERE hedis_track.cyear = "+entry.cyear+" AND hedis_track.clinicid = "+entry.clinicid+" AND hedis_track.insid = "+entry.insid+" GROUP BY hedis_track.id ORDER BY hedis_track.ptfname,hedis_track.ptlname";
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
    getDataPTstatus: (entry) => {
        let query = "SELECT hedis_track.emr_id,hedis_track.measureid,hedis_track.insid,hedis_track.status,mh_table.multicheck,mh_table.yearlycheck FROM `hedis_track` LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid WHERE cyear = "+entry.cyear+" AND clinicid = "+entry.clinicid+" ORDER BY hedis_track.ptfname,hedis_track.ptlname";
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
    getDataForpt: (entry) => {
        let query = "SELECT hedis_track.measure,hedis_track.status,hedis_track.dos,hedis_track.emr_id,hedis_track.measureid,mh_table.Rates,mh_table.outcomecheck,mh_table.multicheck,mh_table.yearlycheck FROM `hedis_track` LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid WHERE cyear = "+entry.cyear+" AND clinicid = "+entry.clinicid+" AND mid = '"+entry.mid+"' ORDER BY hedis_track.ptfname,hedis_track.ptlname";
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
    getDataFordash: (entry) => {
        let query = "SELECT hedis_track.measure,hedis_track.status,hedis_track.emr_id,hedis_track.measureid,mh_table.Measure,mh_table.Rates,mh_table.outcomecheck,mh_table.multicheck,mh_table.yearlycheck,hcd_table.Health_Care_Domain FROM `hedis_track` LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid LEFT JOIN hcd_table ON hcd_table.id = mh_table.D_ID WHERE cyear = "+entry.cyear+" AND clinicid = "+entry.clinicid+" AND insid = "+entry.insid+" ORDER BY hcd_table.Health_Care_Domain,hedis_track.measure";
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
    getDataForMonth: (entry) => {
        let query = "SELECT hedis_track.measure,hedis_track.status,hedis_track.emr_id,hedis_track.measureid,mh_table.Measure,mh_table.Rates,mh_table.outcomecheck,mh_table.multicheck,mh_table.yearlycheck,hcd_table.Health_Care_Domain FROM `hedis_track` LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid LEFT JOIN hcd_table ON hcd_table.id = mh_table.D_ID WHERE cyear = "+entry.cyear+" AND clinicid = "+entry.clinicid+" AND insid = "+entry.insid+" ORDER BY hcd_table.Health_Care_Domain,hedis_track.measure";
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
    getDaily: (entry) => {
        let query = "";
        if(entry.weekcheck == 1){
            var date = new Date(entry.cdate);
            date.setDate(date.getDate() + 7);
            query = "SELECT hedis_track.*,mh_table.Rates,mh_table.outcomecheck,mh_table.multicheck,mh_table.yearlycheck,insurances.insName,users.fullname FROM `hedis_track` LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid LEFT JOIN insurances ON insurances.id = hedis_track.insid LEFT JOIN users ON users.userid = hedis_track.apptpcp AND users.clinicid = "+entry.clinicid+" WHERE cyear = "+entry.cyear+" AND hedis_track.clinicid = "+entry.clinicid+" AND apptdate <= STR_TO_DATE('"+DateFormat(date)+"', '%m/%d/%Y') AND apptdate >= STR_TO_DATE('"+entry.cdate+"', '%m/%d/%Y') AND hedis_track.status IN (4,6) ORDER BY hedis_track.ptfname,hedis_track.ptlname";
        }
        else if(entry.weekcheck == 2){
            var date = new Date(entry.cdate);
            date.setDate(date.getDate() + 15);
            query = "SELECT hedis_track.*,mh_table.Rates,mh_table.outcomecheck,mh_table.multicheck,mh_table.yearlycheck,insurances.insName,users.fullname FROM `hedis_track` LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid LEFT JOIN insurances ON insurances.id = hedis_track.insid LEFT JOIN users ON users.userid = hedis_track.apptpcp AND users.clinicid = "+entry.clinicid+" WHERE cyear = "+entry.cyear+" AND hedis_track.clinicid = "+entry.clinicid+" AND apptdate <= STR_TO_DATE('"+DateFormat(date)+"', '%m/%d/%Y') AND apptdate >= STR_TO_DATE('"+entry.cdate+"', '%m/%d/%Y') AND hedis_track.status IN (4,6) ORDER BY hedis_track.ptfname,hedis_track.ptlname";
        }
        else if(entry.weekcheck == 3){
            var date = new Date(entry.cdate);
            date.setDate(date.getDate() + 30);
            query = "SELECT hedis_track.*,mh_table.Rates,mh_table.outcomecheck,mh_table.multicheck,mh_table.yearlycheck,insurances.insName,users.fullname FROM `hedis_track` LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid LEFT JOIN insurances ON insurances.id = hedis_track.insid LEFT JOIN users ON users.userid = hedis_track.apptpcp AND users.clinicid = "+entry.clinicid+" WHERE cyear = "+entry.cyear+" AND hedis_track.clinicid = "+entry.clinicid+" AND apptdate <= STR_TO_DATE('"+DateFormat(date)+"', '%m/%d/%Y') AND apptdate >= STR_TO_DATE('"+entry.cdate+"', '%m/%d/%Y') AND hedis_track.status IN (4,6) ORDER BY hedis_track.ptfname,hedis_track.ptlname";
        }
        else{
            query = "SELECT hedis_track.*,mh_table.Rates,mh_table.outcomecheck,mh_table.multicheck,mh_table.yearlycheck,insurances.insName,users.fullname FROM `hedis_track` LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid LEFT JOIN insurances ON insurances.id = hedis_track.insid LEFT JOIN users ON users.userid = hedis_track.apptpcp AND users.clinicid = "+entry.clinicid+" WHERE cyear = "+entry.cyear+" AND hedis_track.clinicid = "+entry.clinicid+" AND apptdate = STR_TO_DATE('"+entry.cdate+"', '%m/%d/%Y') AND hedis_track.status IN (4,6) ORDER BY hedis_track.ptfname,hedis_track.ptlname";
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
    getNcompliant: (entry) => {
        let query = "SELECT hedis_track.*,mh_table.Rates,mh_table.outcomecheck,mh_table.multicheck,mh_table.yearlycheck,insurances.insName,hedisnotes.id AS notecheck FROM `hedis_track` LEFT JOIN hedisnotes ON hedisnotes.mid = hedis_track.mid LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid LEFT JOIN insurances ON insurances.id = hedis_track.insid WHERE cyear = "+entry.cyear+" AND hedis_track.clinicid = "+entry.clinicid+" AND lastdate IS NOT NULL AND hedis_track.status = 4 GROUP BY hedis_track.id ORDER BY hedis_track.ptfname,hedis_track.ptlname";
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
    getoutputData: (entry) => {
        let query = "SELECT hedis_track.*,mh_table.Rates,mh_table.keywords,mh_table.outcomecheck,mh_table.multicheck,mh_table.acronym,mh_table.yearlycheck,facilityidlist.num AS facility_id,filetypelist.filetype AS filetype,clinics.name AS clinic_name,clinics.placeservice AS pos FROM `hedis_track` LEFT JOIN clinics ON clinics.id = hedis_track.clinicid LEFT JOIN facilityidlist ON facilityidlist.clinicid = hedis_track.clinicid AND facilityidlist.insid = "+entry.insid+" LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid LEFT JOIN filetypelist ON filetypelist.insid = hedis_track.insid WHERE hedis_track.cyear = "+entry.cyear+" AND hedis_track.clinicid = "+entry.clinicid+" AND hedis_track.insid = "+entry.insid+" GROUP BY hedis_track.id ORDER BY hedis_track.ptfname,hedis_track.ptlname";
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
    getoutputDataRetro: (entry,tmpids) => {
        let query = "SELECT hedis_track.*,mh_table.Rates,mh_table.keywords,mh_table.outcomecheck,mh_table.multicheck,mh_table.acronym,mh_table.yearlycheck,facilityidlist.num AS facility_id,filetypelist.filetype AS filetype,clinics.name AS clinic_name,clinics.placeservice AS pos FROM `hedis_track` LEFT JOIN clinics ON clinics.id = hedis_track.clinicid LEFT JOIN facilityidlist ON facilityidlist.clinicid = hedis_track.clinicid AND facilityidlist.insid = "+entry.insid+" LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid LEFT JOIN filetypelist ON filetypelist.insid = hedis_track.insid WHERE hedis_track.cyear = "+entry.cyear+" AND hedis_track.clinicid = "+entry.clinicid+" AND hedis_track.insid = "+entry.insid+" AND hedis_track.id IN "+tmpids+" GROUP BY hedis_track.id ORDER BY hedis_track.ptfname,hedis_track.ptlname";
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
    getoutputRetroRGDate: (entry,id) => {
        let query = "SELECT date,rdate FROM hedis_report_action_log WHERE idarray LIKE '%"+id+"%' AND clinicid = "+entry.clinicid+" AND insid = "+entry.insid+" GROUP BY clinicid, insid ORDER BY rdate, date DESC";
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
    geteboData: (entry) => {
        // let query = "SELECT PT_EMR_ID,Measureid,MAX(DOS) AS date,Value1,Value2,CPT1,CPT2,ICD1,ICD2 FROM `hedis_list` WHERE Program_Year = "+entry.cyear+" AND clinicid = "+entry.clinicid+" GROUP BY PT_EMR_ID,Measureid";
        let query = "SELECT hedis_list.PT_EMR_ID,hedis_list.Measureid,hedis_list.DOS AS date,hedis_list.Value1,hedis_list.Value2,hedis_list.CPT1,hedis_list.CPT2,hedis_list.ICD1,hedis_list.ICD2 FROM `hedis_list` INNER JOIN (SELECT PT_EMR_ID,Measureid,MAX(DOS) AS date FROM `hedis_list` WHERE Program_Year = "+entry.cyear+" AND clinicid = "+entry.clinicid+" GROUP BY PT_EMR_ID,Measureid) tb ON tb.PT_EMR_ID = hedis_list.PT_EMR_ID AND tb.Measureid = hedis_list.Measureid AND tb.date = hedis_list.DOS WHERE hedis_list.Program_Year = "+entry.cyear+" AND hedis_list.clinicid = "+entry.clinicid+" GROUP BY hedis_list.PT_EMR_ID,hedis_list.Measureid";
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
    getmultimeasures: () => {
        let query = "SELECT id FROM `mh_table` WHERE multicheck = 1";
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
    geteboDataMulti: (entry,tmpids) => {
        let query = "SELECT hedis_list.id,hedis_list.PT_EMR_ID,hedis_list.Measureid,hedis_list.DOS AS date,hedis_list.Value1,hedis_list.Value2,hedis_list.CPT1,hedis_list.CPT2,hedis_list.ICD1,hedis_list.ICD2 FROM `hedis_list` WHERE Program_Year = "+entry.cyear+" AND clinicid = "+entry.clinicid+" AND Measureid IN "+tmpids+" ORDER BY PT_EMR_ID,Measureid,DOS DESC";
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
    geteboDatapop: (entry) => {
        let query = "SELECT hedis_list.id,hedis_list.PT_EMR_ID,hedis_list.Measureid,hedis_list.DOS AS date,hedis_list.Value1,hedis_list.Value2,hedis_list.CPT1,hedis_list.CPT2,hedis_list.ICD1,hedis_list.ICD2 FROM `hedis_list` WHERE Program_Year = "+entry.cyear+" AND clinicid = "+entry.clinicid+" AND Measureid IN (48,53)";
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
    updateValue: (entry, callback) => {
        let query = "";
        let getRangevalues = "SELECT * FROM `mh_out_range`";
        let a1cv1,a1cv2,systv1,systv2,diasv1,diasv2;
        if(entry.key == "DOS"){
            query = "UPDATE `hedis_track` SET `dos`= ?, gstatus = ?, rstatus = ? WHERE `id`= ? ";
            if(entry.value ==""||entry.value == null){
                connection.query(query, [null,null,null, entry.id], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                connection.query(query, [entry.value,null,null, entry.id], (err, result) => {
                    callback(err, result);
                });
            }
        }
        else if(entry.key == "EMR ID"){
            query = "UPDATE `hedis_track` SET `emr_id`= ? WHERE `mid`= ? ";
            if(entry.value ==""||entry.value == null){
                connection.query(query, [null, entry.insid], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                connection.query(query, [entry.value, entry.insid], (err, result) => {
                    callback(err, result);
                });
            }
        }
        else if(entry.key == "First Name"){
            query = "UPDATE `hedis_track` SET `ptfname`= ? WHERE `mid`= ? ";
            if(entry.value ==""||entry.value == null){
                connection.query(query, [null, entry.insid], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                connection.query(query, [entry.value, entry.insid], (err, result) => {
                    callback(err, result);
                });
            }
        }
        else if(entry.key == "Last Name"){
            query = "UPDATE `hedis_track` SET `ptlname`= ? WHERE `mid`= ? ";
            if(entry.value ==""||entry.value == null){
                connection.query(query, [null, entry.insid], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                connection.query(query, [entry.value, entry.insid], (err, result) => {
                    callback(err, result);
                });
            }
        }
        else if(entry.key == "Phone"){
            query = "UPDATE `hedis_track` SET `phone`= ? WHERE `mid`= ? ";
            if(entry.value ==""||entry.value == null){
                connection.query(query, [null, entry.insid], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                connection.query(query, [entry.value, entry.insid], (err, result) => {
                    callback(err, result);
                });
            }
        }
        else if(entry.key == "CPT1"){
            query = "UPDATE `hedis_track` SET `cpt1`= ? WHERE `id`= ? ";
            if(entry.value ==""||entry.value == null){
                connection.query(query, [null, entry.id], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                connection.query(query, [entry.value, entry.id], (err, result) => {
                    callback(err, result);
                });
            }
        }
        else if(entry.key == "CPT2"){
            query = "UPDATE `hedis_track` SET `cpt2`= ? WHERE `id`= ? ";
            if(entry.value ==""||entry.value == null){
                connection.query(query, [null, entry.id], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                connection.query(query, [entry.value, entry.id], (err, result) => {
                    callback(err, result);
                });
            }
        }
        else if(entry.key == "ICD"){
            query = "UPDATE `hedis_track` SET `icd1`= ? WHERE `id`= ? ";
            if(entry.value ==""||entry.value == null){
                connection.query(query, [null, entry.id], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                connection.query(query, [entry.value, entry.id], (err, result) => {
                    callback(err, result);
                });
            }
        }
        else if(entry.key == "Value1"){
            connection.query(getRangevalues, (err, result) => {
                if(typeof result !="undefined" && result.length > 0){
                    for(var i = 0; i < result.length;i++){
                        if(result[i]['name'] == "A1C"){
                            a1cv1 = result[i]['v1'];
                            a1cv2 = result[i]['v2'];
                        }
                        else if(result[i]['name'] == "Systolic"){
                            systv1 = result[i]['v1'];
                            systv2 = result[i]['v2'];
                        }
                        else if(result[i]['name'] == "Diastolic"){
                            diasv1 = result[i]['v1'];
                            diasv2 = result[i]['v2'];
                        }
                    }
                    if(entry.value ==""||entry.value == null){
                        query = "UPDATE `hedis_track` SET `value1`= ?, status = ?, gstatus = ?, rstatus = ? WHERE `id`= ? ";
                        connection.query(query, [null,0,null,null, entry.id], (err, result) => {
                            callback(err, result);
                        });
                    }
                    else{
                        let getcpticdquery = "";
                        if(entry.measureid == 53){
                            getcpticdquery = "SELECT CPT_1,CPT_2,ICD_10 FROM `cpt_icd_map` WHERE `value`= "+entry.value+" AND M_ID = "+entry.measureid;
                        }
                        else if(entry.measureid == 48){
                            getcpticdquery = "SELECT CPT_1,CPT_2,ICD_10 FROM `cpt_icd_map` WHERE `value`= '"+entry.value+"' AND M_ID = "+entry.measureid+" AND cpt_icd_map.Des LIKE '%syst%'";
                        }
                        else{
                            getcpticdquery = "SELECT CPT_1,CPT_2,ICD_10 FROM `cpt_icd_map` WHERE M_ID = "+entry.measureid;
                        }
                        connection.query(getcpticdquery, (err, result) => {
                            if(typeof result !="undefined" && result.length > 0){
                                var cpt1 = result[0]['CPT_1'];
                                var cpt2 = result[0]['CPT_2'];
                                var icd1 = result[0]['ICD_10'];
                                var icdv1 = 10;
                                if(entry.measureid == 48){
                                    let tmpquery = "SELECT value2 FROM `hedis_track` WHERE id = "+entry.id;
                                    connection.query(tmpquery, (err, result) => {
                                        if((parseFloat(entry.value) >= parseFloat(systv1) && parseFloat(entry.value) <= parseFloat(systv2))||(parseFloat(result[0]['value2']) >= parseFloat(diasv1) && parseFloat(result[0]['value2']) <= parseFloat(diasv2))){
                                            var status = 4;
                                        }
                                        else{
                                            var status = 2;
                                        }
                                        query = "UPDATE `hedis_track` SET `value1`= ?, cpt1 = ?, icd1 = ?, icdv1 = ?, status = ?, gstatus = ?, rstatus = ? WHERE `id`= ? ";
                                        connection.query(query, [entry.value,cpt1,icd1,icdv1,status,null,null, entry.id], (err, result) => {
                                            callback(err, result);
                                        });
                                    });
                                }
                                else if(entry.measureid == 53){
                                    if(parseFloat(entry.value) >= parseFloat(a1cv1) && parseFloat(entry.value) <= parseFloat(a1cv2)){
                                        var status = 4;
                                    }
                                    else{
                                        var status = 2;
                                    }
                                    query = "UPDATE `hedis_track` SET `value1`= ?, cpt1 = ?, icd1 = ?, icdv1 = ?, status = ?, gstatus = ?, rstatus = ? WHERE `id`= ? ";
                                    connection.query(query, [entry.value,cpt1,icd1,icdv1,status,null,null, entry.id], (err, result) => {
                                        callback(err, result);
                                    });
                                }
                                else{
                                    var status = 2;
                                    if(entry.measureid = 35 && (entry.value.toLowerCase() == "detected"||entry.value.toLowerCase() == "undetected"||entry.value.toLowerCase() == "not detected"||entry.value.toLowerCase() == "negative"||entry.value.toLowerCase() == "positive")){
                                        cpt1 = "G0328";
                                        cpt2 = "82270";
                                    }
                                    query = "UPDATE `hedis_track` SET `value1`= ?, cpt1 = ?, cpt2 = ?, icd1 = ?, icdv1 = ?, status = ?, gstatus = ?, rstatus = ? WHERE `id`= ? ";
                                    connection.query(query, [entry.value,cpt1,cpt2,icd1,icdv1,status,null,null, entry.id], (err, result) => {
                                        callback(err, result);
                                    });
                                } 
                            }
                            else{
                                query = "UPDATE `hedis_track` SET `value1`= ?,`status`= ? WHERE `id`= ? ";
                                connection.query(query, [entry.value,2, entry.id], (err, result) => {
                                    callback(err, result);
                                });
                            }
                        });
                        
                    }
                }
            });
            let query = "SELECT mid,measureid,emr_id,insid,dos FROM `hedis_track` WHERE id = ?";
            connection.query(query, [entry.id], (err, result) => {
                if(typeof result !="undefined" && result.length > 0&&result[0]['dos'] != null){
                    let query = "INSERT INTO `hedis_action_log` (`id`, `loginid`, `clinicid`, `insid`, `qid`, `mid`, `emr_id`, `measureid`, `userid`, `action_id`, `date`) VALUES (NULL, ?, ? , ? , ? , ? , ? , ? , ? , ?, ?)";
                    connection.query(query, [entry.loginid,entry.clinicid, result[0]['insid'], entry.id, result[0]['mid'], result[0]['emr_id'], result[0]['measureid'], entry.userid, 2, new Date()], (err, result) => {
                    });
                }
            });
        }
        else if(entry.key == "Value2"){
            connection.query(getRangevalues, (err, result) => {
                if(typeof result !="undefined" && result.length > 0){
                    for(var i = 0; i < result.length;i++){
                        if(result[i]['name'] == "A1C"){
                            a1cv1 = result[i]['v1'];
                            a1cv2 = result[i]['v2'];
                        }
                        else if(result[i]['name'] == "Systolic"){
                            systv1 = result[i]['v1'];
                            systv2 = result[i]['v2'];
                        }
                        else if(result[i]['name'] == "Diastolic"){
                            diasv1 = result[i]['v1'];
                            diasv2 = result[i]['v2'];
                        }
                    }
                    if(entry.value ==""||entry.value == null){
                        query = "UPDATE `hedis_track` SET `value2`= ?, status = ?, gstatus = ?, rstatus = ? WHERE `id`= ? ";
                        connection.query(query, [null,0,null,null, entry.id], (err, result) => {
                            callback(err, result);
                        });
                    }
                    else{
                        let getcpticdquery = "";
                        if(entry.measureid == 53){
                            getcpticdquery = "SELECT CPT_1,ICD_10 FROM `cpt_icd_map` WHERE `value`= '"+entry.value+"' AND M_ID = "+entry.measureid;
                        }
                        else if(entry.measureid == 48){
                            getcpticdquery = "SELECT CPT_1,ICD_10 FROM `cpt_icd_map` WHERE `value`= '"+entry.value+"' AND M_ID = "+entry.measureid+" AND cpt_icd_map.Des LIKE '%dias%'";
                        }
                        else{
                            getcpticdquery = "SELECT CPT_1,ICD_10 FROM `cpt_icd_map` WHERE M_ID = "+entry.measureid;
                        }
                        connection.query(getcpticdquery, (err, result) => {
                            if(typeof result !="undefined" && result.length > 0){
                                var icd1 = result[0]['ICD_10'];
                                var icdv1 = 10;
                                if(entry.measureid == 48){
                                    var cpt2 = result[0]['CPT_1'];
                                    let tmpquery = "SELECT value1 FROM `hedis_track` WHERE id = "+entry.id;
                                    connection.query(tmpquery, (err, result) => {
                                        if((parseFloat(result[0]['value1']) >= parseFloat(systv1) && parseFloat(result[0]['value1']) <= parseFloat(systv2))||(parseFloat(entry.value) >= parseFloat(diasv1) && parseFloat(entry.value) <= parseFloat(diasv2))){
                                            var status = 4;
                                        }
                                        else{
                                            var status = 2;
                                        }
                                        query = "UPDATE `hedis_track` SET `value2`= ?, cpt2 = ?, icd1 = ?, icdv1 = ?, status = ?, gstatus = ?, rstatus = ? WHERE `id`= ? ";
                                        connection.query(query, [entry.value,cpt2,icd1,icdv1,status,null,null, entry.id], (err, result) => {
                                            callback(err, result);
                                        });
                                    });
                                   
                                }
                                else if(entry.measureid == 53){
                                    var cpt1 = result[0]['CPT_1'];
                                    if(parseFloat(entry.value) >= parseFloat(a1cv1) && parseFloat(entry.value) <= parseFloat(a1cv2)){
                                        var status = 4;
                                    }
                                    else{
                                        var status = 2;
                                    }
                                    query = "UPDATE `hedis_track` SET `value2`= ?, cpt1 = ?, icd1 = ?, icdv1 = ?, status = ?, gstatus = ?, rstatus = ? WHERE `id`= ? ";
                                    connection.query(query, [entry.value,cpt1,icd1,icdv1,status,null,null, entry.id], (err, result) => {
                                        callback(err, result);
                                    });
                                }
                                else{
                                    var cpt1 = result[0]['CPT_1'];
                                    var status = 2;
                                    query = "UPDATE `hedis_track` SET `value2`= ?, cpt1 = ?, icd1 = ?, icdv1 = ?, status = ?, gstatus = ?, rstatus = ? WHERE `id`= ? ";
                                    connection.query(query, [entry.value,cpt1,icd1,icdv1,status,null,null, entry.id], (err, result) => {
                                        callback(err, result);
                                    });
                                }
                                
                            }
                            else{
                                query = "UPDATE `hedis_track` SET `value2`= ?,`status`= ? WHERE `id`= ? ";
                                connection.query(query, [entry.value,2, entry.id], (err, result) => {
                                    callback(err, result);
                                });
                            }
                        });
                        
                    }
                }
            });
            let query = "SELECT mid,measureid,emr_id,insid,dos FROM `hedis_track` WHERE id = ?";
            connection.query(query, [entry.id], (err, result) => {
                if(typeof result !="undefined" && result.length > 0&&result[0]['dos'] != null){
                    let query = "INSERT INTO `hedis_action_log` (`id`, `clinicid`, `insid`, `qid`, `mid`, `emr_id`, `measureid`, `userid`, `action_id`, `date`) VALUES (NULL, ?, ? , ? , ? , ? , ? , ? , ? , ?)";
                    connection.query(query, [entry.clinicid, result[0]['insid'], entry.id, result[0]['mid'], result[0]['emr_id'], result[0]['measureid'], entry.userid, 2, new Date()], (err, result) => {
                    });
                }
            });
        }
    },
    updateValueBP: (entry, callback) => {
        var value1,value2,cpt1,cpt2,icd1,icdv1,status;
        let a1cv1,a1cv2,systv1,systv2,diasv1,diasv2;
        let getRangevalues = "SELECT * FROM `mh_out_range`";
        connection.query(getRangevalues, (err, result) => {
            if(typeof result !="undefined" && result.length > 0){
                for(var i = 0; i < result.length;i++){
                    if(result[i]['name'] == "A1C"){
                        a1cv1 = result[i]['v1'];
                        a1cv2 = result[i]['v2'];
                    }
                    else if(result[i]['name'] == "Systolic"){
                        systv1 = result[i]['v1'];
                        systv2 = result[i]['v2'];
                    }
                    else if(result[i]['name'] == "Diastolic"){
                        diasv1 = result[i]['v1'];
                        diasv2 = result[i]['v2'];
                    }
                }
                if(entry.key == "Value1"){
                    value1 = entry.value1;
                    value2 = entry.value2;
                    if(entry.measureid == 48){
                        if((parseFloat(value1) >= parseFloat(systv1) && parseFloat(value1) <= parseFloat(systv2))||(parseFloat(value2) >= parseFloat(diasv1) && parseFloat(value2) <= parseFloat(diasv2))){
                            status = 4;
                        }
                        else{
                            status = 2;
                        }
                    }
                    let getcpticdquery = "";
                    getcpticdquery = "SELECT CPT_1,ICD_10 FROM `cpt_icd_map` WHERE `value`= '"+value1+"' AND M_ID = "+entry.measureid+" AND cpt_icd_map.Des LIKE '%syst%'";
                    connection.query(getcpticdquery, (err, result) => {
                        if(typeof result !="undefined" && result.length > 0){
                            cpt1 = result[0]['CPT_1'];
                            icd1 = result[0]['ICD_10'];
                            icdv1 = 10;
                            query = "UPDATE `hedis_track` SET `value1`= ?, cpt1 = ?, icd1 = ?, icdv1 = ?, status = ?, gstatus = ?, rstatus = ? WHERE `id`= ? ";
                            connection.query(query, [value1,cpt1,icd1,icdv1,status,null,null, entry.id], (err, result) => {
                                // callback(err, result);
                            });
                        }
                    });
                    let getcpt2icdquery = "";
                    getcpt2icdquery = "SELECT CPT_1 FROM `cpt_icd_map` WHERE `value`= '"+value2+"' AND M_ID = "+entry.measureid+" AND cpt_icd_map.Des LIKE '%dias%'";
                    connection.query(getcpt2icdquery, (err, result) => {
                        if(typeof result !="undefined" && result.length > 0){
                            cpt2 = result[0]['CPT_1'];
                            query = "UPDATE `hedis_track` SET `value2`= ?, cpt2 = ?, gstatus = ?, rstatus = ? WHERE `id`= ? ";
                            connection.query(query, [value2,cpt2,null,null, entry.id], (err, result) => {
                                callback(err, result);
                            });
                            
                        }
                    });
                }
            }
        });
        let query = "SELECT mid,measureid,emr_id,insid,dos FROM `hedis_track` WHERE id = ?";
        connection.query(query, [entry.id], (err, result) => {
            if(typeof result !="undefined" && result.length > 0&&result[0]['dos'] != null){
                let query = "INSERT INTO `hedis_action_log` (`id`, `loginid`, `clinicid`, `insid`, `qid`, `mid`, `emr_id`, `measureid`, `userid`, `action_id`, `date`) VALUES (NULL, ?, ?, ? , ? , ? , ? , ? , ? , ? , ?)";
                connection.query(query, [entry.loginid,entry.clinicid, result[0]['insid'], entry.id, result[0]['mid'], result[0]['emr_id'], result[0]['measureid'], entry.userid, 2, new Date()], (err, result) => {
                });
            }
        });
    },
    updateStatus: (entry, callback) => {
        if(entry.status == 13){
            let query = "UPDATE `hedis_track` SET `gstatus`= ? WHERE `id`= ? ";
            connection.query(query, [1, entry.id], (err, result) => {
            });
        }
        else{
            let query = "UPDATE `hedis_track` SET `gstatus`= ? WHERE `id`= ? ";
            connection.query(query, [null, entry.id], (err, result) => {
            });
        }
        if(entry.status == 4){
            if(entry.lastdate == "") lastdate = null;
            if(entry.nextdate == "") nextdate = null;
            let query = "SELECT mid,insid FROM `hedis_track` WHERE id = ?";
            connection.query(query, [entry.id], (err, result) => {
                if(typeof result !="undefined" && result.length > 0){
                    let query = "UPDATE `hedis_track` SET `status`= ?,`apptdate` = ?,`lastdate` = ?,`nextdate` = ? WHERE `clinicid`= ? AND `insid` = ? AND `mid` = ? AND `status` NOT IN (2,9,13)";
                    connection.query(query, [entry.status,null, entry.lastdate==null?null:new Date(entry.lastdate), entry.nextdate, entry.clinicid, result[0]['insid'], result[0]['mid']], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
        else if(entry.status == 6){
            if(entry.apptdate == "") apptdate = null;
            let query = "SELECT mid,insid FROM `hedis_track` WHERE id = ?";
            connection.query(query, [entry.id], (err, result) => {
                if(typeof result !="undefined" && result.length > 0){
                    let query = "UPDATE `hedis_track` SET `status`= ?,`apptdate` = ?,`apptpcp` = ?,`apptvisit` = ?,`lastdate` = ?,`nextdate` = ? WHERE `clinicid`= ? AND `insid` = ? AND `mid` = ? AND `status` NOT IN (2,9,13)";
                    connection.query(query, [entry.status, entry.apptdate==null?null:new Date(entry.apptdate),entry.apptpcp,entry.apptvisittype,null,null, entry.clinicid, result[0]['insid'], result[0]['mid']], (err, result) => {
                        callback(err, result);
                    });
                }
            });
        }
        else if(entry.status == 5){
            let query = "SELECT mid,insid FROM `hedis_track` WHERE id = ?";
            connection.query(query, [entry.id], (err, result) => {
                if(typeof result !="undefined" && result.length > 0){
                    let query = "UPDATE `hedis_track` SET `status`= ?,`apptdate` = ?,`lastdate` = ?,`nextdate` = ? WHERE `mid`= ? ";
                    connection.query(query, [entry.status,null,null,null, result[0]['mid']], (err, result) => {
                        callback(err, result);
                    });
                }
            });
            
        }
        else{
            let query = "UPDATE `hedis_track` SET `status`= ?,`apptdate` = ?,`lastdate` = ?,`nextdate` = ? WHERE `id`= ? ";
            connection.query(query, [entry.status,null,null,null, entry.id], (err, result) => {
                callback(err, result);
            });
        }
    },
    updatehedisactionlog: (entry, callback) => {
        let query = "SELECT mid,measureid,emr_id,insid FROM `hedis_track` WHERE id = ?";
        connection.query(query, [entry.id], (err, result) => {
            if(typeof result !="undefined" && result.length > 0){
                let query = "INSERT INTO `hedis_action_log` (`id`, `loginid`, `clinicid`, `insid`, `qid`, `mid`, `emr_id`, `measureid`, `userid`, `action_id`, `date`) VALUES (NULL, ?, ? , ? , ? , ? , ? , ? , ? , ? , ?)";
                connection.query(query, [entry.loginid, entry.clinicid, result[0]['insid'], entry.id, result[0]['mid'], result[0]['emr_id'], result[0]['measureid'], entry.userid, entry.status, new Date()], (err, result) => {
                    callback(err, result);
                });
            }
        });
    },
    getmactionlog: (entry, callback) => {
        let query = "SELECT hedis_action_log.*,managers.fname,managers.lname,hedis_color.name FROM `hedis_action_log` LEFT JOIN managers ON managers.id = hedis_action_log.userid LEFT JOIN hedis_color ON hedis_color.scheck = hedis_action_log.action_id WHERE clinicid = ? AND qid = ? ORDER BY hedis_action_log.date";
        connection.query(query, [entry.clinicid,entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getractionlog: (entry, callback) => {
        let query = "SELECT hedis_report_action_log.*,managers.fname,managers.lname,hedis_color.name FROM `hedis_report_action_log` LEFT JOIN managers ON managers.id = hedis_report_action_log.userid LEFT JOIN hedis_color ON hedis_color.scheck = hedis_report_action_log.status WHERE hedis_report_action_log.clinicid = ? AND hedis_report_action_log.insid = ? ORDER BY hedis_report_action_log.date";
        connection.query(query, [entry.clinicid,entry.insid], (err, result) => {
            callback(err, result);
        });
    },
    getchosenhedis: (entry) => {
        let query = "SELECT * FROM `hedis_track` WHERE id="+entry.qid;
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
    getptinfo: (entry) => {
        let query = "SELECT patient_list.*,pt_info.language FROM `patient_list` LEFT JOIN pt_info ON pt_info.ptid = patient_list.patientid WHERE patient_list.patientid="+entry[0]['emr_id']+" AND patient_list.clinicid="+entry[0]['clinicid'];
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
    getmesaures: (entry) => {
        let query = "";
        if(entry[0]['emr_id']!=null&&entry[0]['emr_id']!=""){
            query = "SELECT hedis_track.emr_id,hedis_track.measureid,hedis_track.status,hedis_track.measure,mh_table.Rates,mh_table.multicheck,mh_table.yearlycheck FROM `hedis_track` LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid WHERE emr_id="+entry[0]['emr_id']+" AND clinicid="+entry[0]['clinicid']+" AND cyear='"+entry[0]['cyear']+"'";
        }
        else{
            query = "SELECT hedis_track.emr_id,hedis_track.measureid,hedis_track.status,hedis_track.measure,mh_table.Rates,mh_table.multicheck,mh_table.yearlycheck FROM `hedis_track` LEFT JOIN mh_table ON mh_table.id = hedis_track.measureid WHERE clinicid="+entry[0]['clinicid']+" AND cyear='"+entry[0]['cyear']+"' AND ptfname='"+entry[0]['ptfname']+"' AND ptlname='"+entry[0]['ptlname']+"' AND mid='"+entry[0]['mid']+"'";
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
    getchosenlang: (lang) => {
        let query = "";
        if(lang!=null&&lang!=""){
            query = "SELECT id,name FROM `gsetting` WHERE type='lkeys' AND `desc` LIKE '%"+lang+"%'";
        }
        else{
            query = "SELECT id,name FROM `gsetting` WHERE type='lkeys' ORDER BY id LIMIT 1";
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
    getletter: (lang) => {
        query = "SELECT `desc` FROM `gsetting` WHERE type='hedis_letter' AND agerange = '"+lang+"'";
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
    getemail: (lang) => {
        query = "SELECT `name`,`desc` FROM `gsetting` WHERE type='hedis_email' AND agerange = '"+lang+"'";
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
    getsms: (lang) => {
        query = "SELECT `name`,`desc` FROM `gsetting` WHERE type='hedis_sms' AND agerange = '"+lang+"'";
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
    getcheckphone: (num) => {
        query = "SELECT id FROM `ptphonelists` WHERE phone='"+num+"' OR mobile = '"+num+"'";
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
    
    gethedisnoncompliantusers: () => {
        query = "SELECT `email`,`clinic` FROM `managers` WHERE hedisnoncompliant=1";
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
    gethedisusers: () => {
        query = "SELECT `email`,`clinic` FROM `managers` WHERE hedisdaily=1";
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
    trackhedissmssent: (clinicid,insid,userid,measureid,date) => {
        query = "INSERT INTO `trackhedissmssent`(`id`, `clinicid`, `insid`, `userid`, `mid`, `date`) VALUES (NULL,"+clinicid+","+insid+","+userid+","+measureid+",STR_TO_DATE('"+date+"', '%m/%d/%Y'))";
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
    getPrice: (clinicid) => {
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
    writenotes: (entry, callback) => {
        let query = "SELECT clinicid,insid,mid FROM `hedis_track` WHERE `id` = "+entry.qid;
        connection.query(query, (err, result) => {
            if(typeof result !="undefined" && result.length > 0){
                let query = "INSERT INTO `hedisnotes` (`id`, `clinicid`, `insid`, `mid`, `assuser`, `createduser`, `note`, `status`, `created`) VALUES (NULL, ?, ? , ? , ? , ? , ? , ? , ?)";
                connection.query(query, [result[0]['clinicid'],result[0]['insid'],result[0]['mid'], entry.assignuser, entry.createduser, entry.note, entry.status, entry.created], (err, result1) => {
                    callback(err, result1);
                });
            }
        });
    },
    getnotes: (entry) => {
        let query = "SELECT * FROM (SELECT hedisnotes.*,managers.fname,managers.lname FROM `hedisnotes` LEFT JOIN `managers` ON `managers`.id = `hedisnotes`.createduser WHERE `clinicid`="+entry.clinicid+" AND mid = '"+entry.mid+"' ORDER BY `created` DESC LIMIT 5) AS main_tb ORDER BY `created`";
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
    getmidnote: (qid) => {
        let query = "SELECT clinicid,mid FROM `hedis_track` WHERE id = "+qid;
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
    getallnotes: (notesinfo) => {
        let query = "SELECT hedisnotes.*,managers.fname,managers.lname FROM `hedisnotes` LEFT JOIN `managers` ON `managers`.id = `hedisnotes`.createduser WHERE `clinicid`="+notesinfo[0]['clinicid']+" AND mid = '"+notesinfo[0]['mid']+"'";
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
    chosenHedisitem: (entry,callback) => {
        let query = "SELECT * FROM `hedis_track` WHERE `hedis_track`.id = "+entry.id;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    updatevisitdate: (entry, callback) => {
        if(entry.nextdate == "") entry.nextdate = null;
        if(entry.lastdate == "") entry.lastdate = null;
        if(entry.nextdate != null){
            let query = "UPDATE `hedis_track` SET `status`= ?, `apptdate`= ?, `lastdate` = ? WHERE `id`= ? ";
            connection.query(query, [6,entry.nextdate==null?null:new Date(entry.nextdate), entry.lastdate==null?null:new Date(entry.lastdate), entry.id], (err, result) => {
                callback(err, result);
            });
        }
        else{
            let query = "UPDATE `hedis_track` SET `apptdate`= ?, `lastdate` = ? WHERE `id`= ? ";
            connection.query(query, [null, entry.lastdate==null?null:new Date(entry.lastdate), entry.id], (err, result) => {
                callback(err, result);
            });
        }
       
    },
    deletecurrentsetmonthdata: (clinicid,firstDay) => {
        let query = "DELETE FROM `hedis_month_report` WHERE `created` = '"+firstDay+"' AND clinicid = "+clinicid;
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
    setmonthdata: (entry, date, callback) => {
        query = "SELECT id FROM `mh_table` WHERE `Rates` LIKE '%"+entry.measure+"%'";
        connection.query(query, (err, result1) => {
            var measureid = typeof result1[0] != "undefined"?result1[0]['id']:null;
            let query = "INSERT INTO `hedis_month_report` (`id`, `clinicid`, `insid`, `domain`, `measureid`, `measure`, `denominator`, `numerator`, `missing`, `percentage`, `created`) VALUES (NULL, ? , ? , ? , ? , ? , ? , ? , ? , ? , ?)";
            connection.query(query,[entry.clinicid,entry.insid,entry.domain,measureid,entry.measure,entry.denominator,entry.numerator,entry.missing,entry.percentage,date], (err, result) => {
                callback(err, result);
            });
        });
    },
    setmonthdataptstatus: (entry, callback) => {
        let query = "SELECT id FROM `hedis_month_report_status` WHERE `created` = '"+entry.date+"' AND clinicid = "+entry.clinicid+" AND insid ="+entry.insid+" AND status ="+entry.status;
        connection.query(query, (err, result) => {
            if(typeof result !="undefined" && result.length == 0){
                let query = "INSERT INTO `hedis_month_report_status` (`id`, `clinicid`, `insid`, `status`, `count`, `created`) VALUES (NULL, ? , ? , ? , ? , ?)";
                connection.query(query,[entry.clinicid,entry.insid,entry.status,entry.count,entry.date], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                let query = "UPDATE `hedis_month_report_status` SET `count` = ? WHERE `clinicid`= ? AND `insid`= ? AND `status`= ? AND `created`= ? ";
                connection.query(query, [entry.count, entry.clinicid, entry.insid, entry.status, entry.date], (err, result) => {
                    callback(err, result);
                });
            }
        });
    },
    getmonthreportdata: (clinicid,fdate,fpdate) => {
        let query = "SELECT hedis_month_report.*,insurances.insName FROM `hedis_month_report` LEFT JOIN `insurances` ON `insurances`.id = `hedis_month_report`.insid WHERE `hedis_month_report`.clinicid = "+clinicid+" AND (hedis_month_report.created = '"+fdate+"' OR hedis_month_report.created = '"+fpdate+"') ORDER BY insurances.insName,domain,measureid,measure,hedis_month_report.created DESC";
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
    getmonthdataptstatus: (clinicid,fdate) => {
        let query = "SELECT hedis_month_report_status.status,hedis_month_report_status.count,insurances.insName,hedis_month_report_status.insid FROM `hedis_month_report_status` LEFT JOIN `insurances` ON `insurances`.id = `hedis_month_report_status`.insid WHERE `hedis_month_report_status`.clinicid = "+clinicid+" AND hedis_month_report_status.created = '"+fdate+"' ORDER BY insurances.insName,hedis_month_report_status.status";
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
    getinslists: (entry) => {
        let query = "SELECT `insurances`.insName,`hedis_track`.insid FROM `hedis_track` INNER JOIN `insurances` ON `insurances`.id = `hedis_track`.insid WHERE `hedis_track`.clinicid = "+entry.clinicid+" AND `hedis_track`.cyear = "+entry.cyear+" GROUP BY `hedis_track`.insid ORDER BY `hedis_track`.insid";
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
    gethedispopulation: (entry) => {
        let query = "SELECT hedis_track.emr_id,hedis_track.measureid,hedis_track.mid,hedis_track.value1,hedis_track.value2,hedis_track.dos,hedis_track.status,patient_list.patientid AS patientid,patient_list.EMAIL AS email,patient_list.LNAME AS ptlname,patient_list.FNAME AS ptfname,patient_list.DOB AS dob,patient_list.GENDER AS gender,patient_list.PHONE as phone,patient_list.MOBILE as mobile,patient_list.ADDRESS as addr,patient_list.CITY as city,patient_list.ZIP as zip,patient_list.State as state FROM `hedis_track` INNER JOIN `patient_list` ON `patient_list`.patientid = `hedis_track`.emr_id WHERE `hedis_track`.clinicid = "+entry.clinicid+" AND `hedis_track`.cyear = "+entry.cyear+" AND `hedis_track`.emr_id IS NOT NULL AND hedis_track.insid = "+entry.insid+" AND patient_list.clinicid = "+entry.clinicid+" AND hedis_track.measureid IN (48,53) GROUP BY `hedis_track`.id";
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
    getoutranges: (mid) => {
        let query = "SELECT * FROM `mh_out_range` WHERE `mid`= ? ORDER BY name";
        return new Promise((resolve, reject) => {
            connection.query(query, [mid], (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    setreportlog: (entry) => {
        let query = "SELECT filedefinition FROM `confilename` WHERE id = ?";
        connection.query(query, [entry.fileid], (err, result) => {
            if(typeof result !="undefined" && result.length > 0){
                let query = "INSERT INTO `hedis_report_action_log` (`id`, `loginid`, `clinicid`, `insid`, `userid`, `filetype`, `filename`, `total`, `idarray`, `status`, `date`) VALUES (NULL, ?, ?,  ? , ? , ? , ? , ? , ?, ?, ?)";
                return new Promise((resolve, reject) => {
                    connection.query(query, [entry.loginid, entry.clinicid, entry.insid, entry.userid, result[0]['filedefinition'], entry.filename, entry.total, entry.idarray, 13, new Date()], (err, result) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(result);
                        }
                    });
                });
            }
        });
    },
    setgeneratestatus: (idarray) => {
        let query = "UPDATE `hedis_track` SET `gstatus` = 1 WHERE `id` IN "+idarray;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    getreportlogids: (id) => {
        let query = "SELECT filename,filetype,idarray FROM `hedis_report_action_log` WHERE id = ?";
        return new Promise((resolve, reject) => {
            connection.query(query, [id], (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    updatereported: (entry) => {
        if(entry.rdate == "" || entry.rdate == null) entry.rdate = null;
        let query = "UPDATE `hedis_report_action_log` SET `rdate` = ? , `rby` = ? WHERE `id` = ?";
        return new Promise((resolve, reject) => {
            connection.query(query, [entry.rdate==null?null:new Date(entry.rdate),entry.rby,entry.id], (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    chosenreported: (entry,callback) => {
        let query = "SELECT filename,date,rby,rdate FROM `hedis_report_action_log` WHERE `hedis_report_action_log`.id = "+entry.id;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    setreportedstatus: (idarray) => {
        let query = "UPDATE `hedis_track` SET `rstatus` = 1 WHERE `id` IN "+idarray;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    updatenote: (entry,callback) => {
        let query = "UPDATE `hedisnotes` SET `note` = ? WHERE `id` = ?";
        connection.query(query,[entry.note,entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletenote: (entry,callback) => {
        let query = "DELETE FROM `hedisnotes` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    conciergereport: (entry,callback) => {
        let query = "SELECT hedis_report_action_log.id,hedis_report_action_log.filename,hedis_report_action_log.total,hedis_report_action_log.date,hedis_report_action_log.rdate,hedis_report_action_log.rby,insurances.insName FROM `hedis_report_action_log` LEFT JOIN insurances ON insurances.id = hedis_report_action_log.insid WHERE `hedis_report_action_log`.clinicid = "+entry.clinicid+" ORDER BY insurances.insName,hedis_report_action_log.filename";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    setcustomers: (clinicid,customer,autocheck,amount) => {
        let query = "SELECT * FROM `communiation_info` WHERE clinicid = ?";
        connection.query(query, [clinicid], (err, result) => {
            if(result.length == 0){
                let query = "INSERT INTO `communiation_info` (`id`, `clinicid`, `customer`, `status`,`auto`,`autoamount`) VALUES (NULL, ? , ? , ?,  ?, ? )";
                return new Promise((resolve, reject) => {
                    connection.query(query, [clinicid, customer, 0, (autocheck==1?1:null),(autocheck==1?amount:null)], (err, rows) => {
                        if (err) {
                        reject(err);
                        } else {
                        resolve(rows);
                        }
                    });
                });
            }
            else{
                let query = "UPDATE `communiation_info` SET `customer` = ?, `status` = 0, `auto` = ?, `autoamount` = ? WHERE `id`= ?";
                return new Promise((resolve, reject) => {
                    connection.query(query, [customer,(autocheck==1?1:null),(autocheck==1?amount:null),result[0]['id']], (err, rows) => {
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
    setsmscounts: (entry,callback) => {
        let query = "SELECT * FROM `communiation_info` WHERE `clinicid` = ? AND `status` = 0";
        connection.query(query, [entry.clinicid], (err, result) => {
            if(result[0]['counts'] == null){
                let query = "UPDATE `communiation_info` SET `counts` = ?, `status` = 1 WHERE `clinicid` = ? AND `status` = 0";
                connection.query(query,[entry.counts,entry.clinicid], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                let query = "UPDATE `communiation_info` SET `counts` = ?, `status` = 1 WHERE `clinicid` = ? AND `status` = 0";
                connection.query(query,[parseInt(result[0]['counts'])+parseInt(entry.counts),entry.clinicid], (err, result) => {
                    callback(err, result);
                });
            }
        });
        
    },
    discountsms: (clinicid) => {
        let query = "SELECT counts FROM `communiation_info` WHERE clinicid = ?";
        connection.query(query, [clinicid], (err, result) => {
            let query = "UPDATE `communiation_info` SET `counts` = ? WHERE `clinicid` = ?";
            return new Promise((resolve, reject) => {
                connection.query(query,[parseInt(result[0]['counts'])-1,clinicid], (err, rows) => {
                    if (err) {
                    reject(err);
                    } else {
                    resolve(rows);
                    }
                });
            });
        });
       
    },
    addcountsms: (clinicid,counts) => {
        let query = "SELECT counts FROM `communiation_info` WHERE clinicid = ?";
        connection.query(query, [clinicid], (err, result) => {
            let query = "UPDATE `communiation_info` SET `counts` = ? WHERE `clinicid` = ?";
            return new Promise((resolve, reject) => {
                connection.query(query, [parseInt(result[0]['counts'])+counts-1,clinicid], (err, result) => {
                    if (err) {
                    reject(err);
                    } else {
                    resolve(result);
                    }
                });
            });
        });
    },
    getCounts: (clinicid) => {
        let query = "SELECT counts,customer,autoamount,auto FROM `communiation_info` WHERE clinicid = ?";
        return new Promise((resolve, reject) => {
            connection.query(query, [clinicid], (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    getcredittrack: (clinicid) => {
        let query = "SELECT * FROM `credit_track` WHERE clinicid = ?";
        return new Promise((resolve, reject) => {
            connection.query(query, [clinicid], (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    setcredittrack: (entry,recid,type) => {
        let query = "INSERT INTO `credit_track` (`id`, `rec_id`, `clinicid`, `name`, `email`,`amount`,`counts`,`type`,`status`,`date`) VALUES (NULL, ? , ? , ?,  ?, ?, ? , ? , ?,  ? )";
        return new Promise((resolve, reject) => {
            connection.query(query, [recid, entry.clinicid, entry.fullname, entry.email, entry.amount, entry.counts, type, 1, new Date()], (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
    getclinicmanager: (clinicid) => {
        let query = "SELECT managers.fname,managers.lname,managers.phone FROM `clinicmanagers` LEFT JOIN `managers` ON `managers`.id = `clinicmanagers`.manager WHERE clinicid = ?";
        return new Promise((resolve, reject) => {
            connection.query(query, [clinicid], (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    gethedisreport:(entry) => {
        let query = `SELECT hedis_action_log.userid,fname,lname,hedis_action_log.insid,insurances.insName,hedis_color.name,hedis_color.scheck,COUNT(hedis_action_log.id) AS total,t1.totaltime FROM hedis_action_log JOIN (SELECT id,userid,SUM(TIMESTAMPDIFF(SECOND, conectorworkreport.logintime, conectorworkreport.logouttime)) AS totaltime 
        FROM conectorworkreport 
        WHERE conectorworkreport.status = 1 AND conectorworkreport.logintime <= STR_TO_DATE('`+entry.edate+`', '%m/%d/%Y') AND conectorworkreport.logintime >= STR_TO_DATE('`+entry.sdate+`', '%m/%d/%Y') GROUP BY userid) t1 ON t1.userid = hedis_action_log.userid JOIN hedis_color ON hedis_color.scheck = hedis_action_log.action_id LEFT JOIN insurances ON insurances.id = hedis_action_log.insid LEFT JOIN managers ON managers.id = hedis_action_log.userid WHERE hedis_action_log.clinicid = ? AND date <= STR_TO_DATE('`+entry.edate+`', '%m/%d/%Y') AND date >= STR_TO_DATE('`+entry.sdate+`', '%m/%d/%Y') AND hedis_action_log.loginid IS NOT NULL AND hedis_action_log.action_id IS NOT NULL GROUP BY hedis_action_log.userid,hedis_action_log.insid,action_id ORDER BY fname,lname,insurances.insName,hedis_color.name`;
        return new Promise((resolve, reject) => {
            connection.query(query, [entry.clinicid], (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    getaccessbydate: (entry) => {
        let query = `SELECT id,logintime,TIMESTAMPDIFF(SECOND, conectorworkreport.logintime, conectorworkreport.logouttime) AS totaltime FROM conectorworkreport WHERE userid = `+entry.userid+` AND conectorworkreport.status = 1 AND conectorworkreport.logintime <= STR_TO_DATE('`+entry.edate+`', '%m/%d/%Y') AND conectorworkreport.logintime >= STR_TO_DATE('`+entry.sdate+`', '%m/%d/%Y') ORDER BY logintime`;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    actionbydate: (clinicid,userid,logins) => {
        let query = `SELECT hedis_action_log.userid,hedis_action_log.insid,insurances.insName,hedis_color.name,COUNT(hedis_action_log.id) AS total FROM hedis_action_log LEFT JOIN hedis_color ON hedis_color.scheck = hedis_action_log.action_id LEFT JOIN insurances ON insurances.id = hedis_action_log.insid WHERE hedis_action_log.clinicid = ${clinicid} AND hedis_action_log.userid = ${userid} AND hedis_action_log.loginid IN ${logins} GROUP BY hedis_action_log.insid,action_id ORDER BY insurances.insName,hedis_color.name`;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    getnotesbyuser: (entry) => {
        let query = `SELECT createduser AS userid,insid,COUNT(*) AS total FROM hedisnotes WHERE clinicid = `+entry.clinicid+` AND created <= STR_TO_DATE('`+entry.edate+`', '%m/%d/%Y') AND created >= STR_TO_DATE('`+entry.sdate+`', '%m/%d/%Y') AND createduser IS NOT NULL AND insid IS NOT NULL GROUP BY createduser,insid ORDER BY createduser,insid`;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    getsmssbyuser: (entry) => {
        let query = `SELECT userid,insid,COUNT(*) AS total FROM trackhedissmssent WHERE clinicid = `+entry.clinicid+` AND date <= STR_TO_DATE('`+entry.edate+`', '%m/%d/%Y') AND date >= STR_TO_DATE('`+entry.sdate+`', '%m/%d/%Y') AND userid IS NOT NULL AND insid IS NOT NULL GROUP BY userid,insid ORDER BY userid,insid`;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    getPTsbyquery: (clinicid,measurekey) => {
        let query = `SELECT emr_id,ptfname,ptlname,dob FROM hedis_track WHERE clinicid = ${clinicid} AND emr_id IS NOT NULL AND measure LIKE "%${measurekey}%" AND status NOT IN (1,2,3,8,9,13) GROUP BY emr_id ORDER BY emr_id`;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, result) => {
                if (err) {
                reject(err);
                } else {
                resolve(result);
                }
            });
        });
    },
    getPatient: (entry,callback) => {
        query = "SELECT p.*  FROM `patient_list` as p  LEFT JOIN  `hedis_track` as h ON p.patientid = h.emr_id  WHERE h.id ="+entry.id;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
}
module.exports = hedis;