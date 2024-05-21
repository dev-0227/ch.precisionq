const specialist = require('../../../repositories/back/settings/specialist');
const Acl = require('../../../middleware/acl');
const manager = require('../../../repositories/back/manager');
const xlsx = require('node-xlsx');
const xls = require('xlsx');

if(typeof String.prototype.replaceAll === "undefined") {
    String.prototype.replaceAll = function(match, replace) {
       return this.replace(new RegExp(match, 'g'), () => replace);
    }
}
exports.list = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    specialist.list(req.query, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json(result);
        }
    });
}
exports.add = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'USER_MANAGE');
    // if(!can)return res.status(405).json('Not Permission');
    let entry = {
        fname: req.body.fname,
        lname: req.body.lname,
        mname: req.body.mname,
        plocation: req.body.plocation,
        speciality: req.body.speciality,
        npi: req.body.npi,
        license: req.body.license,
        email: req.body.email,
        tel: req.body.tel,
        cel: req.body.cel,
        address: req.body.address,
        fax: req.body.fax,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        cname: req.body.cname,
        cemail: req.body.cemail,
        ccel: req.body.ccel,
        type: 3,
        specialty_id: req.body.specialty_id,
        insurance_id: req.body.insurance_id,
        status: 1
    }
    let check = await manager.checkuser(entry.email);
    if(check.length == 0){
        specialist.add(entry, (err, result) => {
            if (err) {
                res.status(404).json(err);
            } else {
                res.status(200).json({ data: result });
            }
        });
    }
    else{
        res.status(200).json({ data: "existed" });
    }
    
}
exports.update = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['write'], 'USER_MANAGE');
    // if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        fname: req.body.fname,
        lname: req.body.lname,
        mname: req.body.mname,
        plocation: req.body.plocation,
        speciality: req.body.speciality,
        npi: req.body.npi,
        license: req.body.license,
        email: req.body.email,
        tel: req.body.tel,
        cel: req.body.cel,
        address: req.body.address,
        fax: req.body.fax,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        cname: req.body.cname,
        cemail: req.body.cemail,
        ccel: req.body.ccel,
        type: 3,
        status: req.body.status,
        specialty_id: req.body.specialty_id,
        insurance_id: req.body.insurance_id,
        taxonomy: req.body.taxonomy
    }
    specialist.update(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosen = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    specialist.chosen(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.delete = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'USER_MANAGE');
    // if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    specialist.delete(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatepwd = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        pwd: req.body.pwd,
    }
    specialist.updatepwd(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateanswer = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        question_id: req.body.question_id,
        answer: req.body.answer,
    }
    specialist.updateanswer(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateclinics = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['write'], 'USER_MANAGE');
    // if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        clinics: req.body.clinics,
    }
    specialist.updateclinics(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getSpecialistByClinic = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    specialist.getSpecialistByClinic(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

function getKey(fname, lname, phone){
    var key = fname?fname.toString().split(" ")[0]:"";
    key += lname?lname.toString().split(" ")[0]:"";
    key += phone?phone:"";
    return key;
}

exports.import = async (req, res, next) => {
    var datas = xls.readFile(req.files[0].path);
    var sheet_name_list = datas.SheetNames;
    var xData = xls.utils.sheet_to_json(datas.Sheets[sheet_name_list[0]]);

    specialist.import(xData, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

// exports.import = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'USER_MANAGE');
    // if(!can)return res.status(405).json('Not Permission');
    // var list = await specialist.getSpecialist();
    // var specialty = await specialist.getSpecialty();
    // let filePath = req.files[0].path;
    // const workSheetsFromFile = xlsx.parse(filePath);
    // var rows = workSheetsFromFile[0].data;

    // if (rows[0][0] == 'clinicID' && rows[0][1] == 'measureID')delete rows[0];

    // specialist.import(rows, (err, result) => {
    //     if (err) result.status(404).json(err);
    //     else result.status(200).json({data: result});
    // })

    // let sp_list = []

    // for(var k=0; k<list.length; k++){
    //     var sp_key = getKey(list[k]['fname'], list[k]['lname'], list[k]['phone']);
    //     sp_list[sp_key]= "1";
    // }

    // let sp = []
    // var j=0;
    // for(var i = 0; i < rows.length;i++){
    //     if(i==0)continue;
    //     if(!rows[i])continue;
    //     var key = getKey(rows[i][4], rows[i][6], rows[i][7]);
    //     if(sp_list[key])continue;
    //     var specialty_text = rows[i][3]?rows[i][3].replaceAll(" ", "").toLowerCase():"";
        
    //     var specialty_id = '';
    //     for(var k=0; k<specialty.length; k++){
    //         var specialty_name = specialty[k]['name']?specialty[k]['name'].replaceAll(" ", "").toLowerCase():"";
    //         specialty_name += specialty[k]['map']?specialty[k]['map'].replaceAll(" ", "").toLowerCase():"";
    //         if(specialty_name!="")
    //             if(specialty_name.includes(specialty_text)){
    //                 specialty_id = specialty[k]['id'];
    //                 // console.log(specialty_id);
    //             }
    //     }
        
    //     if(sp[key]){
    //         if(!sp[key][3].includes(rows[i][3])){
    //             sp[key][3] += ','+rows[i][3];
    //             sp[key][18] += ','+specialty_id;
                
    //         }
    //     }else{
    //         rows[i][18] = specialty_id
    //         sp[key] = rows[i];

    //     }
    //     j++;
    // }
    
    // let entry = {
    //     data: sp
    // }
    // specialist.import(entry, (err, result) => {
    //     if (err) {
    //         res.status(404).json(err);
    //     } else {
    //         res.status(200).json({ data: result });
    //     }
    // });
    
// }
