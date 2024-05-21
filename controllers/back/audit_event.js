const audit_event = require('../../repositories/back/audit_event');
const Acl = require('../../middleware/acl');

exports.logger = async(req, res, next) => {
    
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
    }
    audit_event.logger(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}





