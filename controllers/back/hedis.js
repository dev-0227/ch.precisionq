const hedis = require('../../repositories/back/hedis');
const Excel = require('exceljs');
const pdf = require("html-pdf");
let ejs = require("ejs");
let path = require("path");
var fs = require('fs');
var striptags = require('striptags');
var nodemailer = require('nodemailer');
const config = require('../../config');
const stripe = require('stripe')(config.stripe.skey);
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
function generateString(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
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
function DateFormatString(serial) {
    let year = serial.getFullYear();
    let month = serial.getMonth() + 1;
    let dt = serial.getDate();
  
    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return year+month+dt;
  }
function smscountsFor(amount,price){
    return Math.floor(parseFloat(parseInt(amount)-parseInt(amount)*2.9/100-0.3)*100/price);
}
exports.getPCP = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let PCPID = await hedis.getPCPID(entry);
    let users = await hedis.getUsers(entry);
    if(PCPID.length > 0){
        var pcpid = PCPID[0]['id'];
    }
    else{
        var pcpid = 0;
    }
    var tmppcp = [];
    for(var i = 0;i < users.length;i++){
        var tmp = users[i]['mp_check'].split(",");
        if(tmp.includes(pcpid.toString())){
            tmppcp.push(users[i]);
        }
    }
    res.status(200).json({ data: tmppcp });
}
exports.getinsheislist = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
    }
    hedis.getinsheislist(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getavailabledaily = (req, res, next) => {
    let entry = {
        userid: req.body.userid,
    }
    hedis.getavailabledaily(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            if(result.length > 0)
                res.status(200).json({ data: "success" });
            else
                res.status(200).json({ data: "failed" });
        }
    });
}
exports.getavailablencompliant = (req, res, next) => {
    let entry = {
        userid: req.body.userid,
    }
    hedis.getavailablencompliant(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            if(result.length > 0)
                res.status(200).json({ data: "success" });
            else
                res.status(200).json({ data: "failed" });
        }
    });
}
exports.getData = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
        insid: req.body.insid,
        options: req.body.options,
        optioncheck: req.body.optioncheck,
    }
    let tmparray = [];
    if(entry.optioncheck == 3){
        tmparray = ["4"];
    }
    else if(entry.optioncheck == 4){
        if(entry.options.includes("-1")){
            tmparray = entry.options.concat(["1","2","3"]);
            const index = tmparray.indexOf("-1");
            if (index > -1) {
                tmparray.splice(index, 1);
            }
        }
        else{
            tmparray = entry.options;
        }
    }
    else if(entry.optioncheck == 5){
        let idarrays = await hedis.getreportlogids(entry.options);
        if(idarrays[0]['idarray'] == null)
            tmparray = ['0'];
        else
            tmparray = idarrays[0]['idarray'].split(",");
    }
    let data = await hedis.getData(entry);
    let ebodata = await hedis.geteboData(entry);
    let a1crange = await hedis.getoutranges(53);
    let bprange = await hedis.getoutranges(48);
    var a1cv1 = a1crange.length > 0?a1crange[0]['v1']:0;
    var a1cv2 = a1crange.length > 0?a1crange[0]['v2']:0;
    var diasv1 = bprange.length > 0?bprange[0]['v1']:0;
    var diasv2 = bprange.length > 0?bprange[0]['v2']:0;
    var systv1 = bprange.length > 0?bprange[1]['v1']:0;
    var systv2 = bprange.length > 0?bprange[1]['v2']:0;
    let multimeasures = await hedis.getmultimeasures();
    var tmpids = "('0'";
    for(var i=0;i<multimeasures.length;i++){
        tmpids += ",'"+multimeasures[i]['id']+"'";
    }
    tmpids += ")";
    let ebodatamulti = await hedis.geteboDataMulti(entry,tmpids);
    let tmpdata = [];
    let tmpptcnt = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
            let tmpmultiarr = ebodatamulti.filter(function (currentElement) {
                return currentElement.Measureid === data[i]['measureid'] && currentElement.PT_EMR_ID === data[i]['emr_id'];
            });
            for(var j = 0;j < tmpmultiarr.length;j++){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(tmpmultiarr[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > tmpmultiarr[j]['date']))){
                        data[i]['dos'] = tmpmultiarr[j]['date'];
                        data[i]['value1'] = tmpmultiarr[j]['Value1'];
                        data[i]['value2'] = tmpmultiarr[j]['Value2'];
                        data[i]['cpt1'] = tmpmultiarr[j]['CPT1'];
                        data[i]['cpt2'] = tmpmultiarr[j]['CPT2'];
                        data[i]['icd1'] = tmpmultiarr[j]['ICD1'];
                        data[i]['icd2'] = tmpmultiarr[j]['ICD2'];
                        data[i]['status'] = 1;
                    }
                    

                    var removeIndex = ebodatamulti.map(function(item) { return item.id; }).indexOf(tmpmultiarr[j]['id']);
                    ebodatamulti.splice(removeIndex, 1);
                    break;
                }
            }
        }
        else{
            for(var j = 0;j < ebodata.length;j++){
                if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                    var tmpcheck = 0;
                    if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(data[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                            data[i]['dos'] = ebodata[j]['date'];
                            data[i]['value1'] = ebodata[j]['Value1'];
                            data[i]['value2'] = ebodata[j]['Value2'];
                            data[i]['cpt1'] = ebodata[j]['CPT1'];
                            data[i]['cpt2'] = ebodata[j]['CPT2'];
                            data[i]['icd1'] = ebodata[j]['ICD1'];
                            data[i]['icd2'] = ebodata[j]['ICD2'];
                            data[i]['status'] = 1;
                        }
                        if(data[i]['measureid'] == 48){
                            if((parseFloat(data[i]['value1']) >= parseFloat(systv1) && parseFloat(data[i]['value1']) <= parseFloat(systv2))||(parseFloat(data[i]['value2']) >= parseFloat(diasv1) && parseFloat(data[i]['value2']) <= parseFloat(diasv2))){
                                data[i]['status'] = 4;
                            }
                        }
                        if(data[i]['measureid'] == 53){
                            if(parseFloat(data[i]['value1']) >= parseFloat(a1cv1) && parseFloat(data[i]['value1']) <= parseFloat(a1cv2)){
                                data[i]['status'] = 4;
                            }
                        }
                        break;
                    }
                }
                
            }
        }
        
        if(entry.optioncheck == 3){
            if(tmparray.includes(data[i]['status']==null?"10000":data[i]['status'].toString())){
                if(entry.options.length == 0||entry.options.includes(data[i]['measure'])){
                    tmpdata.push(data[i]);
                }
            }
        }
        else if(entry.optioncheck == 4){
            if(tmparray.includes(data[i]['status']==null?"10000":data[i]['status'].toString())){
                tmpdata.push(data[i]);
            }
            else if(tmparray.includes("13")&&data[i]['gstatus'] == 1)
                tmpdata.push(data[i]);
            else if(tmparray.includes("9")&&data[i]['rstatus'] == 1)
                tmpdata.push(data[i]);
        }
        else if(entry.optioncheck == 5){
            if(tmparray.includes(data[i]['id'].toString())){
                tmpdata.push(data[i]);
            }
        }
        else{
            if(entry.options.length == 0||entry.options.includes(data[i]['measure'])){
                tmpdata.push(data[i]);
            }
        }
    }
    for(var i = 0;i < tmpdata.length;i++){
        if(!tmpptcnt.includes(tmpdata[i]['mid'])){
            tmpptcnt.push(tmpdata[i]['mid']);
        }
    }
    res.status(200).json({ data: tmpdata,ptcnt:tmpptcnt.length,measurecnt:tmpdata.length});
}
exports.getDaily = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
        cdate: req.body.cdate,
        options: req.body.options,
        optioncheck: req.body.optioncheck,
        weekcheck: req.body.weekcheck,
    }
    let data = await hedis.getDaily(entry);
    let ebodata = await hedis.geteboData(entry);
    let multimeasures = await hedis.getmultimeasures();
    let a1crange = await hedis.getoutranges(53);
    let bprange = await hedis.getoutranges(48);
    var a1cv1 = a1crange.length > 0?a1crange[0]['v1']:0;
    var a1cv2 = a1crange.length > 0?a1crange[0]['v2']:0;
    var diasv1 = bprange.length > 0?bprange[0]['v1']:0;
    var diasv2 = bprange.length > 0?bprange[0]['v2']:0;
    var systv1 = bprange.length > 0?bprange[1]['v1']:0;
    var systv2 = bprange.length > 0?bprange[1]['v2']:0;

    var tmpids = "('0'";
    for(var i=0;i<multimeasures.length;i++){
        tmpids += ",'"+multimeasures[i]['id']+"'";
    }
    tmpids += ")";
    let ebodatamulti = await hedis.geteboDataMulti(entry,tmpids);
    let tmpdata = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
            let tmpmultiarr = ebodatamulti.filter(function (currentElement) {
                return currentElement.Measureid === data[i]['measureid'] && currentElement.PT_EMR_ID === data[i]['emr_id'];
            });
            for(var j = 0;j < tmpmultiarr.length;j++){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(tmpmultiarr[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > tmpmultiarr[j]['date']))){
                        data[i]['dos'] = tmpmultiarr[j]['date'];
                        data[i]['value1'] = tmpmultiarr[j]['Value1'];
                        data[i]['value2'] = tmpmultiarr[j]['Value2'];
                        data[i]['cpt1'] = tmpmultiarr[j]['CPT1'];
                        data[i]['cpt2'] = tmpmultiarr[j]['CPT2'];
                        data[i]['icd1'] = tmpmultiarr[j]['ICD1'];
                        data[i]['icd2'] = tmpmultiarr[j]['ICD2'];
                        data[i]['status'] = 1;
                    }
                    var removeIndex = ebodatamulti.map(function(item) { return item.id; }).indexOf(tmpmultiarr[j]['id']);
                    ebodatamulti.splice(removeIndex, 1);
                    break;
                }
            }
        }
        else{
            for(var j = 0;j < ebodata.length;j++){
                if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                    var tmpcheck = 0;
                    if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(data[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                            data[i]['dos'] = ebodata[j]['date'];
                            data[i]['value1'] = ebodata[j]['Value1'];
                            data[i]['value2'] = ebodata[j]['Value2'];
                            data[i]['cpt1'] = ebodata[j]['CPT1'];
                            data[i]['cpt2'] = ebodata[j]['CPT2'];
                            data[i]['icd1'] = ebodata[j]['ICD1'];
                            data[i]['icd2'] = ebodata[j]['ICD2'];
                            data[i]['status'] = 1;
                        }
                        break;
                    }
                }
            }
        }
        if(data[i]['measureid'] == 48){
            if((parseFloat(data[i]['value1']) >= parseFloat(systv1) && parseFloat(data[i]['value1']) <= parseFloat(systv2))||(parseFloat(data[i]['value2']) >= parseFloat(diasv1) && parseFloat(data[i]['value2']) <= parseFloat(diasv2))){
                data[i]['status'] = 4;
                data[i]['outcome'] = 1;
            }
        }
        if(data[i]['measureid'] == 53){
            if(parseFloat(data[i]['value1']) >= parseFloat(a1cv1) && parseFloat(data[i]['value1']) <= parseFloat(a1cv2)){
                data[i]['status'] = 4;
                data[i]['outcome'] = 1;
            }
        }
        if(data[i]['status'] == 6 ||  data[i]['outcome'] == 1){
            tmpdata.push(data[i]);
        }

        
    }
    res.status(200).json({ data: tmpdata });
}
exports.getNcompliant = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
    }
    let data = await hedis.getNcompliant(entry);
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
        }
    }
    res.status(200).json({ data: data });
}
exports.updateValueBP = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        userid: req.body.userid,
        loginid: req.body.loginid,
        id: req.body.id,
        key: req.body.key,
        value1: req.body.value1,
        value2: req.body.value2,
        insid: req.body.insid,
        measureid: req.body.measureid,
    }
    hedis.updateValueBP(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateValue = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        userid: req.body.userid,
        loginid: req.body.loginid,
        id: req.body.id,
        key: req.body.key,
        value: req.body.value,
        insid: req.body.insid,
        measureid: req.body.measureid,
    }
    hedis.updateValue(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getmactionlog = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        id: req.body.id,
    }
    hedis.getmactionlog(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getractionlog = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        insid: req.body.insid,
    }
    hedis.getractionlog(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateStatus = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        loginid: req.body.loginid,
        userid: req.body.userid,
        id: req.body.id,
        status: req.body.status,
        apptdate: req.body.apptdate,
        nextdate: req.body.nextdate,
        lastdate: req.body.lastdate,
        apptpcp: req.body.apptpcp,
        apptvisittype: req.body.apptvisittype
    }
    hedis.updateStatus(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        }
    });
    hedis.updatehedisactionlog(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        }
    });
    res.status(200).json({ data: "OK" });
}
exports.exportexcel = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
        insid: req.body.insid,
        options: req.body.options.split(","),
        optioncheck: req.body.optioncheck,
    }
    let tmparray = [];
    if(entry.optioncheck == 3){
        tmparray = ["4"];
    }
    else if(entry.optioncheck == 4){
        if(entry.options.includes("-1")){
            tmparray = entry.options.concat(["1","2","3"]);
            const index = tmparray.indexOf("-1");
            if (index > -1) {
                tmparray.splice(index, 1);
            }
        }
        else{
            tmparray = entry.options;
        }
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    let data = await hedis.getData(entry);
    let ebodata = await hedis.geteboData(entry);
    let multimeasures = await hedis.getmultimeasures();
    var tmpids = "('0'";
    for(var i=0;i<multimeasures.length;i++){
        tmpids += ",'"+multimeasures[i]['id']+"'";
    }
    tmpids += ")";
    let ebodatamulti = await hedis.geteboDataMulti(entry,tmpids);
    let tmpdata = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
            let tmpmultiarr = ebodatamulti.filter(function (currentElement) {
                return currentElement.Measureid === data[i]['measureid'] && currentElement.PT_EMR_ID === data[i]['emr_id'];
            });
            for(var j = 0;j < tmpmultiarr.length;j++){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(tmpmultiarr[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > tmpmultiarr[j]['date']))){
                        data[i]['dos'] = tmpmultiarr[j]['date'];
                        data[i]['value1'] = tmpmultiarr[j]['Value1'];
                        data[i]['value2'] = tmpmultiarr[j]['Value2'];
                        data[i]['cpt1'] = tmpmultiarr[j]['CPT1'];
                        data[i]['cpt2'] = tmpmultiarr[j]['CPT2'];
                        data[i]['icd1'] = tmpmultiarr[j]['ICD1'];
                        data[i]['icd2'] = tmpmultiarr[j]['ICD2'];
                        data[i]['status'] = 1;
                    }
                    var removeIndex = ebodatamulti.map(function(item) { return item.id; }).indexOf(tmpmultiarr[j]['id']);
                    ebodatamulti.splice(removeIndex, 1);
                    break;
                }
            }
        }
        else{
            for(var j = 0;j < ebodata.length;j++){
                if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                    var tmpcheck = 0;
                    if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(data[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                            data[i]['dos'] = ebodata[j]['date'];
                            data[i]['value1'] = ebodata[j]['Value1'];
                            data[i]['value2'] = ebodata[j]['Value2'];
                            data[i]['cpt1'] = ebodata[j]['CPT1'];
                            data[i]['cpt2'] = ebodata[j]['CPT2'];
                            data[i]['icd1'] = ebodata[j]['ICD1'];
                            data[i]['icd2'] = ebodata[j]['ICD2'];
                            data[i]['status'] = 1;
                        }
                        break;
                    }
                }
            }
        }
        if(entry.optioncheck == 3){
            if(tmparray.includes(data[i]['status']==null?"10000":data[i]['status'].toString())){
                if(entry.options.length == 0||entry.options.includes(data[i]['measure'])){
                    tmpdata.push(data[i]);
                }
            }
        }
        else if(entry.optioncheck == 4){
            if(tmparray.includes(data[i]['status']==null?"10000":data[i]['status'].toString())){
                tmpdata.push(data[i]);
            }
        }
        else{
            if((entry.options.length == 1&&entry.options[0] == "")||entry.options.includes(data[i]['measure'])){
                tmpdata.push(data[i]);
            }
        }
        
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(clinic[0]['name']);
    worksheet.columns = [
        {header: 'INS ID', key: 'insid', width: 10},
        {header: 'EMR ID', key: 'emrid', width: 10}, 
        {header: 'First Name', key: 'fname', width: 20},
        {header: 'Last Name', key: 'lname', width: 20},
        {header: 'DOB', key: 'dob', width: 20},
        {header: 'Phone', key: 'phone', width: 20},
        {header: 'LOB', key: 'lob', width: 10},
        {header: 'Measure', key: 'measure', width: 30},
        {header: 'DOS', key: 'dos', width: 20},
        {header: 'Value1', key: 'value1', width: 10},
        {header: 'Value2', key: 'value2', width: 10},
        {header: 'CPT1', key: 'cpt1', width: 10},
        {header: 'CPT2', key: 'cpt2', width: 10},
        {header: 'ICD', key: 'icd', width: 10}
    ];
    let excelArr = [];
    for(var i = 0;i < tmpdata.length; i++){
        if(data[i]['dos']==""||data[i]['dos']==null){
            tmpdate = null;
        }
        else{
            tmpdate = DateFormat(new Date(data[i]['dos']));
        }
        var dob = DateFormat(new Date(data[i]['dob']));
        excelArr.push(
            {
                insid:tmpdata[i]['mid'],
                emrid:tmpdata[i]['emr_id'],
                fname:tmpdata[i]['ptfname'],
                lname:tmpdata[i]['ptlname'],
                dob:dob,
                phone:tmpdata[i]['phone'],
                lob:tmpdata[i]['mlob'],
                measure:tmpdata[i]['measure'],
                dos:tmpdate,
                value1:tmpdata[i]['value1'],
                value2:tmpdata[i]['value2'],
                cpt1:tmpdata[i]['cpt1'],
                cpt2:tmpdata[i]['cpt2'],
                icd:tmpdata[i]['icd1'],
            }
        );
    }
    
    worksheet.addRows(excelArr);

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + clinic[0]['name']+".xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}
exports.exportdailyexcel = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
        cdate: req.body.cdate,
        options: req.body.options.split(","),
        optioncheck: req.body.optioncheck,
        weekcheck: req.body.weekcheck,
    }
    let tmparray = ["6"];
    let clinic = await hedis.getClinic(entry.clinicid);
    let data = await hedis.getDaily(entry);
    let ebodata = await hedis.geteboData(entry);
    let multimeasures = await hedis.getmultimeasures();
    let a1crange = await hedis.getoutranges(53);
    let bprange = await hedis.getoutranges(48);
    var a1cv1 = a1crange.length > 0?a1crange[0]['v1']:0;
    var a1cv2 = a1crange.length > 0?a1crange[0]['v2']:0;
    var diasv1 = bprange.length > 0?bprange[0]['v1']:0;
    var diasv2 = bprange.length > 0?bprange[0]['v2']:0;
    var systv1 = bprange.length > 0?bprange[1]['v1']:0;
    var systv2 = bprange.length > 0?bprange[1]['v2']:0;

    var tmpids = "('0'";
    for(var i=0;i<multimeasures.length;i++){
        tmpids += ",'"+multimeasures[i]['id']+"'";
    }
    tmpids += ")";
    let ebodatamulti = await hedis.geteboDataMulti(entry,tmpids);
    let tmpdata = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
            let tmpmultiarr = ebodatamulti.filter(function (currentElement) {
                return currentElement.Measureid === data[i]['measureid'] && currentElement.PT_EMR_ID === data[i]['emr_id'];
            });
            for(var j = 0;j < tmpmultiarr.length;j++){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(tmpmultiarr[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > tmpmultiarr[j]['date']))){
                        data[i]['dos'] = tmpmultiarr[j]['date'];
                        data[i]['value1'] = tmpmultiarr[j]['Value1'];
                        data[i]['value2'] = tmpmultiarr[j]['Value2'];
                        data[i]['cpt1'] = tmpmultiarr[j]['CPT1'];
                        data[i]['cpt2'] = tmpmultiarr[j]['CPT2'];
                        data[i]['icd1'] = tmpmultiarr[j]['ICD1'];
                        data[i]['icd2'] = tmpmultiarr[j]['ICD2'];
                        data[i]['status'] = 1;
                    }
                    var removeIndex = ebodatamulti.map(function(item) { return item.id; }).indexOf(tmpmultiarr[j]['id']);
                    ebodatamulti.splice(removeIndex, 1);
                    break;
                }
            }
        }
        else{
            for(var j = 0;j < ebodata.length;j++){
                if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                    var tmpcheck = 0;
                    if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(data[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                            data[i]['dos'] = ebodata[j]['date'];
                            data[i]['value1'] = ebodata[j]['Value1'];
                            data[i]['value2'] = ebodata[j]['Value2'];
                            data[i]['cpt1'] = ebodata[j]['CPT1'];
                            data[i]['cpt2'] = ebodata[j]['CPT2'];
                            data[i]['icd1'] = ebodata[j]['ICD1'];
                            data[i]['icd2'] = ebodata[j]['ICD2'];
                            data[i]['status'] = 1;
                        }
                        break;
                    }
                }
            }
        }
        if(data[i]['measureid'] == 48){
            if((parseFloat(data[i]['value1']) >= parseFloat(systv1) && parseFloat(data[i]['value1']) <= parseFloat(systv2))||(parseFloat(data[i]['value2']) >= parseFloat(diasv1) && parseFloat(data[i]['value2']) <= parseFloat(diasv2))){
                data[i]['status'] = 4;
                data[i]['outcome'] = 1;
            }
        }
        if(data[i]['measureid'] == 53){
            if(parseFloat(data[i]['value1']) >= parseFloat(a1cv1) && parseFloat(data[i]['value1']) <= parseFloat(a1cv2)){
                data[i]['status'] = 4;
                data[i]['outcome'] = 1;
            }
        }
        if(data[i]['status'] == 6||data[i]['outcome'] == 1){
            tmpdata.push(data[i]);
        }
        
        
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(clinic[0]['name']);
    worksheet.columns = [
        {header: 'INS Name', key: 'insname', width: 30},
        {header: 'INS ID', key: 'insid', width: 10},
        {header: 'EMR ID', key: 'emrid', width: 10}, 
        {header: 'First Name', key: 'fname', width: 20},
        {header: 'Last Name', key: 'lname', width: 20},
        {header: 'DOB', key: 'dob', width: 20},
        {header: 'Phone', key: 'phone', width: 20},
        {header: 'LOB', key: 'lob', width: 10},
        {header: 'Measure', key: 'measure', width: 30},
        {header: 'DOS', key: 'dos', width: 20},
        {header: 'Value1', key: 'value1', width: 10},
        {header: 'Value2', key: 'value2', width: 10},
        {header: 'CPT1', key: 'cpt1', width: 10},
        {header: 'CPT2', key: 'cpt2', width: 10},
        {header: 'ICD', key: 'icd', width: 10}
    ];
    let excelArr = [];
    for(var i = 0;i < tmpdata.length; i++){
        if(data[i]['dos']==""||data[i]['dos']==null){
            tmpdate = null;
        }
        else{
            tmpdate = DateFormat(new Date(data[i]['dos']));
        }
        var dob = DateFormat(new Date(data[i]['dob']));
        excelArr.push(
            {
                insname:tmpdata[i]['insName'],
                insid:tmpdata[i]['mid'],
                emrid:tmpdata[i]['emr_id'],
                fname:tmpdata[i]['ptfname'],
                lname:tmpdata[i]['ptlname'],
                dob:dob,
                phone:tmpdata[i]['phone'],
                lob:tmpdata[i]['mlob'],
                measure:tmpdata[i]['measure'],
                dos:tmpdate,
                value1:tmpdata[i]['value1'],
                value2:tmpdata[i]['value2'],
                cpt1:tmpdata[i]['cpt1'],
                cpt2:tmpdata[i]['cpt2'],
                icd:tmpdata[i]['icd1'],
            }
        );
    }
    
    worksheet.addRows(excelArr);

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + clinic[0]['name'] + "_" + DateFormat(new Date())+".xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}
exports.exportncompliantexcel = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    let data = await hedis.getNcompliant(entry);
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
        }
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(clinic[0]['name']);
    worksheet.columns = [
        {header: 'INS Name', key: 'insname', width: 30},
        {header: 'INS ID', key: 'insid', width: 10},
        {header: 'Name', key: 'fname', width: 20},
        {header: 'DOB', key: 'dob', width: 20},
        {header: 'Last Visit', key: 'lastvisit', width: 20},
        {header: 'Measure', key: 'measure', width: 30},
    ];
    let excelArr = [];
    for(var i = 0;i < data.length; i++){
        var dob = DateFormat(new Date(data[i]['dob']));
        excelArr.push(
            {
                insname:data[i]['insName'],
                insid:data[i]['mid'],
                fname:data[i]['ptfname']+" "+data[i]['ptlname'],
                dob:dob,
                lastvisit:data[i]['lastdate'],
                measure:data[i]['measure'],
            }
        );
    }
    
    worksheet.addRows(excelArr);

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + clinic[0]['name'] + "_" + DateFormat(new Date())+".xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}
exports.outputhedis = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        userid: req.body.userid,
        cyear: req.body.cyear,
        insid: req.body.insid,
        fileid: req.body.fileid,
        trackoption: req.body.trackoption,
        reoption: req.body.reoption,
        reidkey: req.body.reidkey,
    }
    let tmpidarrays;
    let tmpfilename = "";
    let filetype = null;
    if(entry.reoption == 1){
        let idarrays = await hedis.getreportlogids(entry.reidkey);
        if(idarrays[0]['idarray'] == null)
            tmpidarrays = ['0'];
        else{
            filetype = idarrays[0]['filetype'];
            tmpfilename = idarrays[0]['filename'];
            tmpidarrays = idarrays[0]['idarray'].split(",");
        }
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    let fieldlists = await hedis.getFieldlists(entry.fileid);
    let file = await hedis.getFile(entry.fileid);
    let data = await hedis.getoutputData(entry);
    let ebodata = await hedis.geteboData(entry);
    let a1crange = await hedis.getoutranges(53);
    let bprange = await hedis.getoutranges(48);
    var a1cv1 = a1crange.length > 0?a1crange[0]['v1']:0;
    var a1cv2 = a1crange.length > 0?a1crange[0]['v2']:0;
    var diasv1 = bprange.length > 0?bprange[0]['v1']:0;
    var diasv2 = bprange.length > 0?bprange[0]['v2']:0;
    var systv1 = bprange.length > 0?bprange[1]['v1']:0;
    var systv2 = bprange.length > 0?bprange[1]['v2']:0;
    let multimeasures = await hedis.getmultimeasures();
    var tmpids = "('0'";
    for(var i=0;i<multimeasures.length;i++){
        tmpids += ",'"+multimeasures[i]['id']+"'";
    }
    tmpids += ")";
    let ebodatamulti = await hedis.geteboDataMulti(entry,tmpids);
    let tmpdata = [];
    let tmplogdata = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
            let tmpmultiarr = ebodatamulti.filter(function (currentElement) {
                return currentElement.Measureid === data[i]['measureid'] && currentElement.PT_EMR_ID === data[i]['emr_id'];
            });
            for(var j = 0;j < tmpmultiarr.length;j++){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(tmpmultiarr[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > tmpmultiarr[j]['date']))){
                        data[i]['dos'] = DateFormat(new Date(tmpmultiarr[j]['date']));
                        data[i]['value1'] = tmpmultiarr[j]['Value1'];
                        data[i]['value2'] = tmpmultiarr[j]['Value2'];
                        data[i]['cpt1'] = tmpmultiarr[j]['CPT1'];
                        data[i]['cpt2'] = tmpmultiarr[j]['CPT2'];
                        data[i]['icd1'] = tmpmultiarr[j]['ICD1'];
                        data[i]['icd2'] = tmpmultiarr[j]['ICD2'];
                        data[i]['status'] = 1;
                    }
                    var removeIndex = ebodatamulti.map(function(item) { return item.id; }).indexOf(tmpmultiarr[j]['id']);
                    ebodatamulti.splice(removeIndex, 1);
                    break;
                }
            }
        }
        else{
            for(var j = 0;j < ebodata.length;j++){
                if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                    var tmpcheck = 0;
                    if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(data[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                            data[i]['dos'] = DateFormat(new Date(ebodata[j]['date']));
                            data[i]['value1'] = ebodata[j]['Value1'];
                            data[i]['value2'] = ebodata[j]['Value2'];
                            data[i]['cpt1'] = ebodata[j]['CPT1'];
                            data[i]['cpt2'] = ebodata[j]['CPT2'];
                            data[i]['icd1'] = ebodata[j]['ICD1'];
                            data[i]['icd2'] = ebodata[j]['ICD2'];
                            data[i]['status'] = 1;
                        }
                        if(data[i]['measureid'] == 48){
                            if((parseFloat(data[i]['value1']) >= parseFloat(systv1) && parseFloat(data[i]['value1']) <= parseFloat(systv2))||(parseFloat(data[i]['value2']) >= parseFloat(diasv1) && parseFloat(data[i]['value2']) <= parseFloat(diasv2))){
                                data[i]['status'] = 4;
                            }
                        }
                        if(data[i]['measureid'] == 53){
                            if(parseFloat(data[i]['value1']) >= parseFloat(a1cv1) && parseFloat(data[i]['value1']) <= parseFloat(a1cv2)){
                                data[i]['status'] = 4;
                            }
                        }
                        break;
                    }
                }
                
            }
        }
        data[i]['icdv1'] = 10;
        if((entry.reoption != 1 && file[0]['filedefinition'] == 1) || (entry.reoption == 1 && filetype == 1)){
            var outType = ["BP","Cervical","Mammogram","Pain","ACP","FSA","Medrev","W15 Visits","W30 Visits","Immunizations","Adolescent Well","Colon Cancer","Eye","WgtNutr Activity"];
            for(k=0;k < outType.length;k++){
                if((data[i]['keywords'] != ""&&data[i]['keywords'] != null) && data[i]['keywords'].toLowerCase().includes(outType[k].toLowerCase())){
                    if(data[i]['status'] != 4&&data[i]['dos'] != null){
                        data[i]['dos'] = DateFormat(new Date(data[i]['dos']));
                        tmpdata.push(data[i]);
                        // if(data[i]['gstatus'] != 1)
                            tmplogdata.push(data[i]);
                    }
                }
            }
        }
        else if((entry.reoption != 1 && file[0]['filedefinition'] == 2) || (entry.reoption == 1 && filetype == 2)){
            var outType  = ["Nephropathy","A1C"];
            for(k=0;k < outType.length;k++){
                if((data[i]['keywords'] != ""&&data[i]['keywords'] != null) && data[i]['keywords'].toLowerCase().includes(outType[k].toLowerCase())){
                    if(data[i]['status'] != 4&&data[i]['dos'] != null){
                        data[i]['dos'] = DateFormat(new Date(data[i]['dos']));
                        tmpdata.push(data[i]);
                        // if(data[i]['gstatus'] != 1)
                            tmplogdata.push(data[i]);
                    }
                }
            }
        }
    }
    if(entry.trackoption == 1){
        var tmparray = "(0";
        var tmpidarray = [];
        for(var i = 0;i < tmplogdata.length;i++){
            tmparray += ","+tmplogdata[i]['id'];
            tmpidarray.push(tmplogdata[i]['id'])
        }
        tmparray += ")";
        let entrylog = {
            clinicid: req.body.clinicid,
            userid: req.body.userid,
            loginid: req.body.loginid,
            insid: req.body.insid,
            fileid: req.body.fileid,
            total:tmplogdata.length,
            filename:file[0]['name']+"_"+clinic[0]['name'],
            idarray:tmpidarray.toString()
        }
        if(tmplogdata.length > 0)
            await hedis.setreportlog(entrylog);
        await hedis.setgeneratestatus(tmparray);
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(clinic[0]['name']);
    let tmpheader = [];
    for(var i = 0;i < fieldlists.length; i++){
        tmpheader.push(
            {
                header:fieldlists[i]['fieldname'],
                key:fieldlists[i]['fieldname'],
                width:15,
            }
        );
    }
    worksheet.columns = tmpheader;
    let excelArr = {};
    for(var i = 0;i < tmpdata.length;i++){
        if(entry.reoption == 1){
            if(tmpidarrays.includes(tmpdata[i]['id'].toString())){
                for(var j = 0;j < fieldlists.length;j++){
                    excelArr[fieldlists[j]['fieldname']] = tmpdata[i][fieldlists[j]['mapfield']];
                }
                worksheet.addRow(excelArr);
            }
        }
        else{
            if((tmpdata[i]['gstatus'] == null || tmpdata[i]['gstatus'] != 1)&&tmpdata[i]['rstatus'] != 1){
                for(var j = 0;j < fieldlists.length;j++){
                    excelArr[fieldlists[j]['fieldname']] = tmpdata[i][fieldlists[j]['mapfield']];
                }
                worksheet.addRow(excelArr);
            }
            
        }
        
    }
    let realfilename = "";
    if(entry.reoption == 1){
        realfilename = tmpfilename + "_"+DateFormatOutput(new Date())+".xlsx";
    }
    else{
        realfilename = file[0]['name']+"_"+clinic[0]['name']+"_"+DateFormatOutput(new Date())+".xlsx";
    }
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + realfilename
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}
exports.outputretro = async (req, res, next) => {
    let retroids = JSON.parse(req.body.retrodata);
    let clinicid = req.body.clinicid;
    var tmpretroids = "('0'";
    for(var i=0;i<retroids.length;i++){
        tmpretroids += ",'"+retroids[i]+"'";
    }
    tmpretroids += ")";
    let entry = {
        clinicid:clinicid,
        cyear:req.body.cyear,
        insid:req.body.insid
    }
    let clinic = await hedis.getClinic(clinicid);
    let data = await hedis.getoutputDataRetro(entry,tmpretroids);
    let ebodata = await hedis.geteboData(entry);
    let a1crange = await hedis.getoutranges(53);
    let bprange = await hedis.getoutranges(48);
    var a1cv1 = a1crange.length > 0?a1crange[0]['v1']:0;
    var a1cv2 = a1crange.length > 0?a1crange[0]['v2']:0;
    var diasv1 = bprange.length > 0?bprange[0]['v1']:0;
    var diasv2 = bprange.length > 0?bprange[0]['v2']:0;
    var systv1 = bprange.length > 0?bprange[1]['v1']:0;
    var systv2 = bprange.length > 0?bprange[1]['v2']:0;
    let multimeasures = await hedis.getmultimeasures();
    var tmpids = "('0'";
    for(var i=0;i<multimeasures.length;i++){
        tmpids += ",'"+multimeasures[i]['id']+"'";
    }
    tmpids += ")";
    let ebodatamulti = await hedis.geteboDataMulti(entry,tmpids);
    let tmpdata = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
            let tmpmultiarr = ebodatamulti.filter(function (currentElement) {
                return currentElement.Measureid === data[i]['measureid'] && currentElement.PT_EMR_ID === data[i]['emr_id'];
            });
            for(var j = 0;j < tmpmultiarr.length;j++){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(tmpmultiarr[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > tmpmultiarr[j]['date']))){
                        data[i]['dos'] = DateFormat(new Date(tmpmultiarr[j]['date']));
                        data[i]['value1'] = tmpmultiarr[j]['Value1'];
                        data[i]['value2'] = tmpmultiarr[j]['Value2'];
                        data[i]['cpt1'] = tmpmultiarr[j]['CPT1'];
                        data[i]['cpt2'] = tmpmultiarr[j]['CPT2'];
                        data[i]['icd1'] = tmpmultiarr[j]['ICD1'];
                        data[i]['icd2'] = tmpmultiarr[j]['ICD2'];
                        data[i]['status'] = 1;
                    }
                    var removeIndex = ebodatamulti.map(function(item) { return item.id; }).indexOf(tmpmultiarr[j]['id']);
                    ebodatamulti.splice(removeIndex, 1);
                    break;
                }
            }
        }
        else{
            for(var j = 0;j < ebodata.length;j++){
                if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                    var tmpcheck = 0;
                    if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(data[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                            data[i]['dos'] = DateFormat(new Date(ebodata[j]['date']));
                            data[i]['value1'] = ebodata[j]['Value1'];
                            data[i]['value2'] = ebodata[j]['Value2'];
                            data[i]['cpt1'] = ebodata[j]['CPT1'];
                            data[i]['cpt2'] = ebodata[j]['CPT2'];
                            data[i]['icd1'] = ebodata[j]['ICD1'];
                            data[i]['icd2'] = ebodata[j]['ICD2'];
                            data[i]['status'] = 1;
                        }
                        if(data[i]['measureid'] == 48){
                            if((parseFloat(data[i]['value1']) >= parseFloat(systv1) && parseFloat(data[i]['value1']) <= parseFloat(systv2))||(parseFloat(data[i]['value2']) >= parseFloat(diasv1) && parseFloat(data[i]['value2']) <= parseFloat(diasv2))){
                                data[i]['status'] = 4;
                            }
                        }
                        if(data[i]['measureid'] == 53){
                            if(parseFloat(data[i]['value1']) >= parseFloat(a1cv1) && parseFloat(data[i]['value1']) <= parseFloat(a1cv2)){
                                data[i]['status'] = 4;
                            }
                        }
                        break;
                    }
                }
                
            }
        }
        data[i]['icdv1'] = 10;
        if(data[i]['status'] != 4&&data[i]['dos'] != null){
            data[i]['dos'] = DateFormat(new Date(data[i]['dos']));
            tmpdata.push(data[i]);
        }
    }
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(clinic[0]['name']);
    let tmpheader = [
        {
            header:'Member Insurance ID',
            key:'mid',
            width:25,
        },
        {
            header:'First Name',
            key:'ptfname',
            width:15,
        },
        {
            header:'Last Name',
            key:'ptlname',
            width:15,
        },
        {
            header:'Date of Birth',
            key:'dob',
            width:15,
        },
        {
            header:'Measure Name',
            key:'measure',
            width:15,
        },
        {
            header:'DOS',
            key:'dos',
            width:15,
        },
        {
            header:'Value1',
            key:'value1',
            width:15,
        },
        {
            header:'Value2',
            key:'value2',
            width:15,
        },
        {
            header:'ICD',
            key:'icd',
            width:15,
        },
        {
            header:'CPT1',
            key:'cpt1',
            width:15,
        },
        {
            header:'CPT2',
            key:'cpt2',
            width:15,
        },
        {
            header:'Status',
            key:'status',
            width:15,
        },
        {
            header:'RDate',
            key:'rdate',
            width:15,
        },
    ];
    worksheet.columns = tmpheader;
    let excelArr = {};
    for(var i = 0;i < tmpdata.length;i++){
        let rgdate = await hedis.getoutputRetroRGDate(entry,tmpdata[i]['id']);
        let rdateValue = DateFormat(new Date(rgdate[0]['rdate']));
        let gdateValue = DateFormat(new Date(rgdate[0]['date']));
        excelArr['mid'] = tmpdata[i].mid;
        excelArr['ptfname'] = tmpdata[i].ptfname;
        excelArr['ptlname'] = tmpdata[i].ptlname;
        excelArr['dob'] = DateFormat(new Date(tmpdata[i].dob));
        excelArr['measure'] = tmpdata[i].measure;
        excelArr['dos'] = tmpdata[i].dos;
        excelArr['value1'] = tmpdata[i].value1;
        excelArr['value2'] = tmpdata[i].value2;
        excelArr['icd'] = tmpdata[i].icd1;
        excelArr['cpt1'] = tmpdata[i].cpt1;
        excelArr['cpt2'] = tmpdata[i].cpt2;
        excelArr['status'] = tmpdata[i].rstatus == 1 ? "Reported" : tmpdata[i].gstatus == 1 ? "Generated" : "";
        excelArr['rdate'] = tmpdata[i].rstatus == 1 ? rdateValue : tmpdata[i].gstatus == 1 ? gdateValue : "";
        worksheet.addRow(excelArr);
    }
    let realfilename = clinic[0]['name']+"_"+DateFormatOutput(new Date())+".xlsx";
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + realfilename
    );

    return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
    });
}
exports.printletter = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        qid: req.body.qid,
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    let chosenitem = await hedis.getchosenhedis(entry);
    if(chosenitem.length > 0){
        var ptinfo = await hedis.getptinfo(chosenitem);
        if(ptinfo.length > 0){
            chosenitem[0]['ptfname'] = ptinfo[0]["FNAME"];
            chosenitem[0]['ptlname'] = ptinfo[0]["LNAME"];
            chosenitem[0]['language'] = ptinfo[0]["language"];
        }
        var measures = await hedis.getmesaures(chosenitem);
        let entryebo = {
            clinicid:req.body.clinicid,
            cyear:chosenitem[0]['cyear']
        }
        let ebodata = await hedis.geteboData(entryebo);
        
        measurearr = "";
        for(i=0;i<measures.length;i++){
            for(var j = 0;j < ebodata.length;j++){
                if(measures[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == measures[i]['emr_id']&&ebodata[j]['Measureid'] == measures[i]['measureid']){
                    var tmpcheck = 0;
                    if(measures[i]["yearlycheck"]==1&&chosenitem[0]['cyear'] == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(measures[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        measures[i]['status'] = 1;
                        break;
                    }
                }
            }
            if(measures[i]['status'] != 1&&measures[i]['status'] != 2&&measures[i]['status'] != 3){
                if(measures[i]['multicheck'] == 1)
                    measurearr += "- "+measures[i]['Rates']+"<br>";
                else
                    measurearr += "- "+measures[i]['measure']+"<br>";
            }
        }
        if(measurearr != "")
            chosenitem[0]['measure'] = measurearr;
        var lang = await hedis.getchosenlang(chosenitem[0]['language']);
        if(lang.length == 0){
            lang = await hedis.getchosenlang(null);
        }
        var langid = lang[0]['id'];
        var letter = await hedis.getletter(langid);
    }
    let tmpbody = "";
    if(letter.length > 0){
        tmpbody = letter[0]['desc'].replace("$FirstName",'<b>'+chosenitem[0]['ptfname']+'</b>');
        tmpbody = tmpbody.replace("$LastName",'<b>'+chosenitem[0]['ptlname']+'</b>');
        tmpbody = tmpbody.replace("$MiddleInitial","");
        tmpbody = tmpbody.replace("$DOB",DateFormat(chosenitem[0]['dob']));
        tmpbody = tmpbody.replace("$MissingService",chosenitem[0]['measure']);
        tmpbody = tmpbody.replace("$Contact_name",clinic[0]['contact_name']==null?clinic[0]['name']:clinic[0]['contact_name']);
        tmpbody = tmpbody.replace("$Tel",clinic[0]['contact_tel']==null?clinic[0]['phone']:clinic[0]['contact_tel']);
    }
    let letterdata = {
        "body":tmpbody,
        "clinic":clinic
    }
    ejs.renderFile(path.join(__dirname, '../../views/', "hedisletter.ejs"), {result: letterdata}, (err, data) => {
        if (err) {
              res.send(err);
        } else {
            let options = { format: 'landscape',orientation:"landscape" };
            pdf.create(data, options).toFile("./pdfs/hedisletter.pdf", function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    var file= './pdfs/hedisletter.pdf';
                    fs.readFile(file,function(err,data){
                        res.contentType("application/pdf");
                        res.send(data);
                    });
                }
            });
        }
    });
}
exports.printdaily = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
        cdate: req.body.cdate,
        weekcheck: req.body.weekcheck,
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    let data = await hedis.getDaily(entry);
    let ebodata = await hedis.geteboData(entry);
    let multimeasures = await hedis.getmultimeasures();
    let a1crange = await hedis.getoutranges(53);
    let bprange = await hedis.getoutranges(48);
    var a1cv1 = a1crange.length > 0?a1crange[0]['v1']:0;
    var a1cv2 = a1crange.length > 0?a1crange[0]['v2']:0;
    var diasv1 = bprange.length > 0?bprange[0]['v1']:0;
    var diasv2 = bprange.length > 0?bprange[0]['v2']:0;
    var systv1 = bprange.length > 0?bprange[1]['v1']:0;
    var systv2 = bprange.length > 0?bprange[1]['v2']:0;

    var tmpids = "('0'";
    for(var i=0;i<multimeasures.length;i++){
        tmpids += ",'"+multimeasures[i]['id']+"'";
    }
    tmpids += ")";
    let ebodatamulti = await hedis.geteboDataMulti(entry,tmpids);
    let tmpdata = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
            let tmpmultiarr = ebodatamulti.filter(function (currentElement) {
                return currentElement.Measureid === data[i]['measureid'] && currentElement.PT_EMR_ID === data[i]['emr_id'];
            });
            for(var j = 0;j < tmpmultiarr.length;j++){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(tmpmultiarr[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > tmpmultiarr[j]['date']))){
                        data[i]['dos'] = tmpmultiarr[j]['date'];
                        data[i]['value1'] = tmpmultiarr[j]['Value1'];
                        data[i]['value2'] = tmpmultiarr[j]['Value2'];
                        data[i]['cpt1'] = tmpmultiarr[j]['CPT1'];
                        data[i]['cpt2'] = tmpmultiarr[j]['CPT2'];
                        data[i]['icd1'] = tmpmultiarr[j]['ICD1'];
                        data[i]['icd2'] = tmpmultiarr[j]['ICD2'];
                        data[i]['status'] = 1;
                    }
                    var removeIndex = ebodatamulti.map(function(item) { return item.id; }).indexOf(tmpmultiarr[j]['id']);
                    ebodatamulti.splice(removeIndex, 1);
                    break;
                }
            }
        }
        else{
            for(var j = 0;j < ebodata.length;j++){
                if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                    var tmpcheck = 0;
                    if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(data[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                            data[i]['dos'] = ebodata[j]['date'];
                            data[i]['value1'] = ebodata[j]['Value1'];
                            data[i]['value2'] = ebodata[j]['Value2'];
                            data[i]['cpt1'] = ebodata[j]['CPT1'];
                            data[i]['cpt2'] = ebodata[j]['CPT2'];
                            data[i]['icd1'] = ebodata[j]['ICD1'];
                            data[i]['icd2'] = ebodata[j]['ICD2'];
                            data[i]['status'] = 1;
                        }
                        break;
                    }
                }
            }
        }
        if(data[i]['measureid'] == 48){
            if((parseFloat(data[i]['value1']) >= parseFloat(systv1) && parseFloat(data[i]['value1']) <= parseFloat(systv2))||(parseFloat(data[i]['value2']) >= parseFloat(diasv1) && parseFloat(data[i]['value2']) <= parseFloat(diasv2))){
                data[i]['status'] = 4;
                data[i]['outcome'] = 1;
            }
        }
        if(data[i]['measureid'] == 53){
            if(parseFloat(data[i]['value1']) >= parseFloat(a1cv1) && parseFloat(data[i]['value1']) <= parseFloat(a1cv2)){
                data[i]['status'] = 4;
                data[i]['outcome'] = 1;
            }
        }
        if(data[i]['status'] == 6 || data[i]['outcome'] == 1){
            tmpdata.push(data[i]);
        }
    }
    let dailydata = {
        "data":tmpdata,
        "clinic":clinic,
        "cdate":entry.cdate,
    }
    ejs.renderFile(path.join(__dirname, '../../views/', "hedisdailyprint.ejs"), {result: dailydata}, (err, data) => {
        if (err) {
              res.send(err);
        } else {
            let options = { format: 'landscape',orientation:"landscape" };
            pdf.create(data, options).toFile("./pdfs/"+clinic[0]['name']+"_"+entry.cdate+".pdf", function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    var file= "./pdfs/"+clinic[0]['name']+"_"+entry.cdate+".pdf";
                    fs.readFile(file,function(err,data){
                        res.contentType("application/pdf");
                        res.send(data);
                    });
                }
            });
        }
    });
}
exports.printncompliant = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    let ncompliant = await hedis.getNcompliant(entry);
    let ncompliantdata = {
        "data":ncompliant,
        "clinic":clinic
    }
    ejs.renderFile(path.join(__dirname, '../../views/', "hedisnoncompliantprint.ejs"), {result: ncompliantdata}, (err, data) => {
        if (err) {
              res.send(err);
        } else {
            let options = { format: 'landscape',orientation:"landscape" };
            pdf.create(data, options).toFile("./pdfs/"+clinic[0]['name']+"_"+DateFormat(new Date())+".pdf", function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    var file= "./pdfs/"+clinic[0]['name']+"_"+DateFormat(new Date())+".pdf";
                    fs.readFile(file,function(err,data){
                        res.contentType("application/pdf");
                        res.send(data);
                    });
                }
            });
        }
    });
}
exports.checkemail = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        qid: req.body.qid,
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    let chosenitem = await hedis.getchosenhedis(entry);
    if(chosenitem.length > 0){
        var ptinfo = await hedis.getptinfo(chosenitem);
        if(ptinfo.length > 0){
            chosenitem[0]['ptfname'] = ptinfo[0]["FNAME"];
            chosenitem[0]['ptlname'] = ptinfo[0]["LNAME"];
            chosenitem[0]['language'] = ptinfo[0]["language"];
        }
        var measures = await hedis.getmesaures(chosenitem);
        let entryebo = {
            clinicid:req.body.clinicid,
            cyear:chosenitem[0]['cyear']
        }
        let ebodata = await hedis.geteboData(entryebo);
        measurearr = "";
        for(i=0;i<measures.length;i++){
            for(var j = 0;j < ebodata.length;j++){
                if(measures[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == measures[i]['emr_id']&&ebodata[j]['Measureid'] == measures[i]['measureid']){
                    var tmpcheck = 0;
                    if(measures[i]["yearlycheck"]==1&&chosenitem[0]['cyear'] == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(measures[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        measures[i]['status'] = 1;
                        break;
                    }
                }
            }
            if(measures[i]['status'] != 1&&measures[i]['status'] != 2&&measures[i]['status'] != 3){
                if(measures[i]['multicheck'] == 1)
                    measurearr += "- "+measures[i]['Rates']+"<br>";
                else
                    measurearr += "- "+measures[i]['measure']+"<br>";
            }
        }
        if(measurearr != "")
            chosenitem[0]['measure'] = measurearr;
        var lang = await hedis.getchosenlang(chosenitem[0]['language']);
        if(lang.length == 0){
            lang = await hedis.getchosenlang(null);
        }
        var langid = lang[0]['id'];
        var email = await hedis.getemail(langid);
    }
    let tmpbody = "";
    let tmpsubject = "";
    if(email.length > 0){
        tmpbody = email[0]['desc'].replace("$Clinic_name",'<b><span class="blue-color">'+clinic[0]['name']+'</span></b>');
        tmpbody = tmpbody.replace("$Clinic_tel",'<b><span class="blue-color">'+clinic[0]['phone']+'</span></b>');
        tmpbody = tmpbody.replace("$MissingService",'<b><span class="blue-color">'+chosenitem[0]['measure']+'</span></b>');
        tmpbody = tmpbody.replace("$Clinic_web",'<b><span class="blue-color">'+clinic[0]['web']+'</span></b>');
        tmpbody = tmpbody.replace("$portal",'<b><span class="blue-color">'+clinic[0]['portal']+'</span></b>');
        tmpbody = tmpbody.replace("$Clinic_web",'<b><span class="blue-color">'+clinic[0]['contact_web']+'</span></b>');
        tmpbody = tmpbody.replace("$Clinic_ex",'<b><span class="blue-color">'+clinic[0]['ex']+'</span></b>');
        
        tmpsubject = email[0]['name'].replace("$PT_NAME",'<b>'+chosenitem[0]['ptfname']+' '+chosenitem[0]['ptlname']+'</b>');
        res.status(200).json({ subject: tmpsubject, body: tmpbody });
    }
    else{
        res.status(200).json({ subject: "", body: "" });
    }
}
exports.checksms = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        qid: req.body.qid,
    }
    let pflag = false;
    let mflag = false;
    let phone = await hedis.getPhone(entry.clinicid);
    let counts = await hedis.getCounts(entry.clinicid);
    if(typeof counts[0] == "undefined" || counts[0]['counts'] == null){
       var availablecounts = 0;
    }
    else{
        var availablecounts =counts[0]['counts'];
    }

    if(typeof phone[0] != "undefined"&&phone[0]['age'] == 1){
        let clinic = await hedis.getClinic(entry.clinicid);
        let chosenitem = await hedis.getchosenhedis(entry);
        if(chosenitem.length > 0){
            var ptinfo = await hedis.getptinfo(chosenitem);
            if(ptinfo.length > 0){
                chosenitem[0]['ptfname'] = ptinfo[0]["FNAME"];
                chosenitem[0]['ptlname'] = ptinfo[0]["LNAME"];
                chosenitem[0]['language'] = ptinfo[0]["language"];
                chosenitem[0]['phone'] = ptinfo[0]["PHONE"];
                chosenitem[0]['mobile'] = ptinfo[0]["MOBILE"];
                var phoneflag = await hedis.getcheckphone(chosenitem[0]['phone']);
                if(phoneflag.length > 0)
                    pflag = true
                else
                    pflag = false
                var mobileflag = await hedis.getcheckphone(chosenitem[0]['mobile']);
                if(mobileflag.length > 0)
                    mflag = true
                else
                    mflag = false
            }
            var measures = await hedis.getmesaures(chosenitem);
            let entryebo = {
                clinicid:req.body.clinicid,
                cyear:chosenitem[0]['cyear']
            }
            let ebodata = await hedis.geteboData(entryebo);
            measurearr = "";
            for(i=0;i<measures.length;i++){
                for(var j = 0;j < ebodata.length;j++){
                    if(measures[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == measures[i]['emr_id']&&ebodata[j]['Measureid'] == measures[i]['measureid']){
                        var tmpcheck = 0;
                        if(measures[i]["yearlycheck"]==1&&chosenitem[0]['cyear'] == new Date(ebodata[j]['date']).getFullYear()){
                            tmpcheck = 1;
                        }
                        else if(measures[i]["yearlycheck"]!=1){
                            tmpcheck = 1;
                        }
                        if(tmpcheck == 1){
                            measures[i]['status'] = 1;
                            break;
                        }
                    }
                }
                if(measures[i]['status'] != 1&&measures[i]['status'] != 2&&measures[i]['status'] != 3){
                    if(measures[i]['multicheck'] == 1)
                        measurearr += "- "+measures[i]['Rates']+"<br>";
                    else
                        measurearr += "- "+measures[i]['measure']+"<br>";
                }
            }
            if(measurearr != "")
                chosenitem[0]['measure'] = measurearr;
            var lang = await hedis.getchosenlang(chosenitem[0]['language']);
            if(lang.length == 0){
                lang = await hedis.getchosenlang(null);
            }
            var langid = lang[0]['id'];
            var sms = await hedis.getsms(langid);
        }
        let tmpbody = "";
        let tmpsubject = "";
        if(sms.length > 0){
            tmpbody = sms[0]['desc'].replace("$PT_NAME",'<b>'+chosenitem[0]['ptfname']+' '+chosenitem[0]['ptlname']+'</b>');
            tmpbody = tmpbody.replace("$Contact_name",'<b>'+clinic[0]['contact_name']+'</b>');
            tmpbody = tmpbody.replace("$Tel",'<b>'+(clinic[0]['contact_tel']==null?clinic[0]['phone']:clinic[0]['contact_tel'])+'</b>');
            tmpbody = tmpbody.replace("$Clinic_ex",'<b>'+clinic[0]['ex']+'</b>');
            tmpbody = tmpbody.replace("$MissingService",'<b>'+chosenitem[0]['measure']+'</b>');
            tmpbody = tmpbody.replace("$Clinic_name",'<b>'+clinic[0]['name']+'</b>');
            
            tmpsubject = sms[0]['name'].replace("$PT_NAME",'<b>'+chosenitem[0]['ptfname']+' '+chosenitem[0]['ptlname']+'</b>');
            tmpsubject = tmpsubject.replace("$Clinic_name",'<b>'+clinic[0]['name']+'</b>');
            res.status(200).json({ status:"success",subject: tmpsubject, body: tmpbody,phone:chosenitem[0]['phone'],mobile:chosenitem[0]['mobile'],pflag:pflag,mflag:mflag,counts:availablecounts });
        }
        else{
            res.status(200).json({ status:"failed",subject: "", body: "" });
        }
    }
    else{
        res.status(200).json({ status:"pending",subject: "", body: "" });
    }
}
exports.sendsms = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        userid: req.body.userid,
        qid: req.body.qid,
        smstype: req.body.smstype,
        custombody: req.body.custombody,
        number: req.body.number,
        whatsapp:req.body.whatsapp
    }
    let phone = await hedis.getPhone(entry.clinicid);
    let price = await hedis.getPrice(entry.clinicid);
    let counts = await hedis.getCounts(entry.clinicid);
    let credittrack = await hedis.getcredittrack(entry.clinicid);
    let chosenmanager = await hedis.getclinicmanager(entry.clinicid);
    const customer = await stripe.customers.retrieve(
        counts[0]['customer']
    );
    var manager = "",managerphone = "";
    if(chosenmanager.length > 0){
        manager = chosenmanager[0]['fname']+" "+chosenmanager[0]['lname'];
        managerphone = chosenmanager[0]['phone'];
    }

    if(parseInt(counts[0]['counts']) === 0 || counts[0]['counts'] == null){
        res.status(200).json({ message: "no credit" });
    }
    else if(typeof phone[0] != "undefined"&&(phone[0]['name'] == "" || phone[0]['name'] == null)){
        res.status(200).json({ message: "pending" });
    }
    else{
        let clinic = await hedis.getClinic(entry.clinicid);
        let chosenitem = await hedis.getchosenhedis(entry);
        if(chosenitem.length > 0){
            var ptinfo = await hedis.getptinfo(chosenitem);
            if(ptinfo.length > 0){
                chosenitem[0]['ptfname'] = ptinfo[0]["FNAME"];
                chosenitem[0]['ptlname'] = ptinfo[0]["LNAME"];
                chosenitem[0]['language'] = ptinfo[0]["language"];
                chosenitem[0]['phone'] = ptinfo[0]["PHONE"];
                chosenitem[0]['mobile'] = ptinfo[0]["MOBILE"];
            }
            var measures = await hedis.getmesaures(chosenitem);
            let entryebo = {
                clinicid:req.body.clinicid,
                cyear:chosenitem[0]['cyear']
            }
            let ebodata = await hedis.geteboData(entryebo);
            measurearr = "";
            for(i=0;i<measures.length;i++){
                for(var j = 0;j < ebodata.length;j++){
                    if(measures[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == measures[i]['emr_id']&&ebodata[j]['Measureid'] == measures[i]['measureid']){
                        var tmpcheck = 0;
                        if(measures[i]["yearlycheck"]==1&&chosenitem[0]['cyear'] == new Date(ebodata[j]['date']).getFullYear()){
                            tmpcheck = 1;
                        }
                        else if(measures[i]["yearlycheck"]!=1){
                            tmpcheck = 1;
                        }
                        if(tmpcheck == 1){
                            measures[i]['status'] = 1;
                            break;
                        }
                    }
                }
                if(measures[i]['status'] != 1&&measures[i]['status'] != 2&&measures[i]['status'] != 3){
                    if(measures[i]['multicheck'] == 1)
                        measurearr += "- "+measures[i]['Rates']+"<br>";
                    else
                        measurearr += "- "+measures[i]['measure']+"<br>";
                }
            }
            if(measurearr != "")
                chosenitem[0]['measure'] = measurearr;
            var lang = await hedis.getchosenlang(chosenitem[0]['language']);
            if(lang.length == 0){
                lang = await hedis.getchosenlang(null);
            }
            var langid = lang[0]['id'];
            var sms = await hedis.getsms(langid);
        }
        let tmpbody = "";
        if(sms.length > 0){
            tmpbody = sms[0]['desc'].replace("$PT_NAME",chosenitem[0]['ptfname']+' '+chosenitem[0]['ptlname']);
            tmpbody = tmpbody.replace("$Contact_name",clinic[0]['contact_name']);
            tmpbody = tmpbody.replace("$Tel",(clinic[0]['contact_tel']==null?clinic[0]['phone']:clinic[0]['contact_tel']));
            tmpbody = tmpbody.replace("$Clinic_ex",clinic[0]['ex']);
            tmpbody = tmpbody.replace("$MissingService",chosenitem[0]['measure']);
            tmpbody = tmpbody.replace("$Clinic_name",clinic[0]['name']);
        }
        if(entry.smstype == 2){
            tmpbody = entry.custombody;
        }
        smsresult = twilio.messages.create({
            from: entry.whatsapp?'whatsapp:+13476012801':phone[0]['name'],
            // from: "+18443014774",
            // to: "+16464680123",
            to: entry.whatsapp?'whatsapp:+16464680123':"+1"+entry.number,
            body: striptags(tmpbody)
        }).then(message =>
            {if(message.sid != ""&&message.sid != null){
                hedis.trackhedissmssent(entry.clinicid,chosenitem[0]['insid'],entry.userid,chosenitem[0]['measureid'],DateFormat(new Date()));
                hedis.discountsms(entry.clinicid);
                if(parseInt(counts[0]['counts']) <= 150 && typeof counts[0] != "undefined" && counts[0]['auto'] === 1){
                    const session = stripe.charges.create({
                        amount: 100 * parseInt(counts[0]['autoamount']),
                        currency: "usd",
                        customer: counts[0]['customer']
                    });
                    hedis.addcountsms(entry.clinicid,smscountsFor(parseInt(counts[0]['autoamount']),parseInt(price[0]['value']*100)));
                    var recid = generateString(10);
                    let creditentry={
                        clinicid: entry.clinicid,
                        amount: parseInt(counts[0]['autoamount']),
                        counts: smscountsFor(parseInt(counts[0]['autoamount']),parseInt(price[0]['value']*100)),
                        fullname: customer.name,
                        email: customer.email,
                    }
                    hedis.setcredittrack(creditentry,recid,2);
                    let tmpsubject = "Communication receipt from Precision Quality";
                    let emaildata = {
                        'name':customer.name,
                        'amount':parseInt(counts[0]['autoamount']),
                        'counts':smscountsFor(parseInt(counts[0]['autoamount']),parseInt(price[0]['value']*100)),
                        'subject':tmpsubject,
                        'date':DateFormat(new Date()),
                        'transid':credittrack.length+1,
                        'recid':recid,
                        'manager':manager,
                        'managerphone':managerphone,
                    }
                    ejs.renderFile(path.join(__dirname, '../../views/', "creditemail.ejs"), { body: emaildata }, function (err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            var mailOptions = {
                                from: config.emailaccess.user,
                                to: customer.email,
                                subject: tmpsubject,
                                html: data
                            }
                            mail.sendMail(mailOptions, function(error, info){
                                if (error) {
                                    // res.status(200).json({ message: "failed" });
                                } else {
                                    // res.status(200).json({ message: "success" });
                                }
                            });
                        }
                    });
                }
                res.status(200).json({ message: "success" });
            }
            else{
                res.status(200).json({ message: "failed" });
            }});
    }
}
exports.sendemail = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        qid: req.body.qid,
        emailtype: req.body.emailtype,
        custombody: req.body.custombody,
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    let chosenitem = await hedis.getchosenhedis(entry);
    if(chosenitem.length > 0){
        var ptinfo = await hedis.getptinfo(chosenitem);
        if(ptinfo.length > 0){
            chosenitem[0]['ptfname'] = ptinfo[0]["FNAME"];
            chosenitem[0]['ptlname'] = ptinfo[0]["LNAME"];
            chosenitem[0]['language'] = ptinfo[0]["language"];
            chosenitem[0]['email'] = (ptinfo[0]["EMAIL"]!=null&&ptinfo[0]["EMAIL"]!="")?ptinfo[0]["EMAIL"]:chosenitem[0]['email'];
        }
        var measures = await hedis.getmesaures(chosenitem);
        let entryebo = {
            clinicid:req.body.clinicid,
            cyear:chosenitem[0]['cyear']
        }
        let ebodata = await hedis.geteboData(entryebo);
        measurearr = "";
        for(i=0;i<measures.length;i++){
            for(var j = 0;j < ebodata.length;j++){
                if(measures[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == measures[i]['emr_id']&&ebodata[j]['Measureid'] == measures[i]['measureid']){
                    var tmpcheck = 0;
                    if(measures[i]["yearlycheck"]==1&&chosenitem[0]['cyear'] == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(measures[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        measures[i]['status'] = 1;
                        break;
                    }
                }
            }
            if(measures[i]['status'] != 1&&measures[i]['status'] != 2&&measures[i]['status'] != 3){
                if(measures[i]['multicheck'] == 1)
                    measurearr += "- "+measures[i]['Rates']+"<br>";
                else
                    measurearr += "- "+measures[i]['measure']+"<br>";
            }
        }
        if(measurearr != "")
            chosenitem[0]['measure'] = measurearr;
        var lang = await hedis.getchosenlang(chosenitem[0]['language']);
        if(lang.length == 0){
            lang = await hedis.getchosenlang(null);
        }
        var langid = lang[0]['id'];
        var email = await hedis.getemail(langid);
    }
    let tmpbody = "";
    let tmpsubject = "";
    if(email.length > 0){
        tmpbody = email[0]['desc'].replace("$Clinic_name",'<b><span class="blue-color">'+clinic[0]['name']+'</span></b>');
        tmpbody = tmpbody.replace("$Clinic_tel",'<b><span class="blue-color">'+clinic[0]['phone']+'</span></b>');
        tmpbody = tmpbody.replace("$MissingService",'<b><span class="blue-color">'+chosenitem[0]['measure']+'</span></b>');
        tmpbody = tmpbody.replace("$Clinic_web",'<b><span class="blue-color">'+clinic[0]['web']+'</span></b>');
        tmpbody = tmpbody.replace("$portal",'<b><span class="blue-color">'+clinic[0]['portal']+'</span></b>');
        tmpbody = tmpbody.replace("$Clinic_web",'<b><span class="blue-color">'+clinic[0]['contact_web']+'</span></b>');
        tmpbody = tmpbody.replace("$Clinic_ex",'<b><span class="blue-color">'+clinic[0]['ex']+'</span></b>');
        
        tmpsubject = email[0]['name'].replace("$PT_NAME",chosenitem[0]['ptfname']+' '+chosenitem[0]['ptlname']);
    }

    if(entry.emailtype == 2){
        tmpbody = entry.custombody;
    }
    let emaildata = {
        'name':clinic[0]['name'],
        'address':clinic[0]['address1']+" "+clinic[0]['address2'],
        'tel':clinic[0]['contact_tel']==null?clinic[0]['phone']:clinic[0]['contact_tel'],
        'subject':tmpsubject,
        'body':tmpbody
    }
    ejs.renderFile(path.join(__dirname, '../../views/', "hedisemail.ejs"), { body: emaildata }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                from: config.emailaccess.user,
                to: chosenitem[0]['email'],
                subject: tmpsubject,
                html: data
            }
            mail.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.status(200).json({ message: "failed" });
                } else {
                    res.status(200).json({ message: "success" });
                }
            });
        }
    });
}
exports.dailyemail = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
        cdate: req.body.cdate,
        weekcheck: req.body.weekcheck,
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    let data = await hedis.getDaily(entry);
    let ebodata = await hedis.geteboData(entry);
    let multimeasures = await hedis.getmultimeasures();
    let a1crange = await hedis.getoutranges(53);
    let bprange = await hedis.getoutranges(48);
    var a1cv1 = a1crange.length > 0?a1crange[0]['v1']:0;
    var a1cv2 = a1crange.length > 0?a1crange[0]['v2']:0;
    var diasv1 = bprange.length > 0?bprange[0]['v1']:0;
    var diasv2 = bprange.length > 0?bprange[0]['v2']:0;
    var systv1 = bprange.length > 0?bprange[1]['v1']:0;
    var systv2 = bprange.length > 0?bprange[1]['v2']:0;

    var tmpids = "('0'";
    for(var i=0;i<multimeasures.length;i++){
        tmpids += ",'"+multimeasures[i]['id']+"'";
    }
    tmpids += ")";
    let ebodatamulti = await hedis.geteboDataMulti(entry,tmpids);
    let tmpdata = [];
    let tmpptcnt = 0;
    let tmpptname = "";
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
            let tmpmultiarr = ebodatamulti.filter(function (currentElement) {
                return currentElement.Measureid === data[i]['measureid'] && currentElement.PT_EMR_ID === data[i]['emr_id'];
            });
            for(var j = 0;j < tmpmultiarr.length;j++){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(tmpmultiarr[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > tmpmultiarr[j]['date']))){
                        data[i]['dos'] = tmpmultiarr[j]['date'];
                        data[i]['value1'] = tmpmultiarr[j]['Value1'];
                        data[i]['value2'] = tmpmultiarr[j]['Value2'];
                        data[i]['cpt1'] = tmpmultiarr[j]['CPT1'];
                        data[i]['cpt2'] = tmpmultiarr[j]['CPT2'];
                        data[i]['icd1'] = tmpmultiarr[j]['ICD1'];
                        data[i]['icd2'] = tmpmultiarr[j]['ICD2'];
                        data[i]['status'] = 1;
                    }
                    var removeIndex = ebodatamulti.map(function(item) { return item.id; }).indexOf(tmpmultiarr[j]['id']);
                    ebodatamulti.splice(removeIndex, 1);
                    break;
                }
            }
        }
        else{
            for(var j = 0;j < ebodata.length;j++){
                if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                    var tmpcheck = 0;
                    if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(data[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                            data[i]['dos'] = ebodata[j]['date'];
                            data[i]['value1'] = ebodata[j]['Value1'];
                            data[i]['value2'] = ebodata[j]['Value2'];
                            data[i]['cpt1'] = ebodata[j]['CPT1'];
                            data[i]['cpt2'] = ebodata[j]['CPT2'];
                            data[i]['icd1'] = ebodata[j]['ICD1'];
                            data[i]['icd2'] = ebodata[j]['ICD2'];
                            data[i]['status'] = 1;
                        }
                        break;
                    }
                }
            }
        }
        if(data[i]['measureid'] == 48){
            if((parseFloat(data[i]['value1']) >= parseFloat(systv1) && parseFloat(data[i]['value1']) <= parseFloat(systv2))||(parseFloat(data[i]['value2']) >= parseFloat(diasv1) && parseFloat(data[i]['value2']) <= parseFloat(diasv2))){
                data[i]['status'] = 4;
                data[i]['outcome'] = 1;
            }
        }
        if(data[i]['measureid'] == 53){
            if(parseFloat(data[i]['value1']) >= parseFloat(a1cv1) && parseFloat(data[i]['value1']) <= parseFloat(a1cv2)){
                data[i]['status'] = 4;
                data[i]['outcome'] = 1;
            }
        }
        if(data[i]['status'] == 6 || data[i]['outcome'] == 1){
            if(tmpptname != data[i]['ptfname']+" "+data[i]['ptlname']){
                tmpptcnt++;
                tmpptname = data[i]['ptfname']+" "+data[i]['ptlname'];
                data[i]['ptfname'] = "PT"+tmpptcnt;
            }
            else{
                data[i]['ptfname'] = "PT"+tmpptcnt;
            }
            tmpdata.push(data[i]);
        }
    }
    let users = await hedis.gethedisusers();
    let tmpUsers = [];
    for(var i =0;i < users.length;i++){
        var tmpclinicArr = users[i]['clinic'].split(",");
        if(tmpclinicArr.length == 1 && tmpclinicArr[0] == "0"){
            tmpUsers.push(users[i]['email']);
        }
        else{
            if(tmpclinicArr.includes(entry.clinicid.toString())){
                tmpUsers.push(users[i]['email']);
            }
        }
    }
    subject = clinic[0]['name']+" - HEDIS PTs for: "+entry.cdate;
    let dailydata = {
        "data":tmpdata,
        'base_url':config.common.viewUrl,
        'name':clinic[0]['name'],
        'address':clinic[0]['address1']+" "+clinic[0]['address2']+" "+clinic[0]['city']+" "+clinic[0]['zip'],
        'tel':clinic[0]['contact_tel']==null?clinic[0]['phone']:clinic[0]['contact_tel'],
        'subject':subject,
    }
    ejs.renderFile(path.join(__dirname, '../../views/', "hedisdailyemail.ejs"), { body: dailydata }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                from: config.emailaccess.user,
                to: tmpUsers,
                subject: subject,
                html: data
            }
            mail.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.status(200).json({ message: "failed" });
                } else {
                    res.status(200).json({ message: "success" });
                }
            });
        }
    });
}
exports.ncompliantemail = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    let ncompliant = await hedis.getNcompliant(entry);
    let users = await hedis.gethedisnoncompliantusers();
    let tmpUsers = [];
    for(var i =0;i < users.length;i++){
        var tmpclinicArr = users[i]['clinic'].split(",");
        if(tmpclinicArr.length == 1 && tmpclinicArr[0] == "0"){
            tmpUsers.push(users[i]['email']);
        }
        else{
            if(tmpclinicArr.includes(entry.clinicid.toString())){
                tmpUsers.push(users[i]['email']);
            }
        }
    }
    subject = clinic[0]['name']+" - PTS NO VISITS HEDIS "+new Date().getFullYear()+" - Report "+DateFormat(new Date())
    let ncompliantdata = {
        "data":ncompliant,
        'name':clinic[0]['name'],
        'address':clinic[0]['address1']+" "+clinic[0]['address2']+" "+clinic[0]['city']+" "+clinic[0]['zip'],
        'tel':clinic[0]['contact_tel']==null?clinic[0]['phone']:clinic[0]['contact_tel'],
        'subject':subject,
    }
    ejs.renderFile(path.join(__dirname, '../../views/', "hedisnoncomliantemail.ejs"), { body: ncompliantdata }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                from: config.emailaccess.user,
                to: tmpUsers,
                subject: subject,
                html: data
            }
            mail.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.status(200).json({ message: "failed" });
                } else {
                    res.status(200).json({ message: "success" });
                }
            });
        }
    });
}
exports.getpatientchart = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        mid: req.body.mid,
        cyear: req.body.cyear,
    }
    let data = await hedis.getDataForpt(entry);
    let ebodata = await hedis.geteboData(entry);
    let multimeasures = await hedis.getmultimeasures();
    var tmpids = "('0'";
    for(var i=0;i<multimeasures.length;i++){
        tmpids += ",'"+multimeasures[i]['id']+"'";
    }
    tmpids += ")";
    let ebodatamulti = await hedis.geteboDataMulti(entry,tmpids);
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
            let tmpmultiarr = ebodatamulti.filter(function (currentElement) {
                return currentElement.Measureid === data[i]['measureid'] && currentElement.PT_EMR_ID === data[i]['emr_id'];
            });
            for(var j = 0;j < tmpmultiarr.length;j++){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(tmpmultiarr[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > tmpmultiarr[j]['date']))){
                        data[i]['dos'] = tmpmultiarr[j]['date'];
                        data[i]['status'] = 1;
                    }
                    var removeIndex = ebodatamulti.map(function(item) { return item.id; }).indexOf(tmpmultiarr[j]['id']);
                    ebodatamulti.splice(removeIndex, 1);
                    break;
                }
            }
        }
        else{
            for(var j = 0;j < ebodata.length;j++){
                if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                    var tmpcheck = 0;
                    if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(data[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                            data[i]['dos'] = ebodata[j]['date'];
                            data[i]['status'] = 1;
                        }
                        break;
                    }
                }
            }
        }
        
    }
    res.status(200).json({ data: data });
}
exports.setmonthdata = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear
    }
    var date = new Date();
    var firstDay = DateFormat(new Date(date.getFullYear(), date.getMonth(), 1));

    await hedis.deletecurrentsetmonthdata(entry.clinicid,firstDay);

    let inslists = await hedis.getinslists(entry);
    let ebodata = await hedis.geteboData(entry);
    let a1crange = await hedis.getoutranges(53);
    let bprange = await hedis.getoutranges(48);
    var a1cv1 = a1crange.length > 0?a1crange[0]['v1']:0;
    var a1cv2 = a1crange.length > 0?a1crange[0]['v2']:0;
    var diasv1 = bprange.length > 0?bprange[0]['v1']:0;
    var diasv2 = bprange.length > 0?bprange[0]['v2']:0;
    var systv1 = bprange.length > 0?bprange[1]['v1']:0;
    var systv2 = bprange.length > 0?bprange[1]['v2']:0;
    for(var k=0;k<inslists.length;k++){
        let entry = {
            clinicid: req.body.clinicid,
            cyear: req.body.cyear,
            insid: inslists[k]['insid'],
        }
        let data = await hedis.getDataForMonth(entry);

        var tmpdata = {};
        var tmpresult = [];
        for(var i = 0;i < data.length;i++){
            if(data[i]['multicheck'] == 1){
                data[i]['measure'] = data[i]['Rates'];
            }
            for(var j = 0;j < ebodata.length;j++){
                if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                    var tmpcheck = 0;
                    if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(data[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                            data[i]['status'] = 1;
                        }
                        if(data[i]['measureid'] == 48){
                            if((parseFloat(data[i]['value1']) >= parseFloat(systv1) && parseFloat(data[i]['value1']) <= parseFloat(systv2))||(parseFloat(data[i]['value2']) >= parseFloat(diasv1) && parseFloat(data[i]['value2']) <= parseFloat(diasv2))){
                                data[i]['status'] = 4;
                            }
                        }
                        if(data[i]['measureid'] == 53){
                            if(parseFloat(data[i]['value1']) >= parseFloat(a1cv1) && parseFloat(data[i]['value1']) <= parseFloat(a1cv2)){
                                data[i]['status'] = 4;
                            }
                        }
                        break;
                    }
                }
            }
            if(data[i]['Health_Care_Domain'] != null&&data[i]['Health_Care_Domain'] != ""){
                tmpresult.push(data[i]);
            }
        }
        var tmpdomain = "";
        var tmpmeasure = "";
        tmpresult.sort(function (a, b) {
            return a.Health_Care_Domain.localeCompare(b.Health_Care_Domain) || a.Measure.localeCompare(b.Measure) || a.measure.localeCompare(b.measure);
        });
        for(var i = 0;i < tmpresult.length;i++){
            if(tmpdomain == tmpresult[i]['Health_Care_Domain']){
                if(tmpmeasure == tmpresult[i]['measure']){
                    if(tmpresult[i]['status'] == 1 || tmpresult[i]['status'] == 2 || tmpresult[i]['status'] == 3 || tmpresult[i]['status'] == 9 || tmpresult[i]['status'] == 13){
                        tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']].done++;
                    }
                    else{
                        tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']].notdone++;
                    }
                }
                else{
                    if(tmpresult[i]['status'] == 1 || tmpresult[i]['status'] == 2 || tmpresult[i]['status'] == 3 || tmpresult[i]['status'] == 9 || tmpresult[i]['status'] == 13){
                        tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']]={done:1,notdone:0};
                    }
                    else{
                        tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']]={done:0,notdone:1};
                    }
                    tmpmeasure = tmpresult[i]['measure'];
                }
            }
            else{
                tmpdata[tmpresult[i]['Health_Care_Domain']]={};
                if(tmpresult[i]['status'] == 1 || tmpresult[i]['status'] == 2 || tmpresult[i]['status'] == 3 || tmpresult[i]['status'] == 9 || tmpresult[i]['status'] == 13){
                    tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']]={done:1,notdone:0};
                }
                else{
                    tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']]={done:0,notdone:1};
                }
                tmpdomain = tmpresult[i]['Health_Care_Domain'];
                tmpmeasure = tmpresult[i]['measure'];
            }
        }
        let monthdata = [];
        

        Object.entries(tmpdata).forEach(([key, value]) => {
            var domain = key;
            Object.entries(value).forEach(([key1, value1]) => {
                monthdata = {
                    clinicid:entry.clinicid,
                    insid:entry.insid,
                    domain:domain,
                    measure:key1,
                    denominator:value1.done+value1.notdone,
                    numerator:value1.done,
                    missing:value1.notdone,
                    percentage:Math.round(value1.done/(value1.done+value1.notdone)*100),
                };
                hedis.setmonthdata(monthdata,firstDay, (err, result) => {
                    if (err) {
                        res.status(404).json(err);
                    }
                });
            });
        });
    }
    res.status(200).json({ message: "OK" });
}
exports.setmonthdataptstatus = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
    }
    let data = await hedis.getDataPTstatus(entry);
    let ebodata = await hedis.geteboData(entry);
    let a1crange = await hedis.getoutranges(53);
    let bprange = await hedis.getoutranges(48);
    var a1cv1 = a1crange.length > 0?a1crange[0]['v1']:0;
    var a1cv2 = a1crange.length > 0?a1crange[0]['v2']:0;
    var diasv1 = bprange.length > 0?bprange[0]['v1']:0;
    var diasv2 = bprange.length > 0?bprange[0]['v2']:0;
    var systv1 = bprange.length > 0?bprange[1]['v1']:0;
    var systv2 = bprange.length > 0?bprange[1]['v2']:0;
    let multimeasures = await hedis.getmultimeasures();
    var tmpids = "('0'";
    for(var i=0;i<multimeasures.length;i++){
        tmpids += ",'"+multimeasures[i]['id']+"'";
    }
    tmpids += ")";
    let ebodatamulti = await hedis.geteboDataMulti(entry,tmpids);
    let tmpdata = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            let tmpmultiarr = ebodatamulti.filter(function (currentElement) {
                return currentElement.Measureid === data[i]['measureid'] && currentElement.PT_EMR_ID === data[i]['emr_id'];
            });
            for(var j = 0;j < tmpmultiarr.length;j++){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(tmpmultiarr[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > tmpmultiarr[j]['date']))){
                        data[i]['status'] = 1;
                    }
                    var removeIndex = ebodatamulti.map(function(item) { return item.id; }).indexOf(tmpmultiarr[j]['id']);
                    ebodatamulti.splice(removeIndex, 1);
                    break;
                }
            }
        }
        else{
            for(var j = 0;j < ebodata.length;j++){
                if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                    var tmpcheck = 0;
                    if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                        tmpcheck = 1;
                    }
                    else if(data[i]["yearlycheck"]!=1){
                        tmpcheck = 1;
                    }
                    if(tmpcheck == 1){
                        if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                            data[i]['status'] = 1;
                        }
                        if(data[i]['measureid'] == 48){
                            if((parseFloat(data[i]['value1']) >= parseFloat(systv1) && parseFloat(data[i]['value1']) <= parseFloat(systv2))||(parseFloat(data[i]['value2']) >= parseFloat(diasv1) && parseFloat(data[i]['value2']) <= parseFloat(diasv2))){
                                data[i]['status'] = 4;
                            }
                        }
                        if(data[i]['measureid'] == 53){
                            if(parseFloat(data[i]['value1']) >= parseFloat(a1cv1) && parseFloat(data[i]['value1']) <= parseFloat(a1cv2)){
                                data[i]['status'] = 4;
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
    data.sort(function (a, b) {
        return a.insid-b.insid || a.status-b.status;
    });
    const convert = (data) => {
        const res = {};
        data.forEach((obj) => {
            const key = `${obj.insid}${obj.status}`;
            if (!res[key]) {
                res[key] = { ...obj, count: 0 };
            };
            res[key].count += 1;
            });
        return Object.values(res);
    };
    data = convert(data);
    data.sort(function (a, b) {
        return a.insid-b.insid || a.status-b.status;
    });
    var date = new Date();
    var firstDay = DateFormat(new Date(date.getFullYear(), date.getMonth(), 1));
    for(var i = 0;i < data.length;i++){
        let tmpentry = {
            clinicid: req.body.clinicid,
            insid:data[i]['insid'],
            status:data[i]['status'],
            count:data[i]['count'],
            date:firstDay
        }
        hedis.setmonthdataptstatus(tmpentry, (err, result) => {
            if (err) {
                res.status(404).json(err);
            }
        });
    }
    res.status(200).json({ message: "OK" });
}
exports.gethedisdashdata = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
        insid: req.body.insid,
    }
    let data = await hedis.getDataFordash(entry);
    let ebodata = await hedis.geteboData(entry);
    var tmpdata = {};
    var tmpresult = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
        }
        for(var j = 0;j < ebodata.length;j++){
            if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                        data[i]['status'] = 1;
                    }
                    break;
                }
            }
        }
        if(data[i]['Health_Care_Domain'] != null&&data[i]['Health_Care_Domain'] != ""){
            tmpresult.push(data[i]);
        }
    }
    var tmpdomain = "";
    var tmpmeasure = "";
    tmpresult.sort(function (a, b) {
        return a.Health_Care_Domain.localeCompare(b.Health_Care_Domain) || a.Measure.localeCompare(b.Measure) || a.measure.localeCompare(b.measure);
    });
    for(var i = 0;i < tmpresult.length;i++){
        if(tmpdomain == tmpresult[i]['Health_Care_Domain']){
            if(tmpmeasure == tmpresult[i]['measure']){
                if(tmpresult[i]['status'] == 1 || tmpresult[i]['status'] == 2 || tmpresult[i]['status'] == 3){
                    tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']].done++;
                }
                else{
                    tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']].notdone++;
                }
            }
            else{
                if(tmpresult[i]['status'] == 1 || tmpresult[i]['status'] == 2 || tmpresult[i]['status'] == 3){
                    tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']]={done:1,notdone:0};
                }
                else{
                    tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']]={done:0,notdone:1};
                }
                tmpmeasure = tmpresult[i]['measure'];
            }
        }
        else{
            tmpdata[tmpresult[i]['Health_Care_Domain']]={};
            if(tmpresult[i]['status'] == 1 || tmpresult[i]['status'] == 2 || tmpresult[i]['status'] == 3){
                tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']]={done:1,notdone:0};
            }
            else{
                tmpdata[tmpresult[i]['Health_Care_Domain']][tmpresult[i]['measure']]={done:0,notdone:1};
            }
            tmpdomain = tmpresult[i]['Health_Care_Domain'];
            tmpmeasure = tmpresult[i]['measure'];
        }
    }
    // console.log(tmpdata)
    res.status(200).json({ data: tmpdata });
}
exports.getpatientnotes = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        mid: req.body.mid,
        cyear: req.body.cyear,
    }
    let data = await hedis.getDataForpt(entry);
    let ebodata = await hedis.geteboData(entry);
    let tmpresult = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
        }
        for(var j = 0;j < ebodata.length;j++){
            if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                        data[i]['status'] = 1;
                    }
                    break;
                }
            }
        }
        if(data[i]['status'] != 1&&data[i]['status'] != 2&&data[i]['status'] != 3){
            tmpresult.push(data[i])
        }
    }
    res.status(200).json({ data: tmpresult });
}
exports.writenotes = (req, res, next) => {
    let entry = {
        qid: req.body.qid,
        note: req.body.note,
        assignuser: req.body.assignuser,
        status: req.body.status,
        createduser: req.body.createduser,
        created: new Date(),
    }
    hedis.writenotes(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getnotes = async (req, res, next) => {
    let entry = {
        mid: req.body.mid,
        clinicid: req.body.clinicid,
        userid: req.body.userid
    }
    let data = await hedis.getnotes(entry);
    let tmpresult = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['assuser'] == 0){
            tmpresult.push(data[i]);
        }
        else if(data[i]['assuser'] == entry.userid){
            tmpresult.push(data[i]);
        }
    }
    res.status(200).json({ data: tmpresult });
}
exports.getallnotes = async (req, res, next) => {
    let entry = {
        qid: req.body.qid,
        clinicid: req.body.clinicid,
        userid: req.body.userid
    }
    let notesinfo = await hedis.getmidnote(entry.qid);
    let data = await hedis.getallnotes(notesinfo);
    let tmpresult = [];
    for(var i = 0;i < data.length;i++){
        if(data[i]['assuser'] == 0){
            tmpresult.push(data[i]);
        }
        else if(data[i]['assuser'] == entry.userid){
            tmpresult.push(data[i]);
        }
    }
    res.status(200).json({ data: tmpresult });
}
exports.updatenote = (req, res, next) => {
    let entry = {
        id: req.body.id,
        note: req.body.note,
    }
    hedis.updatenote(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletenote = (req, res, next) => {
    let entry = {
        id: req.body.id,
    }
    hedis.deletenote(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getchartforallnotes = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        qid: req.body.qid,
        cyear: req.body.cyear,
    }
    let notesinfo = await hedis.getmidnote(entry.qid);
    let tmpentry = {
        clinicid: req.body.clinicid,
        mid: notesinfo[0]['mid'],
        cyear: req.body.cyear,
    }
    let data = await hedis.getDataForpt(tmpentry);
    let ebodata = await hedis.geteboData(tmpentry);
    for(var i = 0;i < data.length;i++){
        if(data[i]['multicheck'] == 1){
            data[i]['measure'] = data[i]['Rates'];
        }
        for(var j = 0;j < ebodata.length;j++){
            if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                var tmpcheck = 0;
                if(data[i]["yearlycheck"]==1&&entry.cyear == new Date(ebodata[j]['date']).getFullYear()){
                    tmpcheck = 1;
                }
                else if(data[i]["yearlycheck"]!=1){
                    tmpcheck = 1;
                }
                if(tmpcheck == 1){
                    if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > ebodata[j]['date']))){
                        data[i]['status'] = 1;
                    }
                    break;
                }
            }
        }
    }
    res.status(200).json({ data: data });
}
exports.getptinfonotes = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        qid: req.body.qid,
    }
    let chosenitem = await hedis.getchosenhedis(entry);
    if(chosenitem.length > 0){
        var ptinfo = await hedis.getptinfo(chosenitem);
        if(ptinfo.length > 0){
            chosenitem[0]['ptfname'] = ptinfo[0]["FNAME"];
            chosenitem[0]['ptlname'] = ptinfo[0]["LNAME"];
            chosenitem[0]['language'] = ptinfo[0]["language"];
        }
    }
    res.status(200).json({ data: chosenitem });
}
exports.chosenHedisitem = (req, res, next) => {
    let entry = {
        id: req.body.id,
    }
    hedis.chosenHedisitem(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatevisitdate = (req, res, next) => {
    let entry = {
        id: req.body.id,
        nextdate: req.body.nextdate,
        lastdate: req.body.lastdate,
    }
    hedis.updatevisitdate(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.monthreport = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    var date = new Date();
    var firstDay = DateFormat(new Date(date.getFullYear(), date.getMonth(), 1));
    var firstpDay = DateFormat(new Date(date.getFullYear(), date.getMonth()-1, 1));
    let monthresult = await hedis.getmonthreportdata(entry.clinicid,firstDay,firstpDay);
    let monthresultstatus = await hedis.getmonthdataptstatus(entry.clinicid,firstDay);
    let letterdata = {
        "body":monthresult,
        "bodystatus":monthresultstatus,
        "clinic":clinic,
    }
    ejs.renderFile(path.join(__dirname, '../../views/', "hedismonthreport.ejs"), {result: letterdata}, (err, data) => {
        if (err) {
              res.send(err);
        } else {
            let options = { format: 'landscape',orientation:"landscape", border:{top:'20px',bottom:'20px',left:'10px'} };
            pdf.create(data, options).toFile("./pdfs/hedismonthreport.pdf", function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    var file= './pdfs/hedismonthreport.pdf';
                    fs.readFile(file,function(err,data){
                        res.contentType("application/pdf");
                        res.send(data);
                    });
                }
            });
        }
    });
}
exports.monthemail = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear,
    }
    let clinic = await hedis.getClinic(entry.clinicid);
    let users = await hedis.gethedisusers();
    let tmpUsers = [];
    for(var i =0;i < users.length;i++){
        var tmpclinicArr = users[i]['clinic'].split(",");
        if(tmpclinicArr.length == 1 && tmpclinicArr[0] == "0"){
            tmpUsers.push(users[i]['email']);
        }
        else{
            if(tmpclinicArr.includes(entry.clinicid.toString())){
                tmpUsers.push(users[i]['email']);
            }
        }
    }
    var date = new Date();
    var firstDay = DateFormat(new Date(date.getFullYear(), date.getMonth(), 1));
    var firstpDay = DateFormat(new Date(date.getFullYear(), date.getMonth()-1, 1));
    
    let monthresult = await hedis.getmonthreportdata(entry.clinicid,firstDay,firstpDay);
    let monthresultstatus = await hedis.getmonthdataptstatus(entry.clinicid,firstDay);
    let tmpstatus = {};
    var tmpins = "";
    for(var i = 0;i < monthresultstatus.length;i++){
        if(tmpins == monthresultstatus[i]['insName']){
            if(monthresultstatus[i]['status'] == 5) tmpstatus[tmpins][0] = monthresultstatus[i]['count'];
            else if(monthresultstatus[i]['status'] == 7) tmpstatus[tmpins][1] = monthresultstatus[i]['count'];
            else if(monthresultstatus[i]['status'] == 4) tmpstatus[tmpins][2] = monthresultstatus[i]['count'];
            else if(monthresultstatus[i]['status'] == 6) tmpstatus[tmpins][3] = monthresultstatus[i]['count'];
            else if(monthresultstatus[i]['status'] == 10) tmpstatus[tmpins][4] = monthresultstatus[i]['count'];
        }
        else{
            tmpins = monthresultstatus[i]['insName'];
            tmpstatus[tmpins] = [0,0,0,0,0];
            if(monthresultstatus[i]['status'] == 5) tmpstatus[tmpins][0] = monthresultstatus[i]['count'];
            else if(monthresultstatus[i]['status'] == 7) tmpstatus[tmpins][1] = monthresultstatus[i]['count'];
            else if(monthresultstatus[i]['status'] == 4) tmpstatus[tmpins][2] = monthresultstatus[i]['count'];
            else if(monthresultstatus[i]['status'] == 6) tmpstatus[tmpins][3] = monthresultstatus[i]['count'];
            else if(monthresultstatus[i]['status'] == 10) tmpstatus[tmpins][4] = monthresultstatus[i]['count'];
        }
    }
    let tmpsubject = clinic[0]['name']+" | "+new Date().toLocaleString('default', { month: 'long' })+" "+new Date().getFullYear()+" | Hedis Quality Report";
    let emaildata = {
        'base_url':config.common.viewUrl,
        'name':clinic[0]['name'],
        'address':clinic[0]['address1']+" "+clinic[0]['address2'],
        'tel':clinic[0]['contact_tel']==null?clinic[0]['phone']:clinic[0]['contact_tel'],
        'body':monthresult,
        "bodystatus":tmpstatus,
    }
    ejs.renderFile(path.join(__dirname, '../../views/', "hedismonthemail.ejs"), { result: emaildata }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                from: config.emailaccess.user,
                to: tmpUsers,
                subject: tmpsubject,
                html: data
            }
            mail.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.status(200).json({ message: "failed" });
                } else {
                    res.status(200).json({ message: "success" });
                }
            });
        }
    });
}
exports.getmonthdata = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear
    }
    var date = new Date();
    var firstDay = DateFormat(new Date(date.getFullYear(), date.getMonth(), 1));
    var firstpDay = DateFormat(new Date(date.getFullYear(), date.getMonth()-1, 1));
    let monthresult = await hedis.getmonthreportdata(entry.clinicid,firstDay,firstpDay);
    res.status(200).json({ data: monthresult });
}
exports.getmonthdataptstatus = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        cyear: req.body.cyear
    }
    var date = new Date();
    var firstDay = DateFormat(new Date(date.getFullYear(), date.getMonth(), 1));
    let monthresult = await hedis.getmonthdataptstatus(entry.clinicid,firstDay);
    res.status(200).json({ data: monthresult });
}
exports.gethedispopulation = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        insid: req.body.insid,
        cyear: req.body.cyear
    }
    let data = await hedis.gethedispopulation(entry);
    let ebodata = await hedis.geteboDatapop(entry);
    let a1crange = await hedis.getoutranges(53);
    let bprange = await hedis.getoutranges(48);
    var a1cv1 = a1crange.length > 0?a1crange[0]['v1']:0;
    var a1cv2 = a1crange.length > 0?a1crange[0]['v2']:0;
    var diasv1 = bprange.length > 0?bprange[0]['v1']:0;
    var diasv2 = bprange.length > 0?bprange[0]['v2']:0;
    var systv1 = bprange.length > 0?bprange[1]['v1']:0;
    var systv2 = bprange.length > 0?bprange[1]['v2']:0;
    let tmpresult = [];
    for(var i = 0;i < data.length;i++){
        var tmpcnt = 0;
        for(var j = 0;j < ebodata.length;j++){
            if(data[i]['measureid'] != null && ebodata[j]['PT_EMR_ID'] == data[i]['emr_id']&&ebodata[j]['Measureid'] == data[i]['measureid']){
                if(!([2,4].includes(data[i]['status']) && data[i]['dos'] != null && (data[i]['dos'] > tmpmultiarr[j]['date']))){
                    data[i]['dos'] = ebodata[j]['date'];
                    data[i]['value1'] = ebodata[j]['Value1'];
                    data[i]['value2'] = ebodata[j]['Value2'];
                    data[i]['cpt1'] = ebodata[j]['CPT1'];
                    data[i]['cpt2'] = ebodata[j]['CPT2'];
                    data[i]['icd1'] = ebodata[j]['ICD1'];
                    data[i]['icd2'] = ebodata[j]['ICD2'];
                    data[i]['status'] = 1;
                }
                if(data[i]['measureid'] == 48){
                    if((parseFloat(data[i]['value1']) >= parseFloat(systv1) && parseFloat(data[i]['value1']) <= parseFloat(systv2))||(parseFloat(data[i]['value2']) >= parseFloat(diasv1) && parseFloat(data[i]['value2']) <= parseFloat(diasv2))){
                        data[i]['status'] = 4;
                    }
                }
                if(data[i]['measureid'] == 53){
                    if(parseFloat(data[i]['value1']) >= parseFloat(a1cv1) && parseFloat(data[i]['value1']) <= parseFloat(a1cv2)){
                        data[i]['status'] = 4;
                    }
                }
                tmpresult.push(data[i]);
                tmpcnt++;
            }
        }
        if(tmpcnt == 0&&data[i]['value1']!=null){
            if(data[i]['measureid'] == 48){
                if((parseFloat(data[i]['value1']) >= parseFloat(systv1) && parseFloat(data[i]['value1']) <= parseFloat(systv2))||(parseFloat(data[i]['value2']) >= parseFloat(diasv1) && parseFloat(data[i]['value2']) <= parseFloat(diasv2))){
                    data[i]['status'] = 4;
                }
            }
            if(data[i]['measureid'] == 53){
                if(parseFloat(data[i]['value1']) >= parseFloat(a1cv1) && parseFloat(data[i]['value1']) <= parseFloat(a1cv2)){
                    data[i]['status'] = 4;
                }
            }
            tmpresult.push(data[i]);
        }
    }
    tmpresult = [...new Set(tmpresult)];
    tmpresult.sort(function (a, b) {
        return a.emr_id-b.emr_id || a.measureid-b.measureid;
    });
    res.status(200).json({ data: tmpresult });
}
exports.updatereported = async (req, res, next) => {
    let entry = {
        id: req.body.id,
        rdate: req.body.rdate,
        rby: req.body.rby,
    }
    let idarrays = await hedis.getreportlogids(entry.id);
    if(idarrays[0]['idarray'] == null)
        var tmparray = ['0'];
    else
        var tmparray = idarrays[0]['idarray'].split(",");
    var tmpstring = "(0";
    for(var i = 0;i < tmparray.length;i++){
        tmpstring += ","+tmparray[i];
    }
    tmpstring += ")";
    hedis.setreportedstatus(tmpstring);
    hedis.updatereported(entry);
    res.status(200).json({ data: "OK" });
}
exports.chosenreported = (req, res, next) => {
    let entry = {
        id: req.body.id,
    }
    hedis.chosenreported(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.conciergereport = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    hedis.conciergereport(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.smscredit = async (req, res) => {
    let entry = {
        clinicid: req.body.clinicid,
        amount: req.body.amount,
        counts: req.body.counts,
        fullname: req.body.fullname,
        email: req.body.email,
        token: req.body.token,
        autocheck: req.body.autocheck,
    }
    let credittrack = await hedis.getcredittrack(entry.clinicid);
    let chosenmanager = await hedis.getclinicmanager(entry.clinicid);
    var manager = "",managerphone = "";
    if(chosenmanager.length > 0){
        manager = chosenmanager[0]['fname']+" "+chosenmanager[0]['lname'];
        managerphone = chosenmanager[0]['phone'];
    }
    try {
        stripe.customers.create({
            name: entry.fullname,
            email: entry.email,
            source: entry.token.id
        }).then(customer => {
            stripe.charges.create({
            amount: parseInt(entry.amount)*100,
            currency: 'usd',
            customer: customer.id,
            description: entry.counts+' Available SMS'
            });
            hedis.setcustomers(entry.clinicid,customer.id,entry.autocheck,entry.amount);
            var recid = generateString(10);
            hedis.setcredittrack(entry,recid,1);
            let tmpsubject = "Communication receipt from Precision Quality";
            let emaildata = {
                'name':entry.fullname,
                'amount':req.body.amount,
                'counts':req.body.counts,
                'subject':tmpsubject,
                'date':DateFormat(new Date()),
                'transid':credittrack.length+1,
                'recid':recid,
                'manager':manager,
                'managerphone':managerphone,
            }
            ejs.renderFile(path.join(__dirname, '../../views/', "creditemail.ejs"), { body: emaildata }, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    var mailOptions = {
                        from: config.emailaccess.user,
                        to: entry.email,
                        subject: tmpsubject,
                        html: data
                    }
                    mail.sendMail(mailOptions, function(error, info){
                        if (error) {
                            // res.status(200).json({ message: "failed" });
                        } else {
                            // res.status(200).json({ message: "success" });
                        }
                    });
                }
            });
            res.json({ status:"success",counts: entry.counts });
        });
        
    } catch (err) { 
        res.json({ status:"failed",counts: 0 });
    }
};
exports.setsmscounts = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        counts: req.body.counts,
    }
    hedis.setsmscounts(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.gethedisreport = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
    }
    let result = await hedis.gethedisreport(entry);
    let notes = await hedis.getnotesbyuser(entry);
    let sms = await hedis.getsmssbyuser(entry);
    let tmpArr = {};
    let nameArr = [];
    for(var i = 0;i < result.length;i++){
        if(typeof result[i-1] != "undefined" && result[i-1]['userid'] == result[i]['userid']){
            if(!nameArr.includes(result[i]['name'].trim())){
                nameArr.push(result[i]['name'].trim());
                tmpArr[result[i]['userid']][result[i]['name'].trim()] = result[i]['total'];
            }
            else{
                tmpArr[result[i]['userid']][result[i]['name'].trim()] += result[i]['total'];
            }
        }
        else{
            tmpArr[result[i]['userid']] = {};
            nameArr = [];
            nameArr.push(result[i]['name'].trim());
            tmpArr[result[i]['userid']][result[i]['name'].trim()] = result[i]['total'];
        }
    }
    res.status(200).json({ data: result, total:tmpArr, sms:sms, notes:notes });
}
exports.getaccessdetail = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        userid: req.body.userid,
        sdate: req.body.sdate,
        edate: req.body.edate,
    }
    let result = await hedis.getaccessbydate(entry);
    let tmpArr = {};
    for(var i = 0;i < result.length;i++){
        if(typeof result[i - 1] != "undefined" && DateFormatString(result[i]['logintime']) == DateFormatString(result[i - 1]['logintime'])){
            tmpArr[DateFormatString(result[i]['logintime'])]['total'] += result[i]['totaltime'];
            tmpArr[DateFormatString(result[i]['logintime'])]['logins'].push(result[i]['id']);
        }
        else{
            tmpArr[DateFormatString(result[i]['logintime'])] = {};
            tmpArr[DateFormatString(result[i]['logintime'])]['total'] = result[i]['totaltime'];
            tmpArr[DateFormatString(result[i]['logintime'])]['logins'] = [];
            tmpArr[DateFormatString(result[i]['logintime'])]['logins'].push(result[i]['id']);
        }
    }
    let condIn = [];
    let keys = [];
    Object.entries(tmpArr).forEach(([key, value]) => {
        condIn.push("("+value.logins.toString()+")");
        keys.push(key);
    });
    for(var i = 0;i < condIn.length;i++){
        let actions = await hedis.actionbydate(entry.clinicid,entry.userid,condIn[i]);
        tmpArr[keys[i]]['values'] = actions;
    }
    res.status(200).json({ data: tmpArr });
}

exports.getPTsbyquery = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        measureArr: req.body.measureArr
    }
    let result;
    let ptids = [];
    let tmpresult = [];
    for(var i = 0;i < entry.measureArr.length;i++){
        result = await hedis.getPTsbyquery(entry.clinicid,entry.measureArr[i]);
        for(var j = 0;j < result.length;j++){
            if(!ptids.includes(result[j]['emr_id'])){
                ptids.push(result[j]['emr_id']);
                tmpresult.push(result[j]);
            }
        }
    }
    res.status(200).json({ data: tmpresult });
}

exports.getPatient = async (req, res, next) => {

    hedis.getPatient(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

