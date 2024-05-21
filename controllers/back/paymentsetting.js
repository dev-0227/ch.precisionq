const setting = require('../../repositories/back/paymentsetting');

exports.getgroups = (req, res, next) => {
    setting.getgroups((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getsubgroups = (req, res, next) => {
    setting.getsubgroups((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getexclusion = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        value: req.body.value,
    }
    setting.getexclusion(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getmultisearchparams = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    setting.getmultisearchparams(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.setexclusion = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        value: req.body.value,
    }
    setting.setexclusion(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.setmultisearchparams = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        spec: req.body.spec,
        group: req.body.group,
        type: req.body.type,
    }
    setting.setmultisearchparams(entry,(err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

//Group Area
exports.addgroup = (req, res, next) => {
    let entry = {
        name: req.body.name,
        desc: req.body.desc,
    }
    setting.addgroup(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updategroup = (req, res, next) => {
    let entry = {
        id: req.body.id,
        name: req.body.name,
        desc: req.body.desc,
    }
    setting.updategroup(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosengroup = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosengroup(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletegroup = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletegroup(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

//Subgroup Area
exports.addsubgroup = (req, res, next) => {
    let entry = {
        group: req.body.group,
        name: req.body.name,
        desc: req.body.desc,
    }
    setting.addsubgroup(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatesubgroup = (req, res, next) => {
    let entry = {
        id: req.body.id,
        group: req.body.group,
        name: req.body.name,
        desc: req.body.desc,
    }
    setting.updatesubgroup(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosensubgroup = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.chosensubgroup(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletesubgroup = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    setting.deletesubgroup(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}