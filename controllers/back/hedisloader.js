const xlsx = require('node-xlsx');
const Excel = require('exceljs');
const path = require('path');
const hedisloader = require('../../repositories/back/hedisloader');
const hedis = require('../../repositories/back/hedis');
const converter = require('json-2-csv');
const fs = require('fs');
const hedis_backup_path = "./public/hedis/";

function ExcelDateToJSDate(serial) {
    let utc_days = serial - 25568;
    let utc_value = utc_days * 86400;
    let date_info = new Date(utc_value * 1000);

    let year = date_info.getFullYear();
    let month = date_info.getMonth() + 1;
    let dt = date_info.getDate();

    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return year + '-' + month + '-' + dt;
}
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
function deDateFormat(serial) {
    let year = serial.getFullYear();
    let month = serial.getMonth() + 1;
    let dt = serial.getDate();
  
    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return year+'-'+month+'-'+dt;
  }
  function DateFormatOutput(serial) {
    let year = serial.getFullYear();
    let month = serial.getMonth() + 1;
    let dt = serial.getDate();
  
    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return month+''+dt+''+year;
}
exports.qualityloader = async (req, res, next) => {
    let cyear = req.body.cyear;
    let clinicid = req.body.clinicid;
    let insid = req.body.insid;
    let backupcheck = req.body.backupcheck;
    let retrospect = req.body.retrospect;
    let filePath = req.files[0].path;
    let pureSheet = [];
    // Parse a file
    await hedisloader.updatehstatus(clinicid, insid);
    if(backupcheck == 1){
        let currentData = await hedisloader.getcurrentData(clinicid,insid,cyear);
        for(var i = 0;i < currentData.length;i++){
            currentData[i]['dob'] = DateFormat(new Date(currentData[i]['dob']));
            currentData[i]['dos'] = currentData[i]['dos'] != null?DateFormat(new Date(currentData[i]['dos'])):"";
            currentData[i]['apptdate'] = currentData[i]['apptdate'] != null?DateFormat(new Date(currentData[i]['apptdate'])):"";
            currentData[i]['lastdate'] = currentData[i]['lastdate'] != null?DateFormat(new Date(currentData[i]['lastdate'])):"";
        }
        var filename = "backup-"+clinicid+"-"+insid+"-"+new Date().getTime()+'.csv';
        if(currentData.length>0){
            await hedisloader.backuphedis(clinicid, insid, filename, currentData.length);
            converter.json2csv(currentData, (err, csv) => {
                if (err)throw err;
                fs.writeFileSync(hedis_backup_path + filename, csv);
            });
        }
        
    }
    let getgrlists = await hedisloader.getgrlists(clinicid,insid,cyear);
    let getimeasure = await hedisloader.getimeasure();
    let getallpts = await hedisloader.getallpts(clinicid);
    let tmpimeasure = [];
    for(var i = 0; i < getimeasure.length;i++){
        tmpimeasure.push(getimeasure[i]['name']);
    }
    let existedmid = await hedisloader.getexistedmid(clinicid,insid);
    let tmpexistedmid = [];
    for(var i = 0; i < existedmid.length;i++){
        tmpexistedmid.push(existedmid[i]['mid']);
    }
    const workSheetsFromFile = xlsx.parse(filePath);
    pureSheet = workSheetsFromFile[0].data;
    let rowCounter = 0;
    let fieldArr = [];
    let newmid = [];
    let hstatus = 0;
    let retroArray = [];
    for(var i = 0; i < pureSheet[0].length;i++){
        let result = await hedisloader.getfields(pureSheet[0][i]);
        if(result.length > 0)
            fieldArr[result[0]['fields']]=i;
    }
    for (row of pureSheet) {
        if (rowCounter != 0) {
            let entry = [];
            let emr_id = null;
            let phone = null;
            let email = null;
            let measureid = null;
            let fname = null;
            let lname = null;
            if(!tmpimeasure.includes(row[fieldArr['measure']])){
                if (typeof row[fieldArr['ptlname']] !== 'undefined') {
                    for(var i = 0;i < getallpts.length;i++){
                        if(deDateFormat(new Date(getallpts[i]['DOB'])) == ExcelDateToJSDate(row[fieldArr['dob']]) 
                            && typeof getallpts[i]['LNAME'] !== 'undefined' 
                            && row[fieldArr['ptlname']].toLowerCase().includes(getallpts[i]['LNAME'].toLowerCase())){
                                emr_id = getallpts[i]['patientid'];
                                phone = getallpts[i]['PHONE'];
                                email = getallpts[i]['EMAIL'];
                                fname = getallpts[i]['FNAME'];
                                lname = getallpts[i]['LNAME'];
                                break;
                        }
                    }
                }
                else if(typeof row[fieldArr['ptname']] !== 'undefined'){
                    for(var i = 0;i < getallpts.length;i++){
                        if(deDateFormat(new Date(getallpts[i]['DOB'])) == ExcelDateToJSDate(row[fieldArr['dob']]) 
                            && typeof getallpts[i]['LNAME'] !== 'undefined' 
                            && row[fieldArr['ptname']].toLowerCase().includes(getallpts[i]['LNAME'].toLowerCase())){
                                emr_id = getallpts[i]['patientid'];
                                phone = getallpts[i]['PHONE'];
                                email = getallpts[i]['EMAIL'];
                                fname = getallpts[i]['FNAME'];
                                lname = getallpts[i]['LNAME'];
                                break;
                        }
                    }
                    if(fname == null){
                        let tmpname = row[fieldArr['ptname']].split(",");
                        fname = tmpname[0]?tmpname[0]:null;
                        fname = tmpname[1]?tmpname[1]:null;
                    }
                }
                
                    
                measures = await hedisloader.getHedisMeasure(row[fieldArr['measure']]);
                
                if(measures.length > 0){
                    measureid = measures[0]['id'];
                    if(!tmpexistedmid.includes(row[fieldArr['mid']])){
                        hstatus = 2;
                    }
                    else{
                        hstatus = 1;
                    }
                    entry = {
                        cyear:cyear,
                        clinicid:clinicid,
                        insid:insid,
                        emr_id:emr_id?emr_id:null,
                        mid:row[fieldArr['mid']],
                        ptfname:fname==null?row[fieldArr['ptfname']]:fname,
                        ptlname:lname==null?row[fieldArr['ptlname']]:lname,
                        dob:ExcelDateToJSDate(row[fieldArr['dob']]),
                        phone:phone?phone:row[fieldArr['phone']],
                        email:email?email:row[fieldArr['email']],
                        mlob:row[fieldArr['mlob']],
                        measureid:measureid?measureid:null,
                        measure:row[fieldArr['measure']],
                        ins_pcp_id:row[fieldArr['ins_pcp_id']],
                        flag:0,
                        status:0,
                        hstatus:hstatus
                    };
                    await hedisloader.qualityloader(entry,0, () => {});
                    if(!newmid.includes(row[fieldArr['mid']]))
                        newmid.push(row[fieldArr['mid']]);
                }
                else{
                    multimeasures = await hedisloader.getMultipleHedisMeasure(row[fieldArr['measure']]);
                    if(multimeasures.length > 0){
                        for(var i = 0;i < multimeasures.length;i++){
                            for(var j = 0;j < parseInt(multimeasures[i]['multipleQuantity']==null?0:multimeasures[i]['multipleQuantity']);j++){
                                if(!tmpexistedmid.includes(row[fieldArr['mid']])){
                                    hstatus = 2;
                                }
                                else{
                                    hstatus = 0;
                                }
                                entry = {
                                    cyear:cyear,
                                    clinicid:clinicid,
                                    insid:insid,
                                    emr_id:emr_id?emr_id:null,
                                    mid:row[fieldArr['mid']],
                                    ptfname:fname==null?row[fieldArr['ptfname']]:fname,
                                    ptlname:lname==null?row[fieldArr['ptlname']]:lname,
                                    dob:ExcelDateToJSDate(row[fieldArr['dob']]),
                                    phone:phone?phone:row[fieldArr['phone']],
                                    email:email?email:row[fieldArr['email']],
                                    mlob:row[fieldArr['mlob']],
                                    measureid:multimeasures[i]['id']?multimeasures[i]['id']:null,
                                    measure:row[fieldArr['measure']],
                                    ins_pcp_id:row[fieldArr['ins_pcp_id']],
                                    flag:0,
                                    status:0,
                                    hstatus:hstatus
                                };
                                // console.log(entry)
                                await hedisloader.qualityloader(entry,1, () => {});
                                if(!newmid.includes(row[fieldArr['mid']]))
                                    newmid.push(row[fieldArr['mid']]);
                            } 
                        }
                        
                    }
                    else{
                        if(!tmpexistedmid.includes(row[fieldArr['mid']])){
                            hstatus = 2;
                        }
                        else{
                            hstatus = 1;
                        }
                        entry = {
                            cyear:cyear,
                            clinicid:clinicid,
                            insid:insid,
                            emr_id:emr_id?emr_id:null,
                            mid:row[fieldArr['mid']],
                            ptfname:fname==null?row[fieldArr['ptfname']]:fname,
                            ptlname:lname==null?row[fieldArr['ptlname']]:lname,
                            dob:ExcelDateToJSDate(row[fieldArr['dob']]),
                            phone:phone?phone:row[fieldArr['phone']],
                            email:email?email:row[fieldArr['email']],
                            mlob:row[fieldArr['mlob']],
                            measureid:null,
                            measure:row[fieldArr['measure']],
                            ins_pcp_id:row[fieldArr['ins_pcp_id']],
                            flag:0,
                            status:0,
                            hstatus:hstatus
                        };
                        await hedisloader.qualityloader(entry,0, () => {});
                        if(!newmid.includes(row[fieldArr['mid']]))
                            newmid.push(row[fieldArr['mid']]);
                    }
                }
                if(retrospect == 1){
                    for(let k = 0;k < getgrlists.length;k++){
                        if(getgrlists[k].mid == entry.mid && getgrlists[k].measure == entry.measure){
                            retroArray.push(getgrlists[k].id);
                        }
                    }
                }
            }
        }
        rowCounter++;
    };
    let generated = await hedisloader.getgenerated(clinicid,insid,cyear);
    let reported = await hedisloader.getreported(clinicid,insid,cyear);
    var tmpnewmid = "('0'";
    for(var i=0;i<newmid.length;i++){
        tmpnewmid += ",'"+newmid[i]+"'";
    }
    tmpnewmid += ")";
    await hedisloader.updatenolonger(clinicid,insid,tmpnewmid);
    let nolonger = await hedisloader.getnolonger(clinicid,insid,cyear);
    await hedisloader.getnewpt(clinicid,insid,cyear, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ new:result[0]['total'],nolonger:nolonger[0]['total'],generated:generated[0]['total'],reported:reported[0]['total'],retro:retroArray });
        }
    });
}
exports.tmpqualityloader = async (req, res, next) => {
    let filePath = req.files[0].path;
    let pureSheet = [];
    // Parse a file
    const workSheetsFromFile = xlsx.parse(filePath);
    pureSheet = workSheetsFromFile[0].data;
    let headers = pureSheet[0];
    let rowCounter = 0;
    for (row of pureSheet) {
        if (rowCounter != 0) {
            measures = await hedisloader.getmeasure(row[headers.indexOf("measureid")]);
            if(measures.length > 0){
                measureid = measures[0]['id'];
                entry = {
                    cyear:row[headers.indexOf("cyear")],
                    clinicid:row[headers.indexOf("clinicid")],
                    insid:row[headers.indexOf("insid")],
                    emr_id:(row[headers.indexOf("emr_id")]=="null"||row[headers.indexOf("emr_id")]=="")?null:row[headers.indexOf("emr_id")],
                    mid:(row[headers.indexOf("mid")]=="null"||row[headers.indexOf("mid")]=="")?null:row[headers.indexOf("mid")],
                    ptfname:(row[headers.indexOf("ptfname")]=="null"||row[headers.indexOf("ptfname")]=="")?null:row[headers.indexOf("ptfname")],
                    ptlname:(row[headers.indexOf("ptlname")]=="null"||row[headers.indexOf("ptlname")]=="")?null:row[headers.indexOf("ptlname")],
                    dob:(typeof row[headers.indexOf("dob")] == "undefined" || row[headers.indexOf("dob")]=="null"||row[headers.indexOf("dob")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("dob")]),
                    phone:(row[headers.indexOf("phone")]=="null"||row[headers.indexOf("phone")]=="")?null:row[headers.indexOf("phone")],
                    email:(row[headers.indexOf("email")]=="null"||row[headers.indexOf("email")]=="")?null:row[headers.indexOf("email")],
                    mlob:(row[headers.indexOf("mlob")]=="null"||row[headers.indexOf("mlob")]=="")?null:row[headers.indexOf("mlob")],
                    measureid:measureid?measureid:null,
                    measure:(row[headers.indexOf("measure")]=="null"||row[headers.indexOf("measure")]=="")?null:row[headers.indexOf("measure")],
                    ins_pcp_id:(row[headers.indexOf("ins_pcp_id")]=="null"||row[headers.indexOf("ins_pcp_id")]=="")?null:row[headers.indexOf("ins_pcp_id")],
                    dos:(typeof row[headers.indexOf("dos")] == "undefined" || row[headers.indexOf("dos")]=="null"||row[headers.indexOf("dos")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("dos")]),
                    value1:(row[headers.indexOf("value1")]=="null"||row[headers.indexOf("value1")]=="")?null:row[headers.indexOf("value1")],
                    value2:(row[headers.indexOf("value2")]=="null"||row[headers.indexOf("value2")]=="")?null:row[headers.indexOf("value2")],
                    cpt1:(row[headers.indexOf("cpt1")]=="null"||row[headers.indexOf("cpt1")]=="")?null:row[headers.indexOf("cpt1")],
                    cpt2:(row[headers.indexOf("cpt2")]=="null"||row[headers.indexOf("cpt2")]=="")?null:row[headers.indexOf("cpt2")],
                    icd1:(row[headers.indexOf("icd1")]=="null"||row[headers.indexOf("icd1")]=="")?null:row[headers.indexOf("icd1")],
                    icd2:(row[headers.indexOf("icd2")]=="null"||row[headers.indexOf("icd2")]=="")?null:row[headers.indexOf("icd2")],
                    icdv1:(row[headers.indexOf("icdv1")]=="null"||row[headers.indexOf("icdv1")]=="")?null:row[headers.indexOf("icdv1")],
                    icdv2:(row[headers.indexOf("icdv2")]=="null"||row[headers.indexOf("icdv2")]=="")?null:row[headers.indexOf("icdv2")],
                    flag:(row[headers.indexOf("flag")]=="null"||row[headers.indexOf("flag")]=="")?0:row[headers.indexOf("flag")],
                    status:(row[headers.indexOf("status")]=="null"||row[headers.indexOf("status")]=="")?0:row[headers.indexOf("status")],
                    gstatus:(row[headers.indexOf("gstatus")]=="null"||row[headers.indexOf("gstatus")]=="")?0:row[headers.indexOf("gstatus")],
                    rstatus:(row[headers.indexOf("rstatus")]=="null"||row[headers.indexOf("rstatus")]=="")?0:row[headers.indexOf("rstatus")],
                    hstatus:(row[headers.indexOf("hstatus")]=="null"||row[headers.indexOf("hstatus")]=="")?null:row[headers.indexOf("hstatus")],
                    apptdate:(typeof row[headers.indexOf("apptdate")] == "undefined" || row[headers.indexOf("apptdate")]=="null"||row[headers.indexOf("apptdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("apptdate")]),
                    apptpcp:(row[headers.indexOf("apptpcp")]=="null"||row[headers.indexOf("apptpcp")]=="")?null:row[headers.indexOf("apptpcp")],
                    apptvisit:(row[headers.indexOf("apptvisit")]=="null"||row[headers.indexOf("apptvisit")]=="")?null:row[headers.indexOf("apptvisit")],
                    nextdate:(typeof row[headers.indexOf("nextdate")] == "undefined" || row[headers.indexOf("nextdate")]=="null"||row[headers.indexOf("nextdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("nextdate")]),
                    lastdate:(typeof row[headers.indexOf("lastdate")] == "undefined" || row[headers.indexOf("lastdate")]=="null"||row[headers.indexOf("lastdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("lastdate")]),
                    lastpcp:(row[headers.indexOf("lastpcp")]=="null"||row[headers.indexOf("lastpcp")]=="")?null:row[headers.indexOf("lastpcp")],
                    lastvisit:(row[headers.indexOf("lastvisit")]=="null"||row[headers.indexOf("lastvisit")]=="")?null:row[headers.indexOf("lastvisit")]
                };
                hedisloader.tmpqualityloader(entry, (err, result) => {
                    if (err)
                        console.log(err);
                });
            }
            else{
                entry = {
                    cyear:row[headers.indexOf("cyear")],
                    clinicid:row[headers.indexOf("clinicid")],
                    insid:row[headers.indexOf("insid")],
                    emr_id:(row[headers.indexOf("emr_id")]=="null"||row[headers.indexOf("emr_id")]=="")?null:row[headers.indexOf("emr_id")],
                    mid:(row[headers.indexOf("mid")]=="null"||row[headers.indexOf("mid")]=="")?null:row[headers.indexOf("mid")],
                    ptfname:(row[headers.indexOf("ptfname")]=="null"||row[headers.indexOf("ptfname")]=="")?null:row[headers.indexOf("ptfname")],
                    ptlname:(row[headers.indexOf("ptlname")]=="null"||row[headers.indexOf("ptlname")]=="")?null:row[headers.indexOf("ptlname")],
                    dob:(typeof row[headers.indexOf("dob")] == "undefined" || row[headers.indexOf("dob")]=="null"||row[headers.indexOf("dob")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("dob")]),
                    phone:(row[headers.indexOf("phone")]=="null"||row[headers.indexOf("phone")]=="")?null:row[headers.indexOf("phone")],
                    email:(row[headers.indexOf("email")]=="null"||row[headers.indexOf("email")]=="")?null:row[headers.indexOf("email")],
                    mlob:(row[headers.indexOf("mlob")]=="null"||row[headers.indexOf("mlob")]=="")?null:row[headers.indexOf("mlob")],
                    measureid:null,
                    measure:(row[headers.indexOf("measure")]=="null"||row[headers.indexOf("measure")]=="")?null:row[headers.indexOf("measure")],
                    ins_pcp_id:(row[headers.indexOf("ins_pcp_id")]=="null"||row[headers.indexOf("ins_pcp_id")]=="")?null:row[headers.indexOf("ins_pcp_id")],
                    dos:(typeof row[headers.indexOf("dos")] == "undefined" || row[headers.indexOf("dos")]=="null"||row[headers.indexOf("dos")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("dos")]),
                    value1:(row[headers.indexOf("value1")]=="null"||row[headers.indexOf("value1")]=="")?null:row[headers.indexOf("value1")],
                    value2:(row[headers.indexOf("value2")]=="null"||row[headers.indexOf("value2")]=="")?null:row[headers.indexOf("value2")],
                    cpt1:(row[headers.indexOf("cpt1")]=="null"||row[headers.indexOf("cpt1")]=="")?null:row[headers.indexOf("cpt1")],
                    cpt2:(row[headers.indexOf("cpt2")]=="null"||row[headers.indexOf("cpt2")]=="")?null:row[headers.indexOf("cpt2")],
                    icd1:(row[headers.indexOf("icd1")]=="null"||row[headers.indexOf("icd1")]=="")?null:row[headers.indexOf("icd1")],
                    icd2:(row[headers.indexOf("icd2")]=="null"||row[headers.indexOf("icd2")]=="")?null:row[headers.indexOf("icd2")],
                    icdv1:(row[headers.indexOf("icdv1")]=="null"||row[headers.indexOf("icdv1")]=="")?null:row[headers.indexOf("icdv1")],
                    icdv2:(row[headers.indexOf("icdv2")]=="null"||row[headers.indexOf("icdv2")]=="")?null:row[headers.indexOf("icdv2")],
                    flag:(row[headers.indexOf("flag")]=="null"||row[headers.indexOf("flag")]=="")?0:row[headers.indexOf("flag")],
                    status:(row[headers.indexOf("status")]=="null"||row[headers.indexOf("status")]=="")?0:row[headers.indexOf("status")],
                    gstatus:(row[headers.indexOf("gstatus")]=="null"||row[headers.indexOf("gstatus")]=="")?0:row[headers.indexOf("gstatus")],
                    rstatus:(row[headers.indexOf("rstatus")]=="null"||row[headers.indexOf("rstatus")]=="")?0:row[headers.indexOf("rstatus")],
                    hstatus:(row[headers.indexOf("hstatus")]=="null"||row[headers.indexOf("hstatus")]=="")?null:row[headers.indexOf("hstatus")],
                    apptdate:(typeof row[headers.indexOf("apptdate")] == "undefined" || row[headers.indexOf("apptdate")]=="null"||row[headers.indexOf("apptdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("apptdate")]),
                    apptpcp:(row[headers.indexOf("apptpcp")]=="null"||row[headers.indexOf("apptpcp")]=="")?null:row[headers.indexOf("apptpcp")],
                    apptvisit:(row[headers.indexOf("apptvisit")]=="null"||row[headers.indexOf("apptvisit")]=="")?null:row[headers.indexOf("apptvisit")],
                    nextdate:(typeof row[headers.indexOf("nextdate")] == "undefined" || row[headers.indexOf("nextdate")]=="null"||row[headers.indexOf("nextdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("nextdate")]),
                    lastdate:(typeof row[headers.indexOf("lastdate")] == "undefined" || row[headers.indexOf("lastdate")]=="null"||row[headers.indexOf("lastdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("lastdate")]),
                    lastpcp:(row[headers.indexOf("lastpcp")]=="null"||row[headers.indexOf("lastpcp")]=="")?null:row[headers.indexOf("lastpcp")],
                    lastvisit:(row[headers.indexOf("lastvisit")]=="null"||row[headers.indexOf("lastvisit")]=="")?null:row[headers.indexOf("lastvisit")]

                };
                hedisloader.tmpqualityloader(entry, (err, result) => {
                    if (err)
                        console.log(err);
                });
            }
        }
        rowCounter++;
    };
    res.status(200).json({ message: "OK" });
}

exports.deletedata = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        insid: req.body.insid,
        cyear: req.body.cyear,
    }
    hedisloader.deletedata(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.encloader = async (req, res, next) => {
    let cyear = req.body.cyear;
    let clinicid = req.body.clinicid;
    let userid = req.body.userid;
    let filePath = req.files[0].path;
    let pureSheet = [];
    // Parse a file
    const workSheetsFromFile = xlsx.parse(filePath);
    pureSheet = workSheetsFromFile[0].data;
    let headers = pureSheet[0];
    let result = await hedisloader.getchosenclinic(clinicid);
    let rowCounter = 0;
    let newCounter = 0;
    
    for (row of pureSheet) {
        if (rowCounter != 0) {
            let entry = [];
            if(result[0]['apcheck'] == 1){
                entry = {
                    cyear:cyear,
                    userid:userid,
                    clinicid:clinicid,
                    systollic:row[headers.indexOf("systollic")],
                    diastollic:row[headers.indexOf("diastollic")],
                    INS_N:row[headers.indexOf("INS_N")],
                    MedVerf:row[headers.indexOf("MedVerf")],
                    ENC_STATUS:row[headers.indexOf("ENC_STATUS")],
                    ENC_VISIT_TYPE:row[headers.indexOf("ENC_VISIT_TYPE")],
                    patientId:row[headers.indexOf("patientId")],
                    DOB:(row[headers.indexOf("DOB")]==null||row[headers.indexOf("DOB")]=="")?null:(ExcelDateToJSDate(row[headers.indexOf("DOB")])=="NaN-NaN-NaN"?null:ExcelDateToJSDate(row[headers.indexOf("DOB")])),
                    doctorid:row[headers.indexOf("doctorid")],
                    facilityid:row[headers.indexOf("facilityid")],
                    encounterid:row[headers.indexOf("encounterid")],
                    enctype:row[headers.indexOf("enctype")],
                    ICD_CODE:row[headers.indexOf("ICD_CODE")],
                    ICD_DESC:row[headers.indexOf("ICD_DESC")],
                    PainScale:row[headers.indexOf("PainScale")],
                    AdultCare:row[headers.indexOf("AdultCare")],
                    Advalue:row[headers.indexOf("Advalue")],
                    BP:row[headers.indexOf("BP")],
                    date:(row[headers.indexOf("date")]==null||row[headers.indexOf("date")]=="")?null:(ExcelDateToJSDate(row[headers.indexOf("date")])=="NaN-NaN-NaN"?null:ExcelDateToJSDate(row[headers.indexOf("date")])),
                };
            }
            else{
                entry = {
                    cyear:cyear,
                    userid:userid,
                    clinicid:clinicid,
                    systollic:row[headers.indexOf("systollic")],
                    diastollic:row[headers.indexOf("diastollic")],
                    INS_N:row[headers.indexOf("INS_N")],
                    MedVerf:row[headers.indexOf("MedVerf")],
                    ENC_STATUS:row[headers.indexOf("ENC_STATUS")],
                    ENC_VISIT_TYPE:row[headers.indexOf("ENC_VISIT_TYPE")],
                    patientId:row[headers.indexOf("patientId")],
                    DOB:(row[headers.indexOf("DOB")]==null||row[headers.indexOf("DOB")]=="")?null:(ExcelDateToJSDate(row[headers.indexOf("DOB")])=="NaN-NaN-NaN"?null:ExcelDateToJSDate(row[headers.indexOf("DOB")])),
                    doctorid:row[headers.indexOf("doctorid")],
                    facilityid:row[headers.indexOf("facilityid")],
                    encounterid:row[headers.indexOf("encounterid")],
                    enctype:row[headers.indexOf("enctype")],
                    ICD_CODE:row[headers.indexOf("ICD_CODE")],
                    ICD_DESC:row[headers.indexOf("ICD_DESC")],
                    PainScale:row[headers.indexOf("PainScale")],
                    BMI:row[headers.indexOf("BMI")],
                    BMI_PER:row[headers.indexOf("BMI_PER")],
                    BP:row[headers.indexOf("BP")],
                    date:(row[headers.indexOf("date")]==null||row[headers.indexOf("date")]=="")?null:(ExcelDateToJSDate(row[headers.indexOf("date")])=="NaN-NaN-NaN"?null:ExcelDateToJSDate(row[headers.indexOf("date")])),
                };
            }
            hedisloader.encloader(entry, () => {});
            hedisloader.vitalloader(entry, () => {});
            hedisloader.hedistrackloader(entry, () => {});
            newCounter++;
        }
        rowCounter++;
    };
    await hedisloader.getencs(clinicid, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: newCounter });
        }
    });
}
exports.labloader = async (req, res, next) => {
    let cyear = req.body.cyear;
    let clinicid = req.body.clinicid;
    let userid = req.body.userid;
    let filePath = req.files[0].path;
    let pureSheet = [];
    // Parse a file
    const workSheetsFromFile = xlsx.parse(filePath);
    pureSheet = workSheetsFromFile[0].data;
    let headers = pureSheet[0];
    let newCounter = 0;
    let rowCounter = 0;
    let tmpdup = [];
    for (row of pureSheet) {
        if (rowCounter != 0) {
            let entry = [];
            if(!tmpdup.includes(row[headers.indexOf("RId_HL7")]+"-"+row[headers.indexOf("Lab_D_Encounter")]+"-"+row[headers.indexOf("patientId")])){
                entry = {
                    cyear:cyear,
                    userid:userid,
                    clinicid:clinicid,
                    insuranceName:row[headers.indexOf("insuranceName")],
                    insid:row[headers.indexOf("insid")],
                    SUBID:row[headers.indexOf("SUBID")],
                    VISIT_TYPE:row[headers.indexOf("VISIT_TYPE")],
                    patientId:row[headers.indexOf("patientId")],
                    doctorid:row[headers.indexOf("doctorid")],
                    enctype:row[headers.indexOf("enctype")],
                    Lab_D_Encounter:row[headers.indexOf("Lab_D_Encounter")],
                    RId_HL7:row[headers.indexOf("RId_HL7")],
                    LAB_testName:row[headers.indexOf("LAB_testName")],
                    name_HL7:row[headers.indexOf("name_HL7")],
                    value_HL7:row[headers.indexOf("value_HL7")],
                    units_HL7:row[headers.indexOf("units_HL7")],
                    range_HL7:row[headers.indexOf("range_HL7")],
                    date:(row[headers.indexOf("Lab_ResultDate")]==null||row[headers.indexOf("Lab_ResultDate")]=="")?null:(ExcelDateToJSDate(row[headers.indexOf("Lab_ResultDate")])=="NaN-NaN-NaN"?null:ExcelDateToJSDate(row[headers.indexOf("Lab_ResultDate")])),
                };
                hedisloader.labloader(entry, () => {});
                hedisloader.labtrackloader(entry, () => {});
                newCounter++;
                tmpdup.push(row[headers.indexOf("RId_HL7")]+"-"+row[headers.indexOf("Lab_D_Encounter")]+"-"+row[headers.indexOf("patientId")])
            }
        }
        rowCounter++;
    };
    await hedisloader.getlabs(clinicid, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: newCounter });
        }
    });
}
exports.vaccineloader = async (req, res, next) => {
    let cyear = req.body.cyear;
    let clinicid = req.body.clinicid;
    let userid = req.body.userid;
    let filePath = req.files[0].path;
    let pureSheet = [];
    // Parse a file
    const workSheetsFromFile = xlsx.parse(filePath);
    pureSheet = workSheetsFromFile[0].data;
    let headers = pureSheet[0];
    let rowCounter = 0;
    let newCounter = 0;

    let vaccinegroup = await hedisloader.getvaccinegroup();
    var tmpgroup = [];
    for(var i=0;i < vaccinegroup.length;i++){
        tmpgroup.push(vaccinegroup[i]['cptcode']);
    }
    for (row of pureSheet) {
        if (rowCounter != 0) {
            let entry = [];
            entry = {
                cyear:cyear,
                userid:userid,
                clinicid:clinicid,
                encounterID:row[headers.indexOf("encounterID")],
                patientID:row[headers.indexOf("patientID")],
                doctorID:row[headers.indexOf("doctorID")],
                VisitType:row[headers.indexOf("VisitType")],
                VAC_ID:row[headers.indexOf("VAC_ID")],
                cvx_code:row[headers.indexOf("cvx_code")],
                vaccinename:row[headers.indexOf("vaccinename")],
                V_GIVEN:row[headers.indexOf("V_GIVEN")],
                CPT:row[headers.indexOf("CPT")],
                ICD:row[headers.indexOf("ICD")],
                ICD_DESC:row[headers.indexOf("ICD_DESC")],
                icd1:row[headers.indexOf("icd1")],
                DOB:(row[headers.indexOf("DOB")]==null||row[headers.indexOf("DOB")]=="")?null:(ExcelDateToJSDate(row[headers.indexOf("DOB")])=="NaN-NaN-NaN"?null:ExcelDateToJSDate(row[headers.indexOf("DOB")])),
                date:(row[headers.indexOf("date")]==null||row[headers.indexOf("date")]=="")?null:(ExcelDateToJSDate(row[headers.indexOf("date")])=="NaN-NaN-NaN"?null:ExcelDateToJSDate(row[headers.indexOf("date")])),
            };
            hedisloader.vaccineloader(entry, () => {});
            hedisloader.vaccinetrackloader(entry,tmpgroup, () => {});
            newCounter++;
        }
        rowCounter++;
    };
    await hedisloader.getvaccines(clinicid, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: newCounter });
        }
    });
}
exports.prevnextloader = async (req, res, next) => {
    let cyear = req.body.cyear;
    let clinicid = req.body.clinicid;
    let userid = req.body.userid;
    let filePath = req.files[0].path;
    let pureSheet = [];
    // Parse a file
    const workSheetsFromFile = xlsx.parse(filePath);
    pureSheet = workSheetsFromFile[0].data;
    let headers = pureSheet[0];
    let rowCounter = 0;
    let newCounter = 0;
    let patients = await hedisloader.getpatientsbyclinic(clinicid);
    var tmppatients = [];
    for(var i = 0;i < patients.length;i++){
        tmppatients.push(patients[i]['emr_id']);
    }
    for (row of pureSheet) {
        if (rowCounter != 0) {
            let entry = [];
            if(tmppatients.includes(row[headers.indexOf("patientid")])){
                entry = {
                    cyear:cyear,
                    userid:userid,
                    clinicid:clinicid,
                    patientid:row[headers.indexOf("patientid")],
                    PrevApptPCP:row[headers.indexOf("PrevApptPCP")],
                    PrevApptVType:row[headers.indexOf("PrevApptVType")],
                    PrevApptDate:(row[headers.indexOf("PrevApptDate")]==null||row[headers.indexOf("PrevApptDate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("PrevApptDate")]),
                    NxtApptPCP:row[headers.indexOf("NxtApptPCP")],
                    NxtApptVType:row[headers.indexOf("NxtApptVType")],
                    NxtApptDate:(row[headers.indexOf("NxtApptDate")]==null||row[headers.indexOf("NxtApptDate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("NxtApptDate")]),
                    insid:row[headers.indexOf("insid")],
                    insuranceName:row[headers.indexOf("insuranceName")],
                    subscriberno:row[headers.indexOf("subscriberno")]
                };
                hedisloader.updateprevnext(entry, () => {});
                newCounter++;
            }
        }
        rowCounter++;
    };
    await hedisloader.getprevandnext(clinicid, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: newCounter });
        }
    });
}
exports.getbackup = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        insuranceid: req.body.insuranceid
    }
    hedisloader.getbackup(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletebackup = async (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    let backup = await hedisloader.chosenbackup(entry.id);
    if(backup.length>0){
        hedisloader.deletebackup(entry, (err, result) => {
            if (err) {
                res.status(404).json(err);
            } else {
                fs.unlink(hedis_backup_path+backup[0]['filename'], function (err) {
                    if (err) throw err;
                });
                res.status(200).json({ data: result });
            }
        });
    }
  
}

exports.checkhedisdata = async (req, res, next) => {
    let checkhedisdata = await hedisloader.checkhedisdata(req.body.id,req.body.insid);
    res.status(200).json({ data: checkhedisdata[0]['total'] });
}
exports.backuphedis = async (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    let result = await hedisloader.chosenbackup(entry.id);
    let checkhedisdata = await hedisloader.checkhedisdata(result[0]['clinicid'],result[0]['insid']);
    if(checkhedisdata[0]['total'] > 0){
        res.status(200).json({ message: "existed" });
    }
    else{
        let filePath = hedis_backup_path+result[0]['filename'];
        let pureSheet = [];
        // Parse a file
        const workSheetsFromFile = xlsx.parse(filePath);
        pureSheet = workSheetsFromFile[0].data;
        let headers = pureSheet[0];
        let rowCounter = 0;
        for (row of pureSheet) {
            if (rowCounter != 0) {
                measures = await hedisloader.getmeasure(row[headers.indexOf("measureid")]);
                if(measures.length > 0){
                    measureid = measures[0]['id'];
                    entry = {
                        cyear:row[headers.indexOf("cyear")],
                        clinicid:row[headers.indexOf("clinicid")],
                        insid:row[headers.indexOf("insid")],
                        emr_id:(row[headers.indexOf("emr_id")]=="null"||row[headers.indexOf("emr_id")]=="")?null:row[headers.indexOf("emr_id")],
                        mid:(row[headers.indexOf("mid")]=="null"||row[headers.indexOf("mid")]=="")?null:row[headers.indexOf("mid")],
                        ptfname:(row[headers.indexOf("ptfname")]=="null"||row[headers.indexOf("ptfname")]=="")?null:row[headers.indexOf("ptfname")],
                        ptlname:(row[headers.indexOf("ptlname")]=="null"||row[headers.indexOf("ptlname")]=="")?null:row[headers.indexOf("ptlname")],
                        dob:(typeof row[headers.indexOf("dob")] == "undefined" || row[headers.indexOf("dob")]=="null"||row[headers.indexOf("dob")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("dob")]),
                        phone:(row[headers.indexOf("phone")]=="null"||row[headers.indexOf("phone")]=="")?null:row[headers.indexOf("phone")],
                        email:(row[headers.indexOf("email")]=="null"||row[headers.indexOf("email")]=="")?null:row[headers.indexOf("email")],
                        mlob:(row[headers.indexOf("mlob")]=="null"||row[headers.indexOf("mlob")]=="")?null:row[headers.indexOf("mlob")],
                        measureid:measureid?measureid:null,
                        measure:(row[headers.indexOf("measure")]=="null"||row[headers.indexOf("measure")]=="")?null:row[headers.indexOf("measure")],
                        ins_pcp_id:(row[headers.indexOf("ins_pcp_id")]=="null"||row[headers.indexOf("ins_pcp_id")]=="")?null:row[headers.indexOf("ins_pcp_id")],
                        dos:(typeof row[headers.indexOf("dos")] == "undefined" || row[headers.indexOf("dos")]=="null"||row[headers.indexOf("dos")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("dos")]),
                        value1:(row[headers.indexOf("value1")]=="null"||row[headers.indexOf("value1")]=="")?null:row[headers.indexOf("value1")],
                        value2:(row[headers.indexOf("value2")]=="null"||row[headers.indexOf("value2")]=="")?null:row[headers.indexOf("value2")],
                        cpt1:(row[headers.indexOf("cpt1")]=="null"||row[headers.indexOf("cpt1")]=="")?null:row[headers.indexOf("cpt1")],
                        cpt2:(row[headers.indexOf("cpt2")]=="null"||row[headers.indexOf("cpt2")]=="")?null:row[headers.indexOf("cpt2")],
                        icd1:(row[headers.indexOf("icd1")]=="null"||row[headers.indexOf("icd1")]=="")?null:row[headers.indexOf("icd1")],
                        icd2:(row[headers.indexOf("icd2")]=="null"||row[headers.indexOf("icd2")]=="")?null:row[headers.indexOf("icd2")],
                        icdv1:(row[headers.indexOf("icdv1")]=="null"||row[headers.indexOf("icdv1")]=="")?null:row[headers.indexOf("icdv1")],
                        icdv2:(row[headers.indexOf("icdv2")]=="null"||row[headers.indexOf("icdv2")]=="")?null:row[headers.indexOf("icdv2")],
                        flag:(row[headers.indexOf("flag")]=="null"||row[headers.indexOf("flag")]=="")?0:row[headers.indexOf("flag")],
                        status:(row[headers.indexOf("status")]=="null"||row[headers.indexOf("status")]=="")?0:row[headers.indexOf("status")],
                        gstatus:(row[headers.indexOf("gstatus")]=="null"||row[headers.indexOf("gstatus")]=="")?0:row[headers.indexOf("gstatus")],
                        rstatus:(row[headers.indexOf("rstatus")]=="null"||row[headers.indexOf("rstatus")]=="")?0:row[headers.indexOf("rstatus")],
                        hstatus:(row[headers.indexOf("hstatus")]=="null"||row[headers.indexOf("hstatus")]=="")?null:row[headers.indexOf("hstatus")],
                        apptdate:(typeof row[headers.indexOf("apptdate")] == "undefined" || row[headers.indexOf("apptdate")]=="null"||row[headers.indexOf("apptdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("apptdate")]),
                        apptpcp:(row[headers.indexOf("apptpcp")]=="null"||row[headers.indexOf("apptpcp")]=="")?null:row[headers.indexOf("apptpcp")],
                        apptvisit:(row[headers.indexOf("apptvisit")]=="null"||row[headers.indexOf("apptvisit")]=="")?null:row[headers.indexOf("apptvisit")],
                        nextdate:(typeof row[headers.indexOf("nextdate")] == "undefined" || row[headers.indexOf("nextdate")]=="null"||row[headers.indexOf("nextdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("nextdate")]),
                        lastdate:(typeof row[headers.indexOf("lastdate")] == "undefined" || row[headers.indexOf("lastdate")]=="null"||row[headers.indexOf("lastdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("lastdate")]),
                        lastpcp:(row[headers.indexOf("lastpcp")]=="null"||row[headers.indexOf("lastpcp")]=="")?null:row[headers.indexOf("lastpcp")],
                        lastvisit:(row[headers.indexOf("lastvisit")]=="null"||row[headers.indexOf("lastvisit")]=="")?null:row[headers.indexOf("lastvisit")]
                    };
                    hedisloader.tmpqualityloader(entry, (err, result) => {
                        if (err)
                            console.log(err);
                    });
                }
                else{
                    entry = {
                        cyear:row[headers.indexOf("cyear")],
                        clinicid:row[headers.indexOf("clinicid")],
                        insid:row[headers.indexOf("insid")],
                        emr_id:(row[headers.indexOf("emr_id")]=="null"||row[headers.indexOf("emr_id")]=="")?null:row[headers.indexOf("emr_id")],
                        mid:(row[headers.indexOf("mid")]=="null"||row[headers.indexOf("mid")]=="")?null:row[headers.indexOf("mid")],
                        ptfname:(row[headers.indexOf("ptfname")]=="null"||row[headers.indexOf("ptfname")]=="")?null:row[headers.indexOf("ptfname")],
                        ptlname:(row[headers.indexOf("ptlname")]=="null"||row[headers.indexOf("ptlname")]=="")?null:row[headers.indexOf("ptlname")],
                        dob:(typeof row[headers.indexOf("dob")] == "undefined" || row[headers.indexOf("dob")]=="null"||row[headers.indexOf("dob")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("dob")]),
                        phone:(row[headers.indexOf("phone")]=="null"||row[headers.indexOf("phone")]=="")?null:row[headers.indexOf("phone")],
                        email:(row[headers.indexOf("email")]=="null"||row[headers.indexOf("email")]=="")?null:row[headers.indexOf("email")],
                        mlob:(row[headers.indexOf("mlob")]=="null"||row[headers.indexOf("mlob")]=="")?null:row[headers.indexOf("mlob")],
                        measureid:null,
                        measure:(row[headers.indexOf("measure")]=="null"||row[headers.indexOf("measure")]=="")?null:row[headers.indexOf("measure")],
                        ins_pcp_id:(row[headers.indexOf("ins_pcp_id")]=="null"||row[headers.indexOf("ins_pcp_id")]=="")?null:row[headers.indexOf("ins_pcp_id")],
                        dos:(typeof row[headers.indexOf("dos")] == "undefined" || row[headers.indexOf("dos")]=="null"||row[headers.indexOf("dos")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("dos")]),
                        value1:(row[headers.indexOf("value1")]=="null"||row[headers.indexOf("value1")]=="")?null:row[headers.indexOf("value1")],
                        value2:(row[headers.indexOf("value2")]=="null"||row[headers.indexOf("value2")]=="")?null:row[headers.indexOf("value2")],
                        cpt1:(row[headers.indexOf("cpt1")]=="null"||row[headers.indexOf("cpt1")]=="")?null:row[headers.indexOf("cpt1")],
                        cpt2:(row[headers.indexOf("cpt2")]=="null"||row[headers.indexOf("cpt2")]=="")?null:row[headers.indexOf("cpt2")],
                        icd1:(row[headers.indexOf("icd1")]=="null"||row[headers.indexOf("icd1")]=="")?null:row[headers.indexOf("icd1")],
                        icd2:(row[headers.indexOf("icd2")]=="null"||row[headers.indexOf("icd2")]=="")?null:row[headers.indexOf("icd2")],
                        icdv1:(row[headers.indexOf("icdv1")]=="null"||row[headers.indexOf("icdv1")]=="")?null:row[headers.indexOf("icdv1")],
                        icdv2:(row[headers.indexOf("icdv2")]=="null"||row[headers.indexOf("icdv2")]=="")?null:row[headers.indexOf("icdv2")],
                        flag:(row[headers.indexOf("flag")]=="null"||row[headers.indexOf("flag")]=="")?0:row[headers.indexOf("flag")],
                        status:(row[headers.indexOf("status")]=="null"||row[headers.indexOf("status")]=="")?0:row[headers.indexOf("status")],
                        gstatus:(row[headers.indexOf("gstatus")]=="null"||row[headers.indexOf("gstatus")]=="")?0:row[headers.indexOf("gstatus")],
                        rstatus:(row[headers.indexOf("rstatus")]=="null"||row[headers.indexOf("rstatus")]=="")?0:row[headers.indexOf("rstatus")],
                        hstatus:(row[headers.indexOf("hstatus")]=="null"||row[headers.indexOf("hstatus")]=="")?null:row[headers.indexOf("hstatus")],
                        apptdate:(typeof row[headers.indexOf("apptdate")] == "undefined" || row[headers.indexOf("apptdate")]=="null"||row[headers.indexOf("apptdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("apptdate")]),
                        apptpcp:(row[headers.indexOf("apptpcp")]=="null"||row[headers.indexOf("apptpcp")]=="")?null:row[headers.indexOf("apptpcp")],
                        apptvisit:(row[headers.indexOf("apptvisit")]=="null"||row[headers.indexOf("apptvisit")]=="")?null:row[headers.indexOf("apptvisit")],
                        nextdate:(typeof row[headers.indexOf("nextdate")] == "undefined" || row[headers.indexOf("nextdate")]=="null"||row[headers.indexOf("nextdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("nextdate")]),
                        lastdate:(typeof row[headers.indexOf("lastdate")] == "undefined" || row[headers.indexOf("lastdate")]=="null"||row[headers.indexOf("lastdate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("lastdate")]),
                        lastpcp:(row[headers.indexOf("lastpcp")]=="null"||row[headers.indexOf("lastpcp")]=="")?null:row[headers.indexOf("lastpcp")],
                        lastvisit:(row[headers.indexOf("lastvisit")]=="null"||row[headers.indexOf("lastvisit")]=="")?null:row[headers.indexOf("lastvisit")]

                    };
                    hedisloader.tmpqualityloader(entry, (err, result) => {
                        if (err)
                            console.log(err);
                    });
                }
            }
            rowCounter++;
        };
        res.status(200).json({ message: "OK" });
    }
}
exports.backupdatafromhedis = async (req, res, next) => {
    let cyear = req.body.cyear;
    let clinicid = req.body.clinicid;
    let insid = req.body.insid;
    let currentData = await hedisloader.getcurrentData(clinicid,insid,cyear);
    for(var i = 0;i < currentData.length;i++){
        currentData[i]['dob'] = DateFormat(new Date(currentData[i]['dob']));
        currentData[i]['dos'] = currentData[i]['dos'] != null?DateFormat(new Date(currentData[i]['dos'])):"";
        currentData[i]['apptdate'] = currentData[i]['apptdate'] != null?DateFormat(new Date(currentData[i]['apptdate'])):"";
        currentData[i]['lastdate'] = currentData[i]['lastdate'] != null?DateFormat(new Date(currentData[i]['lastdate'])):"";
    }
    var filename = "backup-"+clinicid+"-"+insid+"-"+new Date().getTime()+'.csv';
    if(currentData.length>0){
        await hedisloader.backuphedis(clinicid, insid, filename, currentData.length);
        converter.json2csv(currentData, (err, csv) => {
            if (err) {
                throw err;
            }
            // write CSV to a file
            fs.writeFileSync(hedis_backup_path+filename, csv);
        });
    }
    res.status(200).json({ message: "OK" });
    
}
