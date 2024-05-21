const role = require('../../../repositories/back/settings/vital');
const event = require('../../../repositories/back/event');
const Acl = require('../../../middleware/acl');
exports.list = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'SETTING_VITAL_INFO');
    if(!can)return res.status(200).json({ data: [] });
    role.list((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
    
}

exports.add = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'SETTING_VITAL_INFO');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        vname: req.body.name,
        vdescription: req.body.description,
        vdescription: req.body.description,
        LOINC: req.body.code.toString().trim(),
        LOINC_Name: req.body.comment,
        UCUM_Units: req.body.unit,
        SNOMED: req.body.snomed,
        ECL: req.body.ecl,
    }
    role.add(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            entry = {
                user_id: req.body.user_id,
                type_id: 11, //Patient Record
                subtype_id: 38, //create
                outcome_id: 5, //'success',
                action_id: 1, //'Create',
                description: 'Added vital',
                model_name: 'f_vital',
                model_id: result.insertId
            }
            event.logger(entry);
            res.status(200).json({ data: result });
        }
    });
}

exports.chosen = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'SETTING_VITAL_INFO');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    role.chosen(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.update = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'SETTING_VITAL_INFO');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        vname: req.body.name,
        vdescription: req.body.description,
        vdescription: req.body.description,
        LOINC: req.body.code.toString().trim(),
        LOINC_Name: req.body.comment,
        UCUM_Units: req.body.unit,
        SNOMED: req.body.snomed,
        ECL: req.body.ecl,
    }
    role.update(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            entry = {
                user_id: req.body.user_id,
                type_id: 11, //Patient Record
                subtype_id: 31, //Update
                outcome_id: 5, //'success',
                action_id: 3, //'Update',
                description: "Updated vital",
                model_name: 'f_vital',
                model_id: req.body.id
            }
            event.logger(entry);
            res.status(200).json({ data: result });
        }
    });
}

exports.delete = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'SETTING_VITAL_INFO');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    role.delete(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
