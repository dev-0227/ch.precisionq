const invoice = require('../../repositories/back/invoice');

exports.getdata = async (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
    }
    let appsms = await invoice.getappsms(entry.clinicid);
    let hedissms =  await invoice.gethedissms(entry.clinicid);

    res.status(200).json({ app: appsms,hedis:hedissms });
}