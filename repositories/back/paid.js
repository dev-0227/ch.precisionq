const connection = require('../../utilities/database');
const accounts = {
    getdesc: (callback) => {
        let query = "SELECT `desc` FROM `reportdesc` WHERE report_value = '16'";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getexvalue: (clinicid) => {
        let query = "SELECT `payment` FROM `gsetting` WHERE type = 'cptexclusion' AND clinicid="+clinicid;
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
    getgroups: (callback) => {
        let query = "SELECT `id`,`name` FROM `gsetting` WHERE type = 'pgroup' ORDER BY name";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getclinicspec: (callback) => {
        let query = "SELECT * FROM `clinicspeciality` WHERE 1 ORDER BY name";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getInsamount: (entry,callback) => {
        let query = "SELECT InsName,ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY insName ORDER BY insName";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getcspec: () => {
        let query = "SELECT id,cspec FROM `clinics` WHERE cspec IS NOT NULL AND cspec !=''";
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
    getins: (entry) => {
        let query = "SELECT InsName FROM `ffs_table` WHERE clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY InsName ORDER BY InsName";
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
        let query = "SELECT MAX(date) AS max,MIN(date) AS min FROM `ffs_table` WHERE clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" )";
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
    getVisits: (entry) => {
        let query = "SELECT InsName,COUNT(VTYPE) AS visitcnt FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY insName ORDER BY insName";
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
    getPTs: (entry) => {
        let query = "SELECT t1.InsName,COUNT(t1.PT_ID) AS ptcnt FROM (SELECT InsName,PT_ID FROM `ffs_table` WHERE  date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY insName,PT_ID) AS t1 GROUP BY t1.InsName ORDER BY t1.InsName";
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
    getBestCPT: (entry,callback) => {
        let query = "SELECT CPT,ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY CPT ORDER BY amount DESC LIMIT 0,20";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getTotalVisits: (entry) => {
        let query = "SELECT COUNT(VTYPE) AS visitcnt FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" )";
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
    getTotalPTs: (entry) => {
        let query = "SELECT COUNT(t1.PT_ID) AS ptcnt FROM (SELECT PT_ID FROM `ffs_table` WHERE  date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY PT_ID) AS t1";
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
    getGroups: () => {
        let query = "SELECT gsetting.name,GROUP_CONCAT(paidcptcode.cpt) AS cpts FROM `gsetting` LEFT JOIN `paidcptcode` ON `paidcptcode`.gid = `gsetting`.id WHERE type='pgroup' GROUP BY name";
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
    getModGroups: () => {
        let query = "SELECT gsetting.name,GROUP_CONCAT(paidcptcode.cpt) AS cpts FROM `gsetting` LEFT JOIN `paidcptcode` ON `paidcptcode`.tmpgid = `gsetting`.id WHERE type='pgroup' AND paidcptcode.selectmodifier IS NOT NULL GROUP BY name";
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
    getgroupamount: (entry,name,cpts) => {
        let query = "";
        if(name.toLowerCase() == "telehealth"){
            query = "SELECT ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE  date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND Mod1 != 25 AND CPT IN "+cpts+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" )";
        }
        else{
            query = "SELECT ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE  date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND Mod1 != 95 AND CPT IN "+cpts+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" )";
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
    getgroupamountbyins: (entry,name,cpts) => {
        let query = "";
        if(name.toLowerCase() == "telehealth"){
            query = "SELECT InsName,ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE  date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND Mod1 != 25 AND CPT IN "+cpts+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY InsName ORDER BY InsName";
        }
        else{
            query = "SELECT InsName,ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE  date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND Mod1 != 95 AND CPT IN "+cpts+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY InsName ORDER BY InsName";
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
    getsubGroups: () => {
        let query = "SELECT gsetting.name,t1.name AS pname,GROUP_CONCAT(paidcptcode.cpt) AS cpts FROM `paidcptcode` LEFT JOIN `gsetting` AS t1 ON paidcptcode.gid = t1.id LEFT JOIN gsetting ON gsetting.id = paidcptcode.sgid WHERE gsetting.type='spgroup' AND paidcptcode.selectmodifier IS NULL GROUP BY gsetting.name";
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
    getModsubGroups: () => {
        let query = "SELECT gsetting.name,t1.name AS pname,GROUP_CONCAT(paidcptcode.cpt) AS cpts FROM `paidcptcode` LEFT JOIN `gsetting` AS t1 ON paidcptcode.tmpgid = t1.id LEFT JOIN gsetting ON gsetting.id = paidcptcode.tmpsgid WHERE gsetting.type='spgroup' AND paidcptcode.selectmodifier IS NOT NULL GROUP BY gsetting.name";
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
    getsubgroupamount: (entry,name,cpts) => {
        let query = "";
        if(name.toLowerCase() == "telehealth"){
            query = "SELECT ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE  date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND Mod1 != 25 AND CPT IN "+cpts+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" )";
        }
        else{
            query = "SELECT ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE  date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND Mod1 != 95 AND CPT IN "+cpts+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" )";
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
    gettopins: (entry,callback) => {
        let query = "SELECT InsName,ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY insName ORDER BY amount DESC";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    gettopinsclaim: (entry,callback) => {
        let query = "SELECT InsName,COUNT(VTYPE) AS visitcnt FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY insName ORDER BY visitcnt DESC";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    gettopinspts: (entry,callback) => {
        let query = "SELECT t1.InsName,COUNT(t1.PT_ID) AS ptcnt FROM (SELECT InsName,PT_ID FROM `ffs_table` WHERE  date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY insName,PT_ID) AS t1 GROUP BY t1.InsName ORDER BY ptcnt DESC";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getavgpcppayment: (entry) => {
        let query = "SELECT PCP_ID,users.fullname AS pcpname,ROUND(SUM(CPT_PAY),0) AS amount,COUNT(VTYPE) AS visitcnt FROM `ffs_table` LEFT JOIN `users` ON `users`.userid = `ffs_table`.PCP_ID WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND `users`.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY PCP_ID ORDER BY pcpname";
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
    getpcppts: (entry) => {
        let query = "SELECT t1.fullname,COUNT(t1.PT_ID) AS ptcnt FROM (SELECT users.fullname,PT_ID FROM `ffs_table` LEFT JOIN `users` ON `users`.userid = ffs_table.PCP_ID WHERE users.clinicid = "+entry.clinicid+" AND date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND `users`.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY PCP_ID,PT_ID) AS t1 GROUP BY t1.fullname ORDER BY t1.fullname";
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
    getpcpdates: (entry) => {
        let query = "SELECT t1.fullname,COUNT(t1.date) AS datecnt FROM (SELECT users.fullname,date FROM `ffs_table` LEFT JOIN `users` ON `users`.userid = ffs_table.PCP_ID WHERE users.clinicid = "+entry.clinicid+" AND date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY PCP_ID,date) AS t1 GROUP BY t1.fullname ORDER BY t1.fullname";
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
    getannnp: () => {
        let query = "SELECT id FROM `gsetting` WHERE type = 'spgroup' OR name LIKE '%Tele Ann-Wellness%'";
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
    getmainnp: () => {
        let query = "SELECT id FROM `gsetting` WHERE type = 'pgroup' AND name LIKE '%New Patients%'";
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
    getannnpcodes: (tmpannnp) => {
        let query = "SELECT cpt FROM `paidcptcode` WHERE tmpsgid IN "+tmpannnp;
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
    getnpcodes: (tmpmainnp) => {
        let query = "SELECT cpt FROM `paidcptcode` WHERE gid IN "+tmpmainnp;
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
    getpcpannnptotal: (entry,tmpannnpcodes) => {
        let query = "SELECT PCP_ID,users.fullname AS pcpname,ROUND(SUM(CPT_PAY),0) AS amount,COUNT(VTYPE) AS visitcnt FROM `ffs_table` LEFT JOIN `users` ON `users`.userid = `ffs_table`.PCP_ID WHERE users.clinicid = "+entry.clinicid+" AND date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND `users`.clinicid = "+entry.clinicid+" AND CPT IN "+tmpannnpcodes+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY PCP_ID ORDER BY pcpname";
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
    getpcpnptotal: (entry,tmpnpcodes) => {
        let query = "SELECT PCP_ID,users.fullname AS pcpname,ROUND(SUM(CPT_PAY),0) AS amount,COUNT(VTYPE) AS visitcnt FROM `ffs_table` LEFT JOIN `users` ON `users`.userid = `ffs_table`.PCP_ID WHERE users.clinicid = "+entry.clinicid+" AND date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND `users`.clinicid = "+entry.clinicid+" AND CPT IN "+tmpnpcodes+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY PCP_ID ORDER BY pcpname";
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
    getinsbypcp: (entry) => {
        let query = "SELECT PCP_ID,users.fullname AS pcpname,InsName,ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` LEFT JOIN `users` ON `users`.userid = `ffs_table`.PCP_ID WHERE users.clinicid = "+entry.clinicid+" AND date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY PCP_ID,InsName ORDER BY pcpname,amount DESC";
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
    gettop10pts: (entry) => {
        let query = "SELECT ffs_table.PT_ID,ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY PT_ID,InsName ORDER BY amount DESC";
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
    getptinfo: (clinicid,ptid) => {
        let query = "SELECT FNAME,LNAME FROM `patient_list` WHERE clinicid = "+clinicid+" AND patientid = "+ptid+" GROUP BY patientid";
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
    gettop10pts: (entry) => {
        let query = "SELECT ffs_table.PT_ID,ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY PT_ID,InsName ORDER BY amount DESC LIMIT 0,10";
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
    getinsamountbypt: (entry,ptid) => {
        let query = "SELECT InsName,ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PT_ID = "+ptid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY InsName ORDER BY amount DESC";
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
    gettopgroupamount: (entry,name,cpts) => {
        let query = "";
        if(name.toLowerCase() == "telehealth"){
            query = "SELECT InsName,ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE  date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND Mod1 != 25 AND CPT IN "+cpts+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY InsName ORDER BY amount DESC LIMIT 0,5";
        }
        else{
            query = "SELECT InsName,ROUND(SUM(CPT_PAY),0) AS amount FROM `ffs_table` WHERE  date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND Mod1 != 95 AND CPT IN "+cpts+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY InsName ORDER BY amount DESC LIMIT 0,5";
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
    getcptsbyins: (entry,ptid) => {
        let query = "SELECT InsName,CPT,CPT_DESC,ROUND(SUM(CPT_PAY),2) AS amount,GROUP_CONCAT(CONCAT(`VTYPE`,' ',`ICD`,' ',`Mod1`)) AS visittype FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY InsName,CPT,ICD,VTYPE ORDER BY InsName,CPT,amount";
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
    getgcodes: (group) => {
        let query = "";
        if(group != 0){
            query = "SELECT cpt FROM `paidcptcode` WHERE gid = "+group+" GROUP BY cpt";
        }
        else{
            query = "SELECT cpt FROM `paidcptcode` WHERE 1 GROUP BY cpt";
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
    getgcodessuper: () => {
        let query = "SELECT cpt FROM `paidcptcode` WHERE 1 GROUP BY cpt";
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
    getacodes: (entry) => {
        let query = "SELECT CPT FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY CPT";
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
        let query = "SELECT CPT FROM `ffs_table` WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.clinicid = "+entry.clinicid+" AND ffs_table.InsName = '"+entry.ins+"' AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY CPT";
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
    
    getnogroupcodes: (entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics) => {
        let query = "SELECT ffs_table.clinicid,clinics.name AS clinicname,ffs_table.CPT,ffs_table.CPT_DESC,ffs_table.InsName,MAX(ffs_table.CPT_PAY) AS max,ffs_table.ICD FROM `ffs_table` JOIN `clinics` ON `clinics`.id = `ffs_table`.clinicid WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.CPT NOT IN "+tmpgcodestring+(entry.type == 1?" AND ffs_table.clinicid = "+entry.clinicid:"")+(entry.type == 3?" AND ffs_table.clinicid != "+entry.clinicid+" AND ffs_table.CPT NOT IN "+tmpacodestring:"")+((entry.type == 3||entry.type == 2)&&aspecclinics.length > 0?" AND ffs_table.clinicid IN "+tmpaspecclinicstring:"")+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY ffs_table.clinicid,ffs_table.CPT ORDER BY ffs_table.CPT";
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
        let query = "SELECT ffs_table.clinicid,clinics.name AS clinicname,ffs_table.CPT,ffs_table.CPT_DESC,ffs_table.InsName,MAX(ffs_table.CPT_PAY) AS max,ffs_table.ICD FROM `ffs_table` JOIN `clinics` ON `clinics`.id = `ffs_table`.clinicid WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.CPT NOT IN "+tmpgcodestring+(entry.type == 1?" AND ffs_table.clinicid = "+entry.clinicid:"")+(entry.type == 3?" AND ffs_table.clinicid != "+entry.clinicid+" AND ffs_table.CPT NOT IN "+tmpacodestring:"")+((entry.type == 3||entry.type == 2)&&aspecclinics.length > 0?" AND ffs_table.clinicid IN "+tmpaspecclinicstring:"")+" AND ffs_table.InsName = '"+entry.ins+"' AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY ffs_table.clinicid,ffs_table.CPT ORDER BY ffs_table.CPT";
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
    getgroupcodes: (entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics) => {
        let query = "SELECT ffs_table.clinicid,clinics.name AS clinicname,gsetting.name AS name,t1.name AS subname,ffs_table.CPT,ffs_table.CPT_DESC,ffs_table.InsName,MAX(ffs_table.CPT_PAY) AS max,ffs_table.ICD FROM `ffs_table` JOIN `clinics` ON `clinics`.id = `ffs_table`.clinicid JOIN `paidcptcode` ON `paidcptcode`.cpt = `ffs_table`.CPT LEFT JOIN `gsetting` ON `gsetting`.id = `paidcptcode`.gid AND gsetting.type='pgroup' LEFT JOIN gsetting AS t1 ON t1.id = paidcptcode.sgid AND t1.type='spgroup' WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.Mod1 != 95"+(entry.group != 0?" AND paidcptcode.gid="+entry.group:"")+(entry.type == 1?" AND ffs_table.clinicid="+entry.clinicid:"")+(entry.type == 3?" AND ffs_table.clinicid != "+entry.clinicid+" AND ffs_table.CPT NOT IN "+tmpacodestring:"")+((entry.type == 3||entry.type == 2)&&aspecclinics.length > 0?" AND ffs_table.clinicid IN "+tmpaspecclinicstring:"")+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY ffs_table.clinicid,ffs_table.CPT,ffs_table.InsName ORDER BY gsetting.name,t1.name DESC,ffs_table.CPT";
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
        let query = "SELECT ffs_table.clinicid,clinics.name AS clinicname,gsetting.name AS name,t1.name AS subname,ffs_table.CPT,ffs_table.CPT_DESC,ffs_table.InsName,MAX(ffs_table.CPT_PAY) AS max,ffs_table.ICD FROM `ffs_table` JOIN `clinics` ON `clinics`.id = `ffs_table`.clinicid JOIN `paidcptcode` ON `paidcptcode`.cpt = `ffs_table`.CPT LEFT JOIN `gsetting` ON `gsetting`.id = `paidcptcode`.gid AND gsetting.type='pgroup' LEFT JOIN gsetting AS t1 ON t1.id = paidcptcode.sgid AND t1.type='spgroup' WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.Mod1 != 95"+(entry.type == 1?" AND ffs_table.clinicid="+entry.clinicid:"")+(entry.type == 3?" AND ffs_table.clinicid != "+entry.clinicid+" AND ffs_table.CPT NOT IN "+tmpacodestring:"")+((entry.type == 3||entry.type == 2)&&aspecclinics.length > 0?" AND ffs_table.clinicid IN "+tmpaspecclinicstring:"")+" AND ffs_table.InsName = '"+entry.ins+"' AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY ffs_table.clinicid,ffs_table.CPT ORDER BY gsetting.name,t1.name DESC,ffs_table.CPT";
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
    getmodgroupcodes: (entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics) => {
        let query = "SELECT ffs_table.clinicid,clinics.name AS clinicname,gsetting.name AS name,t1.name AS subname,ffs_table.CPT,ffs_table.CPT_DESC,ffs_table.InsName,MAX(ffs_table.CPT_PAY) AS max,ffs_table.ICD FROM `ffs_table` JOIN `clinics` ON `clinics`.id = `ffs_table`.clinicid JOIN `paidcptcode` ON `paidcptcode`.cpt = `ffs_table`.CPT AND paidcptcode.selectmodifier IS NOT NULL LEFT JOIN `gsetting` ON `gsetting`.id = `paidcptcode`.tmpgid AND gsetting.type='pgroup' LEFT JOIN gsetting AS t1 ON t1.id = paidcptcode.tmpsgid AND t1.type='spgroup' WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.Mod1 = 95"+(entry.group != 0?" AND paidcptcode.gid="+entry.group:"")+(entry.type == 1?" AND ffs_table.clinicid="+entry.clinicid:"")+(entry.type == 3?" AND ffs_table.clinicid != "+entry.clinicid+" AND ffs_table.CPT NOT IN "+tmpacodestring:"")+((entry.type == 3||entry.type == 2)&&aspecclinics.length > 0?" AND ffs_table.clinicid IN "+tmpaspecclinicstring:"")+" AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY ffs_table.clinicid,ffs_table.CPT,ffs_table.InsName ORDER BY gsetting.name,t1.name DESC,ffs_table.CPT";
       
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
        let query = "SELECT ffs_table.clinicid,clinics.name AS clinicname,gsetting.name AS name,t1.name AS subname,ffs_table.CPT,ffs_table.CPT_DESC,ffs_table.InsName,MAX(ffs_table.CPT_PAY) AS max,ffs_table.ICD FROM `ffs_table` JOIN `clinics` ON `clinics`.id = `ffs_table`.clinicid JOIN `paidcptcode` ON `paidcptcode`.cpt = `ffs_table`.CPT AND paidcptcode.selectmodifier IS NOT NULL LEFT JOIN `gsetting` ON `gsetting`.id = `paidcptcode`.tmpgid AND gsetting.type='pgroup' LEFT JOIN gsetting AS t1 ON t1.id = paidcptcode.tmpsgid AND t1.type='spgroup' WHERE date <= STR_TO_DATE('"+entry.edate+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+entry.sdate+"', '%m/%d/%Y') AND ffs_table.Mod1 = 95"+(entry.type == 1?" AND ffs_table.clinicid="+entry.clinicid:"")+(entry.type == 3?" AND ffs_table.clinicid != "+entry.clinicid+" AND ffs_table.CPT NOT IN "+tmpacodestring:"")+((entry.type == 3||entry.type == 2)&&aspecclinics.length > 0?" AND ffs_table.clinicid IN "+tmpaspecclinicstring:"")+" AND ffs_table.InsName = '"+entry.ins+"' AND ffs_table.PayorT = 1 AND ( ffs_table.CPT_PAY IS NOT NULL AND CAST(ffs_table.CPT_PAY AS float) > "+parseFloat(entry.value)+" ) GROUP BY ffs_table.clinicid,ffs_table.CPT ORDER BY gsetting.name,t1.name DESC,ffs_table.CPT";
       
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
module.exports = accounts;