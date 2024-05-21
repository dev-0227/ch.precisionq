const setting = require('../../repositories/back/setting');
const config = require('../../config');
let ejs = require("ejs");
let path = require("path");
var nodemailer = require('nodemailer');
var mail = nodemailer.createTransport({
    host: config.emailaccess.host,
    port: config.emailaccess.port,
    secure: false,
    auth: {
        user: config.emailaccess.user,
        pass: config.emailaccess.password,
    }
});
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
exports.getquestions = (req, res, next) => {
    setting.getquestions((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getstripe = (req, res, next) => {
    res.status(200).json({ data: config.stripe.pkey });
}
exports.getallquestions = (req, res, next) => {
    setting.getallquestions((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getallvkey = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    setting.getallvkey(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getallrole = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    setting.getallrole(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getallworkpc = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    setting.getallworkpc(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addsq = (req, res, next) => {
    let entry = {
        question: req.body.question,
        status: req.body.status,
    }
    setting.addsq(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatesq = (req, res, next) => {
    let entry = {
        id: req.body.id,
        question: req.body.question,
        status: req.body.status,
    }
    setting.updatesq(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosensq = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosensq(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletesq = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletesq(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addvkey = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        name: req.body.name,
        status: req.body.status,
    }
    setting.addvkey(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatevkey = (req, res, next) => {
    let entry = {
        id: req.body.id,
        name: req.body.name,
        status: req.body.status,
    }
    setting.updatevkey(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenvkey = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosenvkey(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletevkey = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletevkey(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addrole = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        name: req.body.name,
        status: req.body.status,
    }
    setting.addrole(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updaterole = (req, res, next) => {
    let entry = {
        id: req.body.id,
        name: req.body.name,
        status: req.body.status,
    }
    setting.updaterole(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenrole = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosenrole(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deleterole = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deleterole(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addworkpc = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        name: req.body.name,
    }
    setting.addworkpc(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deleteworkpc = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deleteworkpc(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getchoseninsurances = (req, res, next) => {
    setting.getchoseninsurances((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.gethedisyear = (req, res, next) => {
    setting.gethedisyear((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.gethediscolor = (req, res, next) => {
    setting.gethediscolor((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getdatehedisloaded = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        insid: req.body.insid,
    }
    setting.getdatehedisloaded(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getoutputbtn = (req, res, next) => {
    let entry = {
        insid: req.body.insid,
    }
    setting.getoutputbtn(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getchosenclinics = (req, res, next) => {
    let entry = {
        id: req.user.id
    }
    setting.getchosenclinics(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.allclinic = async (req, res, next) => {
    setting.allClinic((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getClinicins = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        insid: req.body.insid,
    }
    let clinic = await setting.getchosenclinic(entry.clinicid);
    let ins = await setting.getchosenins(entry.insid);
    res.status(200).json({ clinic: clinic[0]?clinic[0]['name']:"",ins: ins[0]?ins[0]['insName']:"" });
}
exports.getClinic = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let clinic = await setting.getchosenclinic(entry.clinicid);
    res.status(200).json({ clinic: clinic[0]['name'],address: clinic[0]['address1']+" "+clinic[0]['address2'],city:clinic[0]['city'],state:clinic[0]['state'],zip:clinic[0]['zip'],phone:clinic[0]['phone'],email:clinic[0]['email'],web:clinic[0]['web'],ex:clinic[0]['ex'] });
}
exports.getPhone = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await setting.getPhone(entry.clinicid);
    res.status(200).json({ data: result });
}
exports.getLogoaddress = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await setting.getLogoaddress(entry.clinicid);
    res.status(200).json({ data: result });
}
exports.getPriceSMS = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await setting.getPriceSMS(entry.clinicid);
    res.status(200).json({ data: result });
}
exports.getPricecall = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await setting.getPricecall(entry.clinicid);
    res.status(200).json({ data: result });
}
exports.getcallactive = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await setting.getcallactive(entry.clinicid);
    res.status(200).json({ data: result });
}
exports.getAutoAmountSMS = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await setting.getAutoAmountSMS(entry.clinicid);
    res.status(200).json({ data: result });
}
exports.getAutopayment = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await setting.getAutopayment(entry.clinicid);
    res.status(200).json({ data: result });
}
exports.updatePriceSMS = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        price: req.body.price,
    }
    let result = await setting.updatePriceSMS(entry.price,entry.clinicid);
    res.status(200).json({ data: result });
}
exports.updatePricecall = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        price: req.body.price,
    }
    let result = await setting.updatePricecall(entry.price,entry.clinicid);
    res.status(200).json({ data: result });
}
exports.updateRepAmountSMS = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        price: req.body.price,
    }
    let result = await setting.updateRepAmountSMS(entry.price,entry.clinicid);
    res.status(200).json({ data: result });
}
exports.updateRepCountsSMS = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        price: req.body.price,
    }
    let result = await setting.updateRepCountsSMS(entry.price,entry.clinicid);
    res.status(200).json({ data: result });
}
exports.updatePhone = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        price: req.body.price,
        number: req.body.number,
    }
    let result = await setting.updatePhone(entry);
    res.status(200).json({ data: result });
}
exports.updateActivatesms = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        value: req.body.value,
    }
    let result = await setting.updateActivatesms(entry);
    res.status(200).json({ data: result });
}
exports.updateActivatecall = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        value: req.body.value,
    }
    setting.updateActivatecall(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateAutopayment = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        value: req.body.value,
    }
    let result = await setting.updateAutopayment(entry);
    res.status(200).json({ data: result });
}
exports.getavaiuserchosenclinic = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await setting.getavaiuserchosenclinic(entry);
    let tmpresult = [];
    for(var i = 0;i < result.length;i++){
        tmpclinics = result[i]['clinic']==null?[]:result[i]['clinic'].split(",");
        if(tmpclinics.length == 1&&tmpclinics[0] == "0"){
            tmpresult.push(result[i]);
        }
        else if(tmpclinics.includes(entry.clinicid)){
            tmpresult.push(result[i]);
        }
    }
    res.status(200).json({ data: tmpresult });
}
exports.getLanguage = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await setting.getLanguage(entry);
    res.status(200).json({ data: result });
}
exports.getHedisalerts = async (req, res, next) => {
    let entry = {
        type: req.body.type,
        langid: req.body.langid,
    }
    let result = await setting.getHedisalerts(entry);
    res.status(200).json({ data: result });
}
exports.setHedisalerts = async (req, res, next) => {
    let entry = {
        type: req.body.type,
        langid: req.body.langid,
        id: req.body.id,
        subject: req.body.subject,
        body: req.body.body,
    }
    setting.setHedisalerts(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getptinfo = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        ptid: req.body.ptid,
    }
    let result = await setting.getptinfo(entry);
    res.status(200).json({ data: result });
}
exports.contact = async (req, res, next) => {
    let entry = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        message: req.body.message,
    }
    let result = await setting.contact(entry);
    res.status(200).json({ status: "success" });
}
exports.getcontacts = (req, res, next) => {
    setting.getcontacts((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getcontactquestions = (req, res, next) => {
    setting.getcontactquestions((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addcontactq = (req, res, next) => {
    let entry = {
        question: req.body.question,
        status: req.body.status,
    }
    setting.addcontactq(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatecontactq = (req, res, next) => {
    let entry = {
        id: req.body.id,
        question: req.body.question,
        status: req.body.status,
    }
    setting.updatecontactq(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosencontactq = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosencontactq(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletecontactq = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletecontactq(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletecontact = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletecontact(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getcredithistory = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid
    }
    setting.getcredithistory(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getcontactr = (req, res, next) => {
    setting.getcontactr((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addcontactr = (req, res, next) => {
    let entry = {
        name: req.body.name,
        status: req.body.status,
    }
    setting.addcontactr(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosencontactr = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosencontactr(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatecontactr = (req, res, next) => {
    let entry = {
        id: req.body.id,
        value: req.body.value
    }
    setting.updatecontactr(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ message: "OK" });
        }
    });
}
exports.deletecontactr = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletecontactr(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}


exports.getcontactm = (req, res, next) => {
    setting.getcontactm((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addcontactm = (req, res, next) => {
    let entry = {
        name: req.body.name,
        status: req.body.status,
    }
    setting.addcontactm(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatecontactm = (req, res, next) => {
    let entry = {
        id: req.body.id,
        name: req.body.name,
        status: req.body.status,
    }
    setting.updatecontactm(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosencontactm = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosencontactm(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletecontactm = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletecontactm(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.generatemodule = (req, res, next) => {
    let entry = {
        id: req.body.id,
        quiz: req.body.quiz,
        res: req.body.res
    }
    setting.generatemodule(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getmodules = async (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    let result = await setting.getmodules(entry);
    tmpquiz = "("+result[0]['quiz']+")"
    tmpres = "("+result[0]['res']+")"
    let aquiz = await setting.getaquiz(tmpquiz);
    let ares = await setting.getares(tmpres);
    
    let tmpresult = {
        id:result[0]['id'],
        name:result[0]['name'],
        quiz:result[0]['quiz'],
        res:result[0]['res'],
        tmpquiz:aquiz,
        tmpres:ares,
    }
    res.status(200).json({ data: tmpresult });
}
exports.addconnection = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        contacttype: req.body.contacttype,
        pttype: req.body.pttype,
        fname: req.body.fname,
        lname: req.body.lname,
        mname: req.body.mname,
        dob: req.body.dob,
        lang: req.body.lang,
        email: req.body.email,
        phone1: req.body.phone1,
        phone2: req.body.phone2,
        question: req.body.question,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        dates: req.body.dates,
        times: req.body.times
    }
    let result = await setting.addconnection(entry);
    let getEmails = await setting.getqrcodetype(entry.clinicid);
    let clinic = await setting.getchosenclinic(entry.clinicid);
    let emailArr = "";
    if(getEmails[0]['desc'] == "" || getEmails[0]['desc'] == null)
        emailArr = "roswellg@gmail.com";
    else
        emailArr = getEmails[0]['desc'];

    let subject = "#"+generateString(10)+" - New Conact Form From "+clinic[0]['name'];
    let apptitem = [];
    if(entry.contacttype == 1){
        for(var i = 0;i < entry.dates.length;i++){
            var tmptimes = entry.times[i].split("|");
            for(var j = 1;j < tmptimes.length;j++){
                apptitem.push({date:entry.dates[i],time:tmptimes[j]});
            }
        }
    }
    let emaildata = {
        contacttype:entry.contacttype,
        pttype:entry.pttype == 1?"New Patient":entry.pttype == 2?"Returning Patient":"Established Patient",
        ptname:entry.fname+" "+entry.mname+" "+entry.lname,
        dob:entry.dob,
        lang:entry.lang == 1?"English":"Spanish",
        phone1:entry.phone1,
        phone2:entry.phone2,
        email:entry.email,
        address:entry.address1+" "+entry.address2+" "+entry.city+" "+entry.state+" "+entry.zip,
        question:entry.question,
        week:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
        month:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        apptitem:apptitem
    }
    ejs.renderFile(path.join(__dirname, '../../views/', "connectionemail.ejs"), { body: emaildata }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                from: config.emailaccess.user,
                to: emailArr,
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
exports.updateconnectiondesctype = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        value: req.body.value,
    }
    let result = await setting.updateconnectiondesctype(entry);
    res.status(200).json({ data: result });
}
exports.updateqrcodevalue = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        value: req.body.value,
    }
    let result = await setting.updateqrcodevalue(entry);
    res.status(200).json({ data: result });
}
exports.updateqrcodeemails = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        value: req.body.value,
    }
    let result = await setting.updateqrcodeemails(entry);
    res.status(200).json({ data: result });
}
exports.updateconnectiondesc = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        gdesc: req.body.gdesc,
        sdesc: req.body.sdesc,
    }
    await setting.updateconnectiondesc(entry);
    let result = await setting.updateconnectiongdesc(entry.gdesc);
    res.status(200).json({ data: result });
}
exports.getconnectiondesc = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid
    }
    let gdesc = await setting.getcgdesc();
    let sdesc = await setting.getcsdesc(entry.clinicid);
    res.status(200).json({ gdesc: gdesc,sdesc: sdesc });
}
exports.getqrcodetype = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid
    }
    let qrcodetype = await setting.getqrcodetype(entry.clinicid);
    res.status(200).json({ result: qrcodetype });
}


exports.getconnections = (req, res, next) => {
    let entry = {
        clinicid:req.body.clinicid
    }
    setting.getconnections(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deleteconnections = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deleteconnections(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenconnection = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosenconnection(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.addtwiliosubaccount = (req, res, next) => {

    var bytes  = CryptoJS.AES.decrypt(req.body.ciphertext, 'roslong2023');
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    console.log("decryptedData")
    console.log(decryptedData)
    let dgkey = 'roslongenc2023'
    let entry = {
        cid: decryptedData.clid,
        cphone: CryptoJS.AES.encrypt(decryptedData.cphone,dgkey ) .toString() ,
        csid: CryptoJS.AES.encrypt(decryptedData.csid, dgkey).toString() ,
        ctoken: CryptoJS.AES.encrypt(decryptedData.ctoken, dgkey).toString() ,
        tapikey:CryptoJS.AES.encrypt(decryptedData.twapikey, dgkey).toString() ,
        tapisec:CryptoJS.AES.encrypt(decryptedData.twapisec, dgkey).toString() ,
        tappsid:CryptoJS.AES.encrypt(decryptedData.twappsid, dgkey).toString() ,
        identity:CryptoJS.AES.encrypt(decryptedData.identity, dgkey).toString() ,
    }
    console.log(entry)
    setting.addtwiliosubaccount(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.gettwiliosubaccount = (req, res, next) => {
    let entry = {
        cid: req.body.clid,
    }
    setting.gettwiliosubaccount(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getAppointmentDoctorType = (req, res, next) => {
    setting.getAppointmentDoctorType(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.setAppointmentDoctorType = (req, res, next) => {
    setting.setAppointmentDoctorType(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}