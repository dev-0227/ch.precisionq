const role = require('../../../repositories/back/settings/role');

exports.list = async(req, res, next) => {
    var can = req.user['role']=="0"?true:false;
    if(!can)return res.status(405).json('Not Permission');
    role.list((err, result) => {
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
        code: req.body.code,
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date()
    }
    role.add(entry, (err, result) => {
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
    role.chosen(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getPermission = async(req, res, next) => {
    let entry = {
        id: req.body.id
    }
    role.getPermission(entry, (err, result) => {
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
        code: req.body.code,
        name: req.body.name,
        description: req.body.description,
        permission: req.body.permission,
        updatedAt: new Date()
    }
    role.update(entry, (err, result) => {
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
    role.delete(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
