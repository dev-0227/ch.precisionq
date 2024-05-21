const permission = require('../../../repositories/back/settings/permission');

exports.list = async(req, res, next) => {
    var can = req.user['role']=="0"?true:false;
    if(!can)return res.status(405).json('Not Permission');
    permission.list((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.add = async(req, res, next) => {
    var can = req.user['role']=="0"?true:false;
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date()
    }
    permission.add(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.chosen = async(req, res, next) => {
    var can = req.user['role']=="0"?true:false;
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    permission.chosen(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.update = async(req, res, next) => {
    var can = req.user['role']=="0"?true:false;
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        name: req.body.name,
        description: req.body.description,
        updatedAt: new Date()
    }
    permission.update(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.delete = async(req, res, next) => {
    var can = req.user['role']=="0"?true:false;
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    permission.delete(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}



