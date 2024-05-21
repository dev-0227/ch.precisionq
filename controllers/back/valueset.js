const valueSet = require('../../repositories/back/valueset');
const event = require('../../repositories/back/event');
const Acl = require('../../middleware/acl');

exports.publicationState = async(req, res, next) => {
    
    valueSet.publicationState([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.jurisdiction = async(req, res, next) => {
    
    valueSet.jurisdiction([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.observationCategory = async(req, res, next) => {
    
    valueSet.observationCategory([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.specimenType = async(req, res, next) => {
    
    valueSet.specimenType([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.permittedDataType = async(req, res, next) => {
    
    valueSet.permittedDataType([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.diagnosticRepStatus = (req, res, next) => {
    valueSet.diagnosticRepStatus((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
    
}

exports.diagnosticSerSect = (req, res, next) => {
    valueSet.diagnosticSerSect((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
    
}

exports.reportCodes = (req, res, next) => {
    valueSet.reportCodes((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
    
}
exports.encounterType = (req, res, next) => {
    valueSet.encounterType((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.encounterStatus = (req, res, next) => {
    valueSet.encounterStatus((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.encounterClass = (req, res, next) => {
    valueSet.encounterClass((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.encounterPriority = (req, res, next) => {
    valueSet.encounterPriority((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.encounterServiceType = (req, res, next) => {
    valueSet.encounterServiceType((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.encounterSubjectStatus = (req, res, next) => {
    valueSet.encounterSubjectStatus((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.encounterParticipantType = (req, res, next) => {
    valueSet.encounterParticipantType((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.encounterReasonUse = (req, res, next) => {
    valueSet.encounterReasonUse((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.encounterReasonCodes = (req, res, next) => {
    valueSet.encounterReasonCodes((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}





