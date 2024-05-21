const login = require('../../repositories/back/login');
let ejs = require("ejs");
let path = require("path");
var nodemailer = require('nodemailer');
const event = require('../../controllers/back/event');
const jwtUtil = require('../../utilities/jwt');
const config = require('../../config');

var mail = nodemailer.createTransport({
    host: config.emailaccess.host,
    port: config.emailaccess.port,
    secure: false,
    auth: {
        user: config.emailaccess.user,
        pass: config.emailaccess.password,
    }
});
exports.test = (req, res , next) =>{
    res.status(200).json('Hello World')
}
exports.login = (req, res, next) => {
    let entry = {
        email: req.body.email,
        password: req.body.password,
    }
    login.login(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            if (result.length > 0) {
                if (result[0].status == 1) {
                    const token = jwtUtil.createToken({ id: result[0].id, role: result[0].type });
                    res.status(200).json({ 
                        status: 'success',
                        userid:result[0].id,
                        type:result[0].type,
                        fname:result[0].fname,
                        lname:result[0].lname,
                        email:result[0].email,
                        clinic:result[0].clinic,
                        permissions:result[0].permissions,
                        token: token
                    });
                }
                else{
                    res.status(200).json({ status: 'approve',message: 'not approved' });
                }
            } else {
                event.login_failed({description: 'Attempted login with '+ req.body.email});
                res.status(404).json({ status: 'failed',message: 'failed' });
            }
        }
    });
}
exports.getsecurity = (req, res, next) => {
    login.getsecurity(req.body.userid, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            var cnt = Math.floor(Math.random() * result.length) 
            res.status(200).json({ data: result[cnt] });
        }
    });
}
exports.checksecurity = async (req, res, next) => {
    let entry = {
        userid: req.body.userid,
        qid: req.body.qid,
        answer: req.body.answer,
    }
    login.checksecurity(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            if (result.length > 0) {
                let chosen_clinic = 0;
                login.getfirstclinic(entry.userid, async (err, result1) => {
                    if (err) {
                        res.status(404).json(err);
                    } else {
                        chosen_clinic = result1[0]['id'];
                        let result = await login.tracklogin(entry.userid);
                        event.login({user_id: req.body.userid});
                        res.status(200).json({ status: 'success',chosen_clinic:chosen_clinic,loginid:result.insertId});
                    }
                });
            } else {
                res.status(404).json({ status: 'failed'});
            }
        }
    });
}
exports.resetpwdemail = async (req, res, next) => {
    let entry = {
        email: req.body.email
    }
    subject = "Reset Your Password";
    let user = await login.getuser(entry);
    if(user.length > 0){
        var id = user[0]['id'];
    }
    else{
        var id = 0;
    }
    let tmpdata = {
        'link':`${config.common.viewUrl}resetpwd?t=`+id,
    }
    ejs.renderFile(path.join(__dirname, '../../views/', "resetpwdemail.ejs"), { body: tmpdata }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var mailOptions = {
                from: config.emailaccess.user,
                to: entry.email,
                subject: subject,
                html: data
            }
            mail.sendMail(mailOptions, function(error, info){
                if (error) {
                    res.status(200).json({ message: "failed" });
                } else {
                    res.status(200).json({ message: "success" });
                }
            });
        }
    });
}
exports.updatepwd = (req, res, next) => {
    let entry = {
        id: req.body.id,
        pwd: req.body.pwd,
    }
    login.updatepwd(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateloginouttime = (req, res, next) => {
    let entry = {
        id: req.body.id
    }
    login.updateloginouttime(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.logout = (req, res, next) => {
    event.logout({user_id: req.body.userid});
    res.status(200).json({ status: 'success'});
}