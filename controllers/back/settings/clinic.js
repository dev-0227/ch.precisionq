const clinic = require('../../../repositories/back/settings/clinic');
const Acl = require('../../../middleware/acl');

exports.list = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    clinic.list((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.add = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        name: req.body.name,
        acronym: req.body.acronym,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country,
        tel: req.body.tel,
        fax: req.body.fax,
        email: req.body.email,
        web: req.body.web,
        portal: req.body.portal,
        pos: req.body.pos,
        status: req.body.status
    }
    clinic.add(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.update = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        name: req.body.name,
        acronym: req.body.acronym,
        logo: req.body.logo,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        country: req.body.country,
        tel: req.body.tel,
        fax: req.body.fax,
        email: req.body.email,
        web: req.body.web,
        portal: req.body.portal,
        pos: req.body.pos,
        status: req.body.status,
        cname: req.body.cname,
        cemail: req.body.cemail,
        ctel: req.body.ctel,
        ccel: req.body.ccel,
        cex: req.body.cex,
        cweb: req.body.cweb,
    }
    clinic.update(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateVCard = async(req, res, next) => {
    let entry = {
        clinic_id: req.body.clinic_id,
        logo: req.body.logo,
        fonts: req.body.fonts,
        color: req.body.color,
        pattern: req.body.pattern,
        layout: req.body.layout
    }
    clinic.updateVCard(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}



exports.chosen = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    clinic.chosen(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.delete = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    clinic.delete(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatewebcheck = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        value: req.body.value,
    }
    clinic.updatewebcheck(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateportalcheck = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        value: req.body.value,
    }
    clinic.updateportalcheck(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatecontactcheck = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        value: req.body.value,
    }
    clinic.updatecontactcheck(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateapcheck = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        value: req.body.value,
    }
    clinic.updateapcheck(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getclinicmanagers = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        clinicid: req.body.clinicid,
    }
    let result = await clinic.getclinicmanagers();
    let tmpUsers = [];
    for(var i =0;i < result.length;i++){
        if(result[i]['clinic'] != null && result[i]['clinic'] != ""){
            var tmpclinicArr = result[i]['clinic'].split(",");
            if(tmpclinicArr.length == 1 && tmpclinicArr[0] == "0"){
                tmpUsers.push(result[i]);
            }
            else{
                if(tmpclinicArr.includes(entry.clinicid.toString())){
                    tmpUsers.push(result[i]);
                }
            }
        }
        
    }
    res.status(200).json({ managers: tmpUsers });
}
exports.addclinicmanagers = async (req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        clinicid: req.body.clinicid,
        manager: req.body.manager,
    }
    let result = await clinic.addclinicmanagers(entry);
    res.status(200).json({ message: "OK" });
}
exports.chosenclinicmanagers = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'CLINIC_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        clinicid: req.body.clinicid,
    }
    clinic.chosenclinicmanagers(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
