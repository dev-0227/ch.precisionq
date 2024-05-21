const connection = require('../../../utilities/database');


const communications = {
    checkcalltime: (clinicid) => {
        let query = "SELECT counts,customer,autoamount,auto FROM `communiation_call_info` WHERE clinicid = ?";
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
    gettwiliokeygroups: (clid,callback) => {
        let query = "SELECT * FROM `clinic_sms_account` WHERE `clinic_id` = "+clid;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    setcalllogtrack: (entry) => {
        console.log(entry.userid, entry.clinicid, entry.phone, entry.dudration, entry.price, entry.patinsid, entry.patemrid, entry.calldate)
        let query = "INSERT INTO `call_track_table` (`id`, `userid`, `clinic_id`, `receive_num`, `duration`,`price`,`ins_id`,`emr_id`,`call_date`) VALUES (NULL, ? , ? , ?,  ?, ?, ? , ? , ?)";
        return new Promise((resolve, reject) => {
            connection.query(query, [entry.userid, entry.clinicid, entry.phone, entry.dudration, entry.price, entry.patinsid, entry.patemrid, entry.calldate], (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
    fhirtracksmssentinfo: (ptinsid,ptemrid,mstatus,subject,measureid,medium,clinicid,userid,received,content,date,casenum,dtitle,dgcategory) => {
        query = "INSERT INTO `f_com_table`(`id`, `identifier`,`pt_emrid`,`basedOn`, `partOf`, `status`, `statusReason`, `category`, `priority`, `medium`, `subject`, `topic`, `about`,`sent`,`sender`,`recipient`,`content`,`casenumber`,`contentReference`,`clinicid`,`reasonReference`) VALUES (NULL,'"+ptinsid+"','"+ptemrid+"','Missing Services','Communication','"+mstatus+"','','"+dgcategory+"','routine','"+medium+"','"+subject+"','outbound_"+medium+"','Missing Services',STR_TO_DATE('"+date+"', '%m/%d/%Y') ,"+userid+",'"+received+"','"+content+"','"+casenum+"','"+measureid+"',"+clinicid+",'"+dtitle+"')";
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
    
    updateavailabletime: (clinicid,duration) => {
        let realmin = duration/60 +1 
        let query = "UPDATE `communiation_call_info` SET  counts = counts-"+realmin+" WHERE `clinicid`= "+clinicid;
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

    setcallcounts: (entry,callback) => {
        let query = "SELECT * FROM `communiation_call_info` WHERE `clinicid` = ? AND `status` = 0";
        connection.query(query, [entry.clinicid], (err, result) => {
            if(result[0]['counts'] == null){
                let query = "UPDATE `communiation_call_info` SET `counts` = ?, `status` = 1 WHERE `clinicid` = ? AND `status` = 0";
                connection.query(query,[entry.counts,entry.clinicid], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                let query = "UPDATE `communiation_call_info` SET `counts` = ?, `status` = 1 WHERE `clinicid` = ? AND `status` = 0";
                connection.query(query,[parseInt(result[0]['counts'])+parseInt(entry.counts),entry.clinicid], (err, result) => {
                    callback(err, result);
                });
            }
        });
        
    },

}
module.exports = communications;