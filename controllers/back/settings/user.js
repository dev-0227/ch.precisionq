const user = require('../../../repositories/back/settings/user');
const Acl = require('../../../middleware/acl');
const https = require('https');

const data = JSON.stringify({
    name: 'doggie',
    photoUrls: [
        "string"
    ]
});

function httpRequest(options) {
    return new Promise((resolve, reject) => {

        const clientRequest = https.request(options, incomingMessage => {

            // Response object.
            let response = {
                statusCode: incomingMessage.statusCode,
                headers: incomingMessage.headers,
                body: []
            };

            // Collect response body data.
            incomingMessage.on('data', chunk => {
                response.body.push(chunk);
            });

            // Resolve on end.
            incomingMessage.on('end', () => {
                if (response.body.length) {

                    response.body = response.body.join();

                    try {
                        response.body = JSON.parse(response.body);
                    } catch (error) {
                        // Silently fail if response is not JSON.
                    }
                }

                resolve(response);
            });
        });
        
        // Reject on request error.
        clientRequest.on('error', error => {
            reject(error);
        });

        // Write request body if present.
        if (options.body) {
            clientRequest.write(options.body);
        }

        // Close HTTP connection.
        clientRequest.end();
    });
}

exports.list = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    console.log('req.query', req.query)
    user.list(req.query, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json(result);
        }
    });
}

exports.getUsersByClinic = (req, res, next) => {
    user.getUsersByClinic(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.add = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        addr: req.body.addr,
        emrid: req.body.emrid,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        type: req.body.type,
        status: 1,
        ext: req.body.ext,
        qr_phone: req.body.qr_phone,
        clinic: req.body.clinic,
        created: new Date()
    }
    user.add(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.update = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phone: req.body.phone,
        addr: req.body.addr,
        emrid: req.body.emrid,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        type: req.body.type,
        status: req.body.status,
        ext: req.body.ext,
        qr_phone: req.body.qr_phone,
        clinic: req.body.clinic,
        created: new Date()
    }
    user.update(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosen = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    user.chosen(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.delete = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id
    }
    user.delete(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatepwd = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        pwd: req.body.pwd,
    }
    user.updatepwd(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateanswer = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        question_id: req.body.question_id,
        answer: req.body.answer,
    }
    user.updateanswer(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}


exports.connectorclinics = async (req, res, next) => {

    // var list = [{"id":1,"name":"JOSE A GORIS MD PC"},{"id":2,"name":"BEST CARE EVER MED GROUP"},{"id":3,"name":"Medinova"},{"id":4,"name":"Juan A Alba MD PC"},{"id":5,"name":"Hassan Clinic"},{"id":6,"name":"GODWIN MEDICAL"},{"id":7,"name":"JEROME MEDICAL OFFICE"},{"id":8,"name":"436 GWB Medical Office"},{"id":9,"name":"FELIX FLORIMON MD"},{"id":10,"name":"GENERAL MEDICAL  SERVICES OF QUEENS"},{"id":11,"name":"JOSE ORTIZ"},{"id":12,"name":"STEPHEN PEREZ"},{"id":13,"name":"PATEL MEDICAL"},{"id":14,"name":"FORT WASHINGTON MEDICAL"},{"id":15,"name":"QUEENS STAR MEDICAL"},{"id":16,"name":"University Medical Office Pllc"},{"id":17,"name":"OLA PEDIATRICS PC"},{"id":24,"name":"Triboro Pediatrics DBA"},{"id":25,"name":"Junction Medical Office "},{"id":26,"name":"Broadway Internal Medicine"},{"id":27,"name":"K ZARK MEDICAL PC"},{"id":28,"name":"JANNY A OZUNA MD"},{"id":30,"name":"JOSE T APONTE RODRIGUEZ MD PC"},{"id":31,"name":"JAG Wellness Center"},{"id":32,"name":"Centro Medico Dominicano, PLLC"},{"id":33,"name":" Williamsburg Internal Medicine PC"},{"id":34,"name":"New York Primary Care Medicine"},{"id":35,"name":"Millennium Medical Group PC"},{"id":36,"name":"Eastern Park Medical Services"},{"id":37,"name":"America Medical Group "},{"id":38,"name":"CLINICA DE PRUEBA JAG"}]
    // res.status(200).json({ data: list });

    const options = {
        hostname: 'pro.conectorhealth.com',
        path: '/api/setting/getchosenclinics',
        body: data,
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
      };

      try {
        let response = await httpRequest(options);
        res.status(200).json({ data: response.body.data });
      } catch (err) {
        console.log(err);
      }
}

exports.clinics = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
    }
    user.clinics(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
    
}

exports.updatepermissions = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        permissions: req.body.permissions,
        role_values: req.body.role_values,
    }
    user.updatepermissions(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}


exports.updateclinics = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        clinics: req.body.clinics,
    }
    user.updateclinics(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.updatehedisdaily = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        value: req.body.value,
    }
    user.updatehedisdaily(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updatehedisncompliant = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        id: req.body.id,
        value: req.body.value,
    }
    user.updatehedisncompliant(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getPermissionsByName = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'USER_MANAGE');
    if(!can)return res.status(405).json('Not Permission');
    let entry = {
        name: req.body.permission,
        user_id: req.user.id
    }
    user.getPermissionsByName(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getDoctorsByClinic = (req, res, next) => {

    user.getDoctorsByClinic(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getAllDoctorsByClinic = (req, res, next) => {

    user.getAllDoctorsByClinic(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}