const xlsx = require('node-xlsx');
const ffs = require('../../repositories/back/ffs');
const hedis = require('../../repositories/back/hedis');
const paid = require('../../repositories/back/paid');
var nodemailer = require('nodemailer');
const Excel = require('exceljs');
var fs = require('fs');
const config = require('../../config');
var striptags = require('striptags');
let ejs = require("ejs");
let path = require("path");
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
exports.ffsloader = async (req, res, next) => {
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
    let icodes = await ffs.getiCPTs();
    let ignorecodes = [];
    for(var i = 0;i < icodes.length;i++){
        ignorecodes.push(icodes[i]['name']);
    }
    for (row of pureSheet) {
        if (rowCounter != 0) {
            let entry = [];
            entry = {
                userid:userid,
                clinicid:clinicid,
                ENC_CL:row[headers.indexOf("ENC_CL")],
                ENC_ID:row[headers.indexOf("ENC_ID")],
                PT_ID:row[headers.indexOf("PT_ID")],
                PCP_ID:row[headers.indexOf("PCP_ID")],
                VTYPE:row[headers.indexOf("VTYPE")],
                VID:row[headers.indexOf("VID")],
                VCODE:row[headers.indexOf("VCODE")],
                STATUS:row[headers.indexOf("STATUS")],
                date:(row[headers.indexOf("date")]==null||row[headers.indexOf("date")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("date")]),
                CLStatus:row[headers.indexOf("CLStatus")],
                CLDate:(row[headers.indexOf("CLDate")]==null||row[headers.indexOf("CLDate")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("CLDate")]),
                PTCopay:row[headers.indexOf("PTCopay")],
                deduct:row[headers.indexOf("deduct")],
                PayID:row[headers.indexOf("PayID")],
                payorId:row[headers.indexOf("payorId")],
                PayorT:row[headers.indexOf("PayorT")],
                type:row[headers.indexOf("type")],
                T_date:(row[headers.indexOf("T_date")]==null||row[headers.indexOf("T_date")]=="")?null:ExcelDateToJSDate(row[headers.indexOf("T_date")]),
                T_mss:row[headers.indexOf("T_mss")],
                T_id:row[headers.indexOf("T_id")],
                CPT:row[headers.indexOf("CPT")],
                CPT_DESC:row[headers.indexOf("CPT_DESC")],
                Mod1:(row[headers.indexOf("Mod1")]==null||row[headers.indexOf("Mod1")]=="")?"":row[headers.indexOf("Mod1")],
                ICD:row[headers.indexOf("ICD")],
                ICD_DESC:row[headers.indexOf("ICD_DESC")],
                CPT_PAY:row[headers.indexOf("CPT_PAY")],
                MsgCode:row[headers.indexOf("MsgCode")],
                InsName:(row[headers.indexOf("InsName")]==""||row[headers.indexOf("InsName")]==null)?"zzzname":row[headers.indexOf("InsName")]
            };
            if(!ignorecodes.includes(entry.CPT)){
                ffs.ffsloader(entry, () => {});
                newCounter++;
            }
        }
        rowCounter++;
    };
    await ffs.getffs(clinicid, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: newCounter });
        }
    });
}
exports.getins = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    ffs.getins(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getdaterange = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await ffs.getdaterange(entry);
    res.status(200).json({ data: result});
}
exports.getfulldaterange = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await ffs.getfulldaterange(entry);
    res.status(200).json({ data: result});
}
exports.getcopaynonpaid = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        ins: req.body.ins,
        sdate: req.body.sdate,
        edate: req.body.edate,
        dcheck: req.body.dcheck,
        pcheck: req.body.pcheck,
    }
    let result = await ffs.getcopaynonpaid(entry);
    let ptinfo = await ffs.getptinfo(req.body.clinicid);
    for(var i = 0;i < result.length;i++){
        let tmpinfo = ptinfo.filter(function (currentElement) {
            return currentElement.patientid === result[i]['PT_ID'];
        });
        if(tmpinfo.length > 0){
            result[i].fname = tmpinfo[0]['FNAME'];
            result[i].lname = tmpinfo[0]['LNAME'];
            result[i].dob = tmpinfo[0]['DOB'];
            result[i].phone = tmpinfo[0]['PHONE'];
        }
        else{
            result[i].fname = null;
            result[i].lname = null;
            result[i].dob = null;
            result[i].phone = null;
        }
    }
    res.status(200).json({ data: result });
}
exports.getinvoicedata = async (req, res, next) => {
    let entry = {
        id: req.body.id,
    }
    await ffs.setpdfinvoice(entry);
    let result = await ffs.getinvoicedata(entry);
    res.status(200).json({ data: result });
}
exports.payments = async (req, res) => {
    let entry = {
        clinicid: req.body.clinicid,
        id: req.body.id,
        copay: req.body.copay,
        deduct: req.body.deduct,
        copay_adj: req.body.copay_adj,
        deduct_adj: req.body.deduct_adj,
    }
    let clinic = await ffs.getclinic(entry.clinicid)
    let encodeparams = Buffer.from(clinic[0]['name']).toString('base64');
    var tmpitems = [];
    if(parseFloat(entry.copay) > 0){
        tmpitems.push({
            price_data: {
            currency: 'usd',
            product_data: {
                name: 'Copayment',
                description: 'Copayment'
            },
            unit_amount: ((parseFloat(entry.copay)-parseFloat(entry.copay_adj))*100).toFixed(0),
            },
            quantity: 1,
        });
    }
    if(parseFloat(entry.deduct) > 0){
        tmpitems.push({
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Deductible',
                description: 'Deductible'
              },
              unit_amount: ((parseFloat(entry.deduct)-parseFloat(entry.deduct_adj))*100).toFixed(0),
            },
            quantity: 1,
        }); 
    }
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: tmpitems,
        mode: 'payment',
    //   payment_intent_data: {
    //     application_fee_amount: 123,
    //     transfer_data: {
    //       destination: '{{CONNECTED_ACCOUNT_ID}}',
    //     },
    //   },
      success_url: `${config.common.viewUrl}success_payment?t=`+encodeparams+`&s={CHECKOUT_SESSION_ID}`,
      cancel_url: `${config.common.viewUrl}cancel_payment`,
    });
    await ffs.setpaymentsession(entry.clinicid,entry.id,session.id);
    res.json({ id: session.id });
};
exports.sendinvoiceemail = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        id: req.body.id,
        copay: req.body.copay,
        deduct: req.body.deduct,
        copay_adj: req.body.copay_adj,
        deduct_adj: req.body.deduct_adj,
    }
    let clinic = await ffs.getclinic(entry.clinicid)
    let result = await ffs.getinvoicedata(entry);
    let encodeparams = Buffer.from(`${entry.copay.toFixed(2)+"||"+entry.deduct.toFixed(2)+"||"+entry.copay_adj.toFixed(2)+"||"+entry.deduct_adj.toFixed(2)}`+"||"+entry.clinicid+"||"+entry.id).toString('base64');
    // console.log(Buffer.from(encodeparams, "base64").toString())
    let subject = "Invoice From "+clinic[0]['name']
    let emaildata = {
        'subject':subject,
        'clinic':clinic,
        'result':result,
        'copay':parseFloat(entry.copay-entry.copay_adj).toFixed(2),
        'deduct':parseFloat(entry.deduct-entry.deduct_adj).toFixed(2),
        'total':parseFloat(entry.copay+entry.deduct-entry.copay_adj-entry.deduct_adj).toFixed(2),
        'link':`${config.common.viewUrl}paymentgate?t=`+encodeparams,
    }
    ejs.renderFile(path.join(__dirname, '../../views/', "invoiceemail.ejs"), { body: emaildata }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                from: config.emailaccess.user,
                to: "roswellg@gmail.com",
                subject: subject,
                html: data
            }
            mail.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.status(200).json({ message: "failed" });
                } else {
                    ffs.setemailinvoice(entry);
                    res.status(200).json({ message: "success" });
                }
            });
        }
    });
}
exports.sendinvoicesms = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        id: req.body.id,
        copay: req.body.copay,
        deduct: req.body.deduct,
        copay_adj: req.body.copay_adj,
        deduct_adj: req.body.deduct_adj,
    }
    let clinic = await ffs.getclinic(entry.clinicid)
    let result = await ffs.getinvoicedata(entry);
    let encodeparams = Buffer.from(`${entry.copay.toFixed(2)+"||"+entry.deduct.toFixed(2)+"||"+entry.copay_adj.toFixed(2)+"||"+entry.deduct_adj.toFixed(2)}`+"||"+entry.clinicid+"||"+entry.id).toString('base64');
    
    let phone = await hedis.getPhone(entry.clinicid);
    if(typeof phone[0] == "undefined"||(phone[0]['name'] == "" || phone[0]['name'] == null)){
        res.status(200).json({ message: "pending" });
    }
    else{
        let tmpbody = `
            <div><b>${clinic[0]['name']}</b></div>
            <div><b>#INV-${result[0]['ENC_ID']}-${new Date(result[0]['date']).getMonth()+1}-${new Date(result[0]['date']).getDate()}-${new Date(result[0]['date']).getFullYear()}</b></div>
            <div>INS : ${result[0]['InsName']=="zzznamwe"?"Unknown":result[0]['InsName']}</div>
            <div>DOS : ${new Date(result[0]['date']).getMonth()+1}-${new Date(result[0]['date']).getDate()}-${new Date(result[0]['date']).getFullYear()}</div>
            <div>Visit Type : ${result[0]['VTYPE']}</div>
            ${parseFloat(entry.copay-entry.copay_adj).toFixed(2)>0?"<div>Copay : $"+parseFloat(entry.copay-entry.copay_adj).toFixed(2)+"</div>":""}
            ${parseFloat(entry.deduct-entry.deduct_adj).toFixed(2)>0?"<div>Deduct : $"+parseFloat(entry.deduct-entry.deduct_adj).toFixed(2)+"</div>":""}
            <div><b>Amount Due : $${parseFloat(entry.copay+entry.deduct-entry.copay_adj-entry.deduct_adj).toFixed(2)}</b></div>
            <div><b>Please click the link to pay</b></div>
            <div>${config.common.viewUrl}paymentgate?t=${encodeparams}</div>
        `;
        smsresult = twilio.messages.create({
            from: phone[0]['name'],
            to: "+16464680123",
            body: striptags(tmpbody)
        }).then(message =>
            {if(message.sid != ""&&message.sid != null){
                ffs.setsmsinvoice(entry);
                res.status(200).json({ message: "success" });
            }
            else{
                res.status(200).json({ message: "failed" });
            }});
    }
}
exports.checksid = (req, res, next) => {
    let entry = {
        id: req.body.id,
    }
    ffs.checksid(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.setsid = async (req, res, next) => {
    let entry = {
        sid: req.body.sid,
    }
    // const session = await stripe.checkout.sessions.retrieve(
    //     entry.sid
    // );
    // console.log(session)
    ffs.setsid(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getinvoicestatus = async (req, res, next) => {
    let entry = {
        id: req.body.id,
    }
    let result = await ffs.getinvoicestatus(entry);
    res.status(200).json({ data: result });
}
exports.getmultibill = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let searchparams = await ffs.searchparams(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        type: searchparams.length == 0?1:searchparams[0]['age'],
        spec: searchparams.length == 0?[]:JSON.stringify(searchparams[0]['desc']),
        group: searchparams.length == 0?1:(searchparams[0]['agerange']==0?1:searchparams[0]['agerange']),
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let gcodes = await paid.getgcodessuper();
    var tmpgcodes = [];
    var tmpgcodestring = "('0'";
    for(var i = 0;i < gcodes.length;i++){
        tmpgcodes.push(gcodes[i]['cpt'].trim());
        tmpgcodestring += ",'"+gcodes[i]['cpt'].trim()+"'";
    }
    tmpgcodestring += ")";
    
    let acodes = await ffs.getacodessuper(entry);
    var tmpacodes = [];
    var tmpacodestring = "('0'";
    for(var i = 0;i < acodes.length;i++){
        tmpacodes.push(acodes[i]['CPT'].trim());
        tmpacodestring += ",'"+acodes[i]['CPT'].trim()+"'";
    }
    tmpacodestring += ")";
    
    if(entry.spec.length > 0){
        tmpspecs = entry.spec;
        let cspec = await paid.getcspec();
        var tmpclinics = [];
        var aspecclinics = [parseInt(entry.clinicid)];
        for(var i = 0;i < cspec.length;i++){
            tmpclinics.push({id:cspec[i]['id'],specs:cspec[i]['cspec'].split(",")});
        }
        for(var i=0;i<tmpclinics.length;i++){
            for(var j=0;j<tmpspecs.length;j++){
                if(tmpclinics[i]['specs'].includes(tmpspecs[j])){
                    aspecclinics.push(tmpclinics[i]['id'])
                }
            }
        }
        aspecclinics = [...new Set(aspecclinics)];
    }
    else{
        var aspecclinics = [];
    }
    var tmpaspecclinicstring = "('0'";
    for(var i = 0;i < aspecclinics.length;i++){
        tmpaspecclinicstring += ",'"+aspecclinics[i]+"'";
    }
    tmpaspecclinicstring += ")";

    let nogroupcodes = await ffs.getnogroupcodessuper(entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics)
    let groupcodes = await ffs.getgroupcodessuper(entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics)
    let modgroupcodes = await ffs.getmodgroupcodessuper(entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics)
    for(i=0;i<modgroupcodes.length;i++){
        groupcodes.push(modgroupcodes[i]);
    }
    groupcodes.sort(function (a, b) {
        return a.name.localeCompare(b.name) || (b.subname==null?"zzzz":b.subname).localeCompare((a.subname==null?"zzzz":a.subname)) || a.CPT.localeCompare(b.CPT) || a.InsName.localeCompare(b.InsName);
    });
    let insnames = await ffs.getmultibillins(entry);
    let tmpins = [];
    for(var i = 0;i < insnames.length;i++){
        tmpins.push(insnames[i]['InsName']);
    }
    res.status(200).json({ data: groupcodes,nogroup:nogroupcodes,tmpcode:tmpacodes,ins:tmpins });
}
exports.getdeductiblereport = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
    }
    let bypcp = await ffs.getdeductiblereportbypcp(entry);
    let byins = await ffs.getdeductiblereportbyins(entry);
    
    res.status(200).json({ pcp: bypcp,ins: byins });
}
