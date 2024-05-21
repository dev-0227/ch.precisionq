const manager = require('../../repositories/back/manager');


exports.list = (req, res, next) => {
    manager.list((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.add = async (req, res, next) => {
    let entry = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        type: req.body.type,
        status: 1
    }
    let check = await manager.checkuser(entry.email);
    if(check.length == 0){
        manager.add(entry, (err, result) => {
            if (err) {
                res.status(404).json(err);
            } else {
                res.status(200).json({ data: result });
            }
        });
    }
    else{
        res.status(200).json({ data: "existed" });
    }
   
}
exports.update = (req, res, next) => {
    let entry = {
        id: req.body.id,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        type: req.body.type,
        status: req.body.status
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
exports.delete = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    manager.delete(entry, (err, result) => {
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
        pwd: req.body.pwd,
    }
    manager.updatepwd(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
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
exports.updateclinics = (req, res, next) => {
    let entry = {
        id: req.body.id,
        clinics: req.body.clinics,
    }
    manager.updateclinics(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatehedisdaily = (req, res, next) => {
    let entry = {
        id: req.body.id,
        value: req.body.value,
    }
    manager.updatehedisdaily(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatehedisncompliant = (req, res, next) => {
    let entry = {
        id: req.body.id,
        value: req.body.value,
    }
    manager.updatehedisncompliant(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
