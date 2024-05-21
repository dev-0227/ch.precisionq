const insurance = require('../../repositories/back/insurance');


exports.list = (req, res, next) => {
    insurance.list((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getHedisList = (req, res, next) => {
    insurance.getHedisList((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}


exports.add = async (req, res, next) => {
    let entry = {
        name: req.body.name,
        abbr: req.body.abbr,
        email: req.body.email,
        phone: req.body.phone,
        fax: req.body.fax,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        hedis: req.body.hedis,
        status: req.body.status
    }
    insurance.add(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.update = (req, res, next) => {
    let entry = {
        id: req.body.id,
        name: req.body.name,
        abbr: req.body.abbr,
        email: req.body.email,
        phone: req.body.phone,
        fax: req.body.fax,
        address1: req.body.address1,
        address2: req.body.address2,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        hedis: req.body.hedis,
        status: req.body.status
    }
    insurance.update(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosen = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    insurance.chosen(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.delete = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    insurance.delete(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getlob = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    insurance.getlob(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.addlob = (req, res, next) => {
    let entry = {
        insid: req.body.insid,
        name: req.body.name,
        desc: req.body.desc,
        variation: req.body.variation,
        type: req.body.type,
    }
    insurance.addlob(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatelob = (req, res, next) => {
    let entry = {
        id: req.body.id,
        name: req.body.name,
        desc: req.body.desc,
        variation: req.body.variation,
        type: req.body.type,
    }
    insurance.updatelob(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenlob = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    insurance.chosenlob(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deletelob = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    insurance.deletelob(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
