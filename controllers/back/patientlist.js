const xlsx = require('node-xlsx');
const patientlist = require('../../repositories/back/patientlist');
const event = require('../../repositories/back/event');
const Acl = require('../../middleware/acl');

var nodemailer = require('nodemailer');
const Excel = require('exceljs');
var fs = require('fs');
const config = require('../../config');
var striptags = require('striptags');
let ejs = require("ejs");
let path = require("path");
var mail = nodemailer.createTransport({
    host: config.emailaccess.host,
    port: config.emailaccess.port,
    secure: false,
    auth: {
        user: config.emailaccess.user,
        pass: config.emailaccess.password,
    }
});
var twilio = require('twilio')(
    config.twilio.TWILIO_ACCOUNT_SID,
    config.twilio.TWILIO_AUTH_TOKEN
  );
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
exports.ptloader = async (req, res, next) => {
    let clinicid = req.body.clinicid;
    let userid = req.body.userid;
    let pts = await patientlist.getpts(clinicid);
    await patientlist.setflagpts(clinicid);
    var tmppts = [];
    for(var  i = 0; i < pts.length;i++){
        tmppts.push(pts[i]['patientid']);
    }
    let filePath = req.files[0].path;
    let pureSheet = [];
    // Parse a file
    const workSheetsFromFile = xlsx.parse(filePath);
    pureSheet = workSheetsFromFile[0].data;
    let headers = pureSheet[0];
    let rowCounter = 0;
    if(pureSheet.length<1)return;
    let entry = {
        user_id: userid,
        clinic_id: clinicid,
        type_id: 11, //Patient Record
        subtype_id: 38, //create
        outcome_id: 5, //'success',
        action_id: 1, //'Create',
        description: 'Loaded patients from csv-file'
    }
    var event_result = await event.logger(entry);
    var pt_ids = "";
    for (row of pureSheet) {
        
        if (rowCounter != 0) {
            let entry = [];
            if(!tmppts.includes(row[headers.indexOf("uid")])){
                entry = {
                    clinicid:clinicid,
                    uid:row[headers.indexOf("uid")],
                    ufname:row[headers.indexOf("ufname")],
                    uminitial:row[headers.indexOf("uminitial")],
                    ulname:row[headers.indexOf("ulname")],
                    upPhone:row[headers.indexOf("upPhone")],
                    umobileno:row[headers.indexOf("umobileno")],
                    uemail:row[headers.indexOf("uemail")],
                    upaddress:row[headers.indexOf("upaddress")],
                    upcity:row[headers.indexOf("upcity")],
                    zipcode:row[headers.indexOf("zipcode")],
                    upstate:row[headers.indexOf("upstate")],
                    sex:row[headers.indexOf("sex")],
                    Age:row[headers.indexOf("Age")],
                    language:row[headers.indexOf("language")],
                    ethnicity:row[headers.indexOf("ethnicity")],
                    race:row[headers.indexOf("race")],
                    deceased:row[headers.indexOf("deceased")],
                    deceasedDate:(row[headers.indexOf("deceasedDate")]==null||row[headers.indexOf("deceasedDate")]=="")?null:(ExcelDateToJSDate(row[headers.indexOf("deceasedDate")])=="NaN-NaN-NaN"?null:ExcelDateToJSDate(row[headers.indexOf("deceasedDate")])),
                    DOB:(row[headers.indexOf("DOB")]==null||row[headers.indexOf("DOB")]=="")?null:(ExcelDateToJSDate(row[headers.indexOf("DOB")])=="NaN-NaN-NaN"?null:ExcelDateToJSDate(row[headers.indexOf("DOB")])),
                    event_id:event_result['insertId'],
                    marital:1,
                };
                var result = await patientlist.ptloader(entry);
                if(pt_ids != "")pt_ids += ",";
                pt_ids += result['insertId'];
                
            }   
        }
        rowCounter++;
    };
    var load_count = pt_ids.split(',').length;
    if(pt_ids=="")load_count = "0";
    entry = {
        id: event_result['insertId'],
        model_name: 'patient_list',
        model_id: pt_ids,
        description: 'Loaded '+load_count+' patients from csv-file'
    }
    event.update(entry);
    entry = {
        clinicid: req.body.clinicid,
    }
    patientlist.getTotal(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            result[0]['updated'] = load_count;
            res.status(200).json({ data: result });
        }
    });
}

exports.getData = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'PATIENT_INFO');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        clinicid: req.body.clinicid,
        flag: req.body.flag,
    }
    patientlist.getData(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getDataByPage = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'PATIENT_INFO');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        clinicid: req.body.clinicid,
        page: req.body.page?req.body.page:1,
        size: req.body.size?req.body.size:10,
        flag: req.body.flag,
        text: req.body.searchText
    }
    patientlist.getDataByPage(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getTotal = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    patientlist.getTotal(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getLanguages = (req, res, next) => {
    let entry = {}
    patientlist.getLanguages(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getRace = (req, res, next) => {
    let entry = {}
    patientlist.getRace(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getEthnicity = (req, res, next) => {
    let entry = {}
    patientlist.getEthnicity(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getMarital = (req, res, next) => {
    let entry = {}
    patientlist.getMarital(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.get = (req, res, next) => {
    patientlist.get(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.search = (req, res, next) => {
    patientlist.search(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}


exports.add = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'PATIENT_INFO');
    if(!can)return res.status(405).json('Not Permission');
    var deceased_at = req.body.deceased_at;
    if(req.body.deceased=="0"){
        deceased_at = ''
    }
    let entry = {
        clinicid: req.body.clinicid,
        fname: req.body.fname,
        mname: req.body.mname,
        lname: req.body.lname,
        emr_id: req.body.emr_id,
        email: req.body.email,
        gender: req.body.gender,
        dob: req.body.dob,
        phone: req.body.phone,
        mobile: req.body.mobile,
        language: req.body.language,
        city: req.body.city,
        address: req.body.address,
        address2: req.body.address2,
        zip: req.body.zip,
        state: req.body.state,
        ethnicity: req.body.ethnicity,
        race: req.body.race,
        marital: req.body.marital,
        deceased: req.body.deceased,
        deceased_at: deceased_at
    }
    patientlist.add(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            entry = {
                user_id: req.body.user_id,
                clinic_id: req.body.clinicid,
                type_id: 11, //Patient Record
                subtype_id: 38, //create
                outcome_id: 5, //'success',
                action_id: 1, //'Create',
                description: 'Added patient',
                patient_id: result.insertId,
                model_name: 'patient_list',
                model_id: result.insertId
            }
            event.logger(entry);
            res.status(200).json({ data: result });
        }
    });
    
}

exports.update = async(req, res, next) => {
    
    var deceased_at = req.body.deceased_at;
    if(req.body.deceased=="0"){
        deceased_at = ''
    }
    let entry = {
        id: req.body.id,
        fname: req.body.fname,
        mname: req.body.mname,
        lname: req.body.lname,
        emr_id: req.body.emr_id,
        email: req.body.email,
        gender: req.body.gender,
        dob: req.body.dob,
        phone: req.body.phone,
        mobile: req.body.mobile,
        language: req.body.language,
        city: req.body.city,
        address: req.body.address,
        address2: req.body.address2,
        zip: req.body.zip,
        state: req.body.state,
        ethnicity: req.body.ethnicity,
        race: req.body.race,
        marital: req.body.marital,
        deceased: req.body.deceased,
        deceased_at: deceased_at
    }
    patientlist.update(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
    
}

exports.setValue = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'PATIENT_INFO');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        key: req.body.key,
        value: req.body.value,
    }
    patientlist.setValue(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            entry = {
                user_id: req.body.user_id,
                clinic_id: req.body.clinicid,
                type_id: 11, //Patient Record
                subtype_id: 31, //Update
                outcome_id: 5, //'success',
                action_id: 3, //'Update',
                description: 'Updated patient [ '+req.body.key+' ]',
                patient_id: req.body.id
            }
            event.logger(entry);
            res.status(200).json({ data: result });
        }
    });
}

exports.delete = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    patientlist.delete(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}