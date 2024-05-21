
const setting = require('../../repositories/back/hedissetting');
const Acl = require('../../middleware/acl');
exports.gethdomain = (req, res, next) => {
    setting.gethdomain((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addhdomain = (req, res, next) => {
    let entry = {
        org: req.body.org,
        type: req.body.type,
        domain: req.body.domain,
    }
    setting.addhdomain(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatehdomain = (req, res, next) => {
    let entry = {
        id: req.body.id,
        org: req.body.org,
        type: req.body.type,
        domain: req.body.domain,
    }
    setting.updatehdomain(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenhdomain = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosenhdomain(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletehdomain = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletehdomain(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}


exports.getmeasure = (req, res, next) => {
    setting.getmeasure((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addmeasure = (req, res, next) => {
    let entry = {
        domain: req.body.domain,
        acronym: req.body.acronym,
        measure: req.body.measure,
        rate: req.body.rate,
        percentage: req.body.percentage,
        gender: req.body.gender,
        quantity: req.body.quantity,
        description: req.body.description,
        age_int: req.body.age_int,
        age_end: req.body.age_end,
        test_span: req.body.test_span,
        time_frame: req.body.time_frame,
        clinic_items: req.body.clinic_items,
        date_type: req.body.date_type,
        time_duration: req.body.time_duration,
        variables: req.body.variables
    }
    setting.addmeasure(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatemeasure = (req, res, next) => {
    let entry = {
        id: req.body.id,
        domain: req.body.domain,
        acronym: req.body.acronym,
        measure: req.body.measure,
        rate: req.body.rate,
        percentage: req.body.percentage,
        gender: req.body.gender,
        quantity: req.body.quantity,
        description: req.body.description,
        age_int: req.body.age_int,
        age_end: req.body.age_end,
        test_span: req.body.test_span,
        time_frame: req.body.time_frame,
        clinic_items: req.body.clinic_items,
        date_type: req.body.date_type,
        time_duration: req.body.time_duration,
        variables: req.body.variables
    }
    setting.updatemeasure(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenmeasure = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosenmeasure(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletemeasure = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletemeasure(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateoutcome = (req, res, next) => {
    let entry = {
        id: req.body.id,
        value: req.body.value,
    }
    setting.updateoutcome(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatemeasureyearly = (req, res, next) => {
    let entry = {
        id: req.body.id,
        value: req.body.value,
    }
    setting.updatemeasureyearly(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getoutranges = (req, res, next) => {
    let entry = {
        id: req.body.id,
    }
    setting.getoutranges(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addoutrangevalue = (req, res, next) => {
    let entry = {
        id: req.body.id,
        name: req.body.name,
        v1: req.body.v1,
        v2: req.body.v2,
    }
    setting.addoutrangevalue(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            setting.getoutranges(entry, (err, result) => {
                if (err) {
                    res.status(404).json(err);
                } else {
                    res.status(200).json({ data: result });
                }
            });
        }
    });
}
exports.deleteoutrangevalue = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deleteoutrangevalue(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}



exports.getcim = (req, res, next) => {
    setting.getcim((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addcim = (req, res, next) => {
    let entry = {
        m_id: req.body.m_id,
        it_id: req.body.it_id,
        desc: req.body.desc,
        value: req.body.value,
        gender: req.body.gender,
        age_from: req.body.age_from,
        age_to: req.body.age_to,
        cpt1: req.body.cpt1,
        cpt2: req.body.cpt2,
        icd1: req.body.icd1,
        icd2: req.body.icd2,
        icd3: req.body.icd3,
        icd4: req.body.icd4,
        icd5: req.body.icd5,
        locin1: req.body.locin1,
        locin2: req.body.locin2,
        locin3: req.body.locin3,
    }
    setting.addcim(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatecim = (req, res, next) => {
    let entry = {
        id: req.body.id,
        m_id: req.body.m_id,
        it_id: req.body.it_id,
        desc: req.body.desc,
        value: req.body.value,
        gender: req.body.gender,
        age_from: req.body.age_from,
        age_to: req.body.age_to,
        cpt1: req.body.cpt1,
        cpt2: req.body.cpt2,
        icd1: req.body.icd1,
        icd2: req.body.icd2,
        icd3: req.body.icd3,
        icd4: req.body.icd4,
        icd5: req.body.icd5,
        locin1: req.body.locin1,
        locin2: req.body.locin2,
        locin3: req.body.locin3,
    }
    setting.updatecim(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosencim = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosencim(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletecim = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletecim(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatecimrange = (req, res, next) => {
    let entry = {
        id: req.body.id,
        value: req.body.value,
    }
    setting.updatecimrange(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getcimranges = (req, res, next) => {
    let entry = {
        id: req.body.id,
    }
    setting.getcimranges(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addcimrangevalue = (req, res, next) => {
    let entry = {
        id: req.body.id,
        name: req.body.name,
        v1: req.body.v1,
        v2: req.body.v2,
    }
    setting.addcimrangevalue(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            setting.getcimranges(entry, (err, result) => {
                if (err) {
                    res.status(404).json(err);
                } else {
                    res.status(200).json({ data: result });
                }
            });
        }
    });
}
exports.deletecimrangevalue = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletecimrangevalue(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.gethdate = (req, res, next) => {
    setting.gethdate((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatehdate = (req, res, next) => {
    let entry = {
        date: req.body.date
    }
    setting.updatehdate(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getcolor = (req, res, next) => {
    setting.getcolor((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addcolor = (req, res, next) => {
    let entry = {
        name: req.body.name,
        acronym: req.body.acronym,
        desc: req.body.desc,
        type: req.body.type,
        cat: req.body.cat,
        status: req.body.status,
        tcolor: req.body.tcolor,
        bcolor: req.body.bcolor,
        check: req.body.check,
    }
    setting.addcolor(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatecolor = (req, res, next) => {
    let entry = {
        id: req.body.id,
        name: req.body.name,
        acronym: req.body.acronym,
        desc: req.body.desc,
        type: req.body.type,
        cat: req.body.cat,
        status: req.body.status,
        tcolor: req.body.tcolor,
        bcolor: req.body.bcolor,
        check: req.body.check,
    }
    setting.updatecolor(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosencolor = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosencolor(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletecolor = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletecolor(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getimeasure = (req, res, next) => {
    setting.getimeasure((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addimeasure = (req, res, next) => {
    let entry = {
        name: req.body.name,
        desc: req.body.desc,
    }
    setting.addimeasure(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateimeasure = (req, res, next) => {
    let entry = {
        id: req.body.id,
        name: req.body.name,
        desc: req.body.desc,
    }
    setting.updateimeasure(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenimeasure = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosenimeasure(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deleteimeasure = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deleteimeasure(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getnmeasure = async (req, res, next) => {
    let result = await setting.getnmeasure();
    let defined = await setting.getdefinedmeasure();
    let tmpresult = [];
    for(var i = 0;i< result.length;i++){
        var tmpcnt = 0;
        for(var j = 0;j< defined.length;j++){
            if(defined[j]['keywords'].includes(result[i]['measure'])){
                tmpcnt++;
                break;
            }
        }
        if(tmpcnt == 0){
            tmpresult.push(result[i]);
        }
    }
    res.status(200).json({ data: tmpresult });
}
exports.deletenmeasure = (req, res, next) => {
    let entry = {
        measure: req.body.measure
    }
    setting.deletenmeasure(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.applymeasure = (req, res, next) => {
    let entry = {
        id: req.body.id,
        variable: req.body.variable
    }
    setting.applymeasure(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getmtime = (req, res, next) => {
    setting.getmtime((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addmtime = (req, res, next) => {
    let entry = {
        name: req.body.name,
        desc: req.body.desc,
        type: req.body.type,
        range: req.body.range,
    }
    setting.addmtime(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatemtime = (req, res, next) => {
    let entry = {
        id: req.body.id,
        name: req.body.name,
        desc: req.body.desc,
        type: req.body.type,
        range: req.body.range,
    }
    setting.updatemtime(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenmtime = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosenmtime(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletemtime = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletemtime(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getfilenames = (req, res, next) => {
    setting.getfilenames((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addfilename = (req, res, next) => {
    let entry = {
        insid: req.body.insid,
        value: req.body.value,
        filetype: req.body.filetype,
        filedefinition: req.body.filedefinition,
    }
    setting.addfilename(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletefilename = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletefilename(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatefilename = (req, res, next) => {
    let entry = {
        id: req.body.id,
        value: req.body.value,
        filetype: req.body.filetype,
        filedefinition: req.body.filedefinition,
    }
    setting.updatefilename(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenfilename = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosenfilename(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getfieldlists = (req, res, next) => {
    let entry = {
        filename: req.body.filename
    }
    setting.getfieldlists(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addfield = (req, res, next) => {
    let entry = {
        filename: req.body.filename,
        fieldname: req.body.fieldname,
        fieldtype: req.body.fieldtype,
        fieldformat: req.body.fieldformat,
        required: req.body.required,
    }
    setting.addfield(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletefield = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletefield(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.editfield = async (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    let chosenfiled = await setting.editfield(entry);
    res.status(200).json({ data: chosenfiled });
}
exports.updatefield = (req, res, next) => {
    let entry = {
        id: req.body.id,
        filename: req.body.filename,
        fieldname: req.body.fieldname,
        fieldtype: req.body.fieldtype,
        fieldformat: req.body.fieldformat,
        required: req.body.required,
        mapfield: req.body.mapfield,
    }
    setting.updatefield(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.setPosfield = async (req, res, next) => {
    let entry = {
        field_idarray: req.body.field_idarray,
    }
    let result = await setting.setPosfield(entry);
    res.status(200).json({ data: result });
}
exports.getfilealiases = (req, res, next) => {
    setting.getfilealiases((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatefilealiases = (req, res, next) => {
    let entry = {
        id: req.body.id,
        value: req.body.value
    }
    setting.updatefilealiases(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ message: "OK" });
        }
    });
}
exports.getidomain = (req, res, next) => {
    setting.getidomain((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addidomain = (req, res, next) => {
    let entry = {
        insid: req.body.insid,
        domain: req.body.domain,
        desc: req.body.desc,
    }
    setting.addidomain(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateidomain = (req, res, next) => {
    let entry = {
        id: req.body.id,
        insid: req.body.insid,
        domain: req.body.domain,
        desc: req.body.desc,
    }
    setting.updateidomain(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenidomain = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosenidomain(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deleteidomain = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deleteidomain(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
    
}

exports.qppMeasuresData = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'HEDIS_QPP_MEASURES_DATA');
    if(!can)return res.status(200).json({ data: [] });
    let entry = {
        eyear: req.query.eyear
    }
    setting.qppMeasuresData(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}


exports.qppMeasuresDataById = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'HEDIS_QPP_MEASURES_DATA');
    if(!can)return res.status(200).json({ data: [] });
    let entry = {
        id: req.body.id
    }
    setting.qppMeasuresDataById(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getYearsQppMeasuresData = (req, res, next) => {
    setting.getYearsQppMeasuresData([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}


exports.importQppMeasuresData = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    if(!can)return res.status(405).json('Not Permission');
    let filePath = req.files[0].path;
    var qppMeasuresData = require(filePath);
    let entry = {
        year: req.body.year,
        data: qppMeasuresData
    }
    setting.importQppMeasuresData(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.measuresData = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['read'], 'HEDIS_MEASURES_DATA');
    // if(!can)return res.status(200).json({ data: [] });
    setting.measuresData({}, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.measuresDataById = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['read'], 'HEDIS_MEASURES_DATA');
    // if(!can)return res.status(200).json({ data: [] });
    let entry = {
        id: req.body.id
    }
    setting.measuresDataById(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.addMeasureaData = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['read'], 'HEDIS_MEASURES_DATA');
    // if(!can)return res.status(200).json({ data: [] });
    setting.addMeasureaData(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });

}

exports.updateMeasureaData = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['read'], 'HEDIS_MEASURES_DATA');
    // if(!can)return res.status(200).json({ data: [] });
    setting.updateMeasureaData(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.deleteMeasureaData = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['read'], 'HEDIS_MEASURES_DATA');
    // if(!can)return res.status(200).json({ data: [] });
    setting.deleteMeasureaData(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.importMeasuresData = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['read'], 'HEDIS_MEASURES_DATA');
    // if(!can)return res.status(200).json({ data: [] });
    let entry = {
        id: req.body.mid
    }
    setting.qppMeasuresDataById(entry, (err, result) => {
        if (err || result.length==0) {
            res.status(404).json(err);
        } else {
            setting.addMeasureaData(result[0], (err, result) => {
                if (err) {
                    res.status(404).json(err);
                } else {
                    res.status(200).json({ data: result });
                }
            });
        }
    });
}

exports.vsPublicationState = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    // if(!can)return res.status(405).json('Not Permission');

    setting.vsPublicationState([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.vsJurisdiction = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    // if(!can)return res.status(405).json('Not Permission');

    setting.vsJurisdiction([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.vsObservationCategory = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    // if(!can)return res.status(405).json('Not Permission');

    setting.vsObservationCategory([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.vsSpecimenType = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    // if(!can)return res.status(405).json('Not Permission');

    setting.vsSpecimenType([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.vsPermittedDataType = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    // if(!can)return res.status(405).json('Not Permission');

    setting.vsPermittedDataType([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.csCalendarCycle = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    // if(!can)return res.status(405).json('Not Permission');

    setting.csCalendarCycle([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.addMeasureObservation = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    // if(!can)return res.status(405).json('Not Permission');
    let entry = {
        mid: req.body.mid,
        name: req.body.name,
        report_name: req.body.report_name,
        title: req.body.title,
        multiple: req.body.multiple,
        quantity: req.body.quantity,
        description: req.body.description,
        status: req.body.status,
        ldate: req.body.ldate,
        publisher: req.body.publisher,
        url: req.body.url,
        jurisdiction: req.body.jurisdiction,
        purpose: req.body.purpose,
        category: req.body.category,
        specimen_type: req.body.specimen_type,
        permitted_data_type: req.body.permitted_data_type,
        calendar_cycle: req.body.calendar_cycle,
        calendar_length: req.body.calendar_length,
        qualified: req.body.qualified,
        acronym: req.body.acronym,
        icd: req.body.icd,
        cpt: req.body.cpt,
        hcpcs: req.body.hcpcs,
        loinc: req.body.loinc,
        snomed: req.body.snomed,
        map: req.body.map,
        min_age: req.body.min_age,
        max_age: req.body.max_age,
        time_cycle: req.body.time_cycle,
        ins_acronym: req.body.ins_acronym,
    }
    setting.addMeasureObservation(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.updateMeasureObservation = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    // if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        mid: req.body.mid,
        name: req.body.name,
        report_name: req.body.report_name,
        title: req.body.title,
        multiple: req.body.multiple,
        quantity: req.body.quantity,
        description: req.body.description,
        status: req.body.status,
        ldate: req.body.ldate,
        publisher: req.body.publisher,
        url: req.body.url,
        jurisdiction: req.body.jurisdiction,
        purpose: req.body.purpose,
        category: req.body.category,
        specimen_type: req.body.specimen_type,
        permitted_data_type: req.body.permitted_data_type,
        calendar_cycle: req.body.calendar_cycle,
        calendar_length: req.body.calendar_length,
        qualified: req.body.qualified,
        acronym: req.body.acronym,
        icd: req.body.icd,
        cpt: req.body.cpt,
        hcpcs: req.body.hcpcs,
        loinc: req.body.loinc,
        snomed: req.body.snomed,
        map: req.body.map,
        min_age: req.body.min_age,
        max_age: req.body.max_age,
        time_cycle: req.body.time_cycle,
        ins_acronym: req.body.ins_acronym,
    }
    setting.updateMeasureObservation(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getMeasureObservation = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    // if(!can)return res.status(405).json('Not Permission');
    setting.getMeasureObservation({}, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.deleteMeasureObservation = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    // if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    setting.deleteMeasureObservation(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getMeasureObservationById = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'HEDIS_QPP_MEASURES_DATA');
    // if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    setting.getMeasureObservationById(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getMeasureObservationByMeasure = async(req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.getMeasureObservationByMeasure(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getstatusreason = (req, res, next) => {
    setting.getstatusreason((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getstatuscode = (req, res, next) => {
    setting.getstatuscode((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getcategorycode = (req, res, next) => {
    setting.getcategorycode((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.gettopiccode = (req, res, next) => {
    setting.gettopiccode((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getmediumcode = (req, res, next) => {
    setting.getmediumcode((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getprioritycode = (req, res, next) => {
    setting.getprioritycode((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getedcategorycode = (req, res, next) => {
    setting.getedcategorycode((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getcomcategorycode = (req, res, next) => {
    setting.getcomcategorycode((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}








