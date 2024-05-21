const diagnostic = require('../../.././repositories/back/settings/diagnosticprocedures');
const event = require('../../.././repositories/back/event');
const Acl = require('../../.././middleware/acl');
exports.list = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'SETTING_DIAGNOSTIC_PROCEDURES');
    if(!can)return res.status(200).json({ data: [] });
    diagnostic.list((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
    
}

exports.create = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'SETTING_DIAGNOSTIC_PROCEDURES');
    if(!can)return res.status(405).json('Not Permission');
    diagnostic.create(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.chosen = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'SETTING_DIAGNOSTIC_PROCEDURES');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    diagnostic.chosen(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.update = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'SETTING_DIAGNOSTIC_PROCEDURES');
    if(!can)return res.status(405).json('Not Permission');
    diagnostic.update(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.delete = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'SETTING_DIAGNOSTIC_PROCEDURES');
    if(!can)return res.status(405).json('Not Permission');
    diagnostic.delete(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
