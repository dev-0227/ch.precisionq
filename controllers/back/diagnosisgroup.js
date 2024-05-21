const diagnosisgroup = require('../../repositories/back/diagnosisgroup');


exports.list = (req, res, next) => {
    diagnosisgroup.list((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.add = (req, res, next) => {
    let entry = {
        name: req.body.name,
        userId: 1
    }
    diagnosisgroup.add(entry, (err, result) => {
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
        codes: req.body.codes,
        userId: 1
    }
    diagnosisgroup.update(entry, (err, result) => {
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
    diagnosisgroup.chosen(entry, (err, result) => {
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
    diagnosisgroup.delete(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.ref = (req, res, next) => {
    diagnosisgroup.ref({}, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

