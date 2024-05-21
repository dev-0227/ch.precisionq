const event = require('../../repositories/back/event');

exports.login = (req, res, next) => {
    let entry = {
        user_id: req.user_id,
        type_id: 15, //'User Authentication'
        subtype_id: 3, //'Login',
        outcome_id: 5, //'success',
        action_id: 5, //'E',
    }
    event.log(entry, (err, result) => {if (err) {}});
}

exports.logout = (req, res, next) => {
    let entry = {
        user_id: req.user_id,
        type_id: 15,
        subtype_id: 4,
        outcome_id: 5,
        action_id: 5
    }
    
    event.log(entry, (err, result) => {if (err) {}});
}
exports.login_failed = (req, res, next) => {
    let entry = {
        user_id: req.user_id,
        type_id: 15,
        subtype_id: 3,
        outcome_id: 2, //'error',
        action_id: 5, //'E',
        description: req.description
    }
    event.log(entry, (err, result) => {if (err) {}});
}
