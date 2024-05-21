const manager = require('../../repositories/back/profile');

exports.update = (req, res, next) => {
    let entry = {
        id: req.body.id,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
    }
    manager.update(entry, (err, result) => {
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
    manager.chosen(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatepwd = (req, res, next) => {
    let entry = {
        id: req.body.id,
        opwd: req.body.opwd,
        pwd: req.body.pwd,
    }
    
    manager.checkpwd(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            if (result.length > 0) {
                manager.updatepwd(entry, (err, result) => {
                    if (err) {
                        res.status(404).json(err);
                    } else {
                        res.status(200).json({ data: result });
                    }
                });
            } else {
                res.status(200).json({ status: 'failed',message: 'failed' });
            }
        }
    });
}
exports.updateanswer = (req, res, next) => {
    let entry = {
        id: req.body.id,
        question_id: req.body.question_id,
        answer: req.body.answer,
    }
    manager.updateanswer(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}