const encounter = require('../../../repositories/back/hedis/encounter');
const event = require('../../../repositories/back/event');
const Acl = require('../../../middleware/acl');
exports.encounter = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'REFERRAL_ENCOUNTER');
    if(!can)return res.status(200).json({ data: [] });
    
    encounter.encounter(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
    
}

exports.createEncounter = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_ENCOUNTER');
    if(!can)return res.status(405).json('Not Permission');
    encounter.createEncounter(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.chosenEncounter = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'REFERRAL_ENCOUNTER');
    if(!can)return res.status(405).json('Not Permission');
    encounter.chosenEncounter(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.deleteEncounter = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_ENCOUNTER');
    if(!can)return res.status(405).json('Not Permission');
    encounter.deleteEncounter(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.updateEncounter = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'REFERRAL_ENCOUNTER');
    if(!can)return res.status(405).json('Not Permission');
    encounter.updateEncounter(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            if(req.body.completed=="1" && result.length>0){
                entry = {
                    referral_id: result[0].id,
                    referral_category_id: '2',
                    referral_type_id: '7',
                    user_id: req.user.id
                }
                encounter.createReferralTracking(entry, (err2, result2) => {
                    if(!err2){
                        
                    }
                });
            }
            res.status(200).json({ data: result });
        }
    });
}

exports.appointment = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(200).json({ data: [] });
    
    encounter.appointment(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
    
}

exports.createAppointment = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    var entry = req.body;
    entry.attended = "0";

    encounter.checkAppointment(entry, (err0, result0) => {
        if (!err0) {
            if (result0.length==0) {
                encounter.createAppointment(entry, (err, result) => {
                    if (err) {
                        res.status(404).json(err);
                    } else {
                        entry.appointment_id = result.insertId;
                        encounter.createReferral(entry, (err1, result1) => {
                            if(!err1){
                                entry = {
                                    referral_id: result1.insertId,
                                    referral_category_id: '2',
                                    referral_type_id: '5',
                                    user_id: req.user.id
                                }
                                encounter.createReferralTracking(entry, (err2, result2) => {
                                    if(err2)console.log(err2);
                                });
                            }
                        });

                        var provider_id = req.body.clinic_provider;
                        if(req.body.provider=="1"){
                            provider_id = req.body.specialist_provider;
                        }
                        entry = {
                            appointment_id: result.insertId,
                            clinic_id: req.body.clinic_id,
                            emr_id: req.body.emr_id,
                            patient_id: req.body.patient_id,
                            pcp_id: req.user.id,
                            enc_type: 'phone call',
                            status: 'in-progress',
                            team_member: req.user.id,
                            assigned: provider_id,
                            notes: req.body.notes,
                            class: 'VR',
                            priority: req.body.priority,
                            completed: '0',
                            service_type: 'Medical Service',
                            participant_type: 'CALLBCK',
                            enc_start: new Date().toISOString(),
                            total_mins: '3',
                            reason: req.body.reason,
                            reason_use: 'HM'
                        }
                        
                        encounter.createEncounter(entry, (err3, result3) => {
                            if(err3)console.log(err3);
                        });

                        res.status(200).json({ data: result });
                    }
                });

            }else{
                res.status(200).json({ message: "exist" });
            }
        }
    });


    
}

exports.updateAppointment = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.updateAppointment(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            var entry = {
                appointment_id: req.body.id
            }
            encounter.getReferralTracking(entry, (err2, result2) => {
                if(!err2){
                    if(result2.length>0){
                        var r_type = result2[result2.length-1].referral_type_id;
                        referral_type_id = req.body.attended=="1"?"6":"5";
                        if(r_type != referral_type_id){
                            entry = {
                                referral_id: result2[0].referral_id,
                                referral_category_id: '2',
                                referral_type_id: referral_type_id,
                                user_id: req.user.id
                            }
                            encounter.createReferralTracking(entry, (err3, result3) => {
                            });
                        }
                        
                    }
                }
            });
            
            res.status(200).json({ data: result });
        }
    });
}

exports.chosenAppointment = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.chosenAppointment(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.deleteAppointment = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.deleteAppointment(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getAppointment = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.getAppointment(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.appointmentType = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.appointmentType(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.createAppointmentType = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.createAppointmentType(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.updateAppointmentType = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.updateAppointmentType(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.chosenAppointmentType = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.chosenAppointmentType(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.deleteAppointmentType = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.deleteAppointmentType(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.appointmentCategory = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.appointmentCategory(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.createAppointmentCategory = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.createAppointmentCategory(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.updateAppointmentCategory = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.updateAppointmentCategory(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.chosenAppointmentCategory = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.chosenAppointmentCategory(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.deleteAppointmentCategory = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.deleteAppointmentCategory(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}


exports.appointmentSpecialty = async(req, res, next) => {
    // var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    // if(!can) return res.status(405).json('Not Permission');
    encounter.appointmentSpecialty(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.createAppointmentSpecialty = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');

    
    encounter.chosenAppointmentSpecialtyByName(req.body, (err, data) => {
        if (err) {
            res.status(404).json(err);
        } else {
            if(data.length>0){
                res.status(200).json({ msg: 'exist' });
            }else{
                encounter.createAppointmentSpecialty(req.body, (err, result) => {
                    if (err) {
                        res.status(404).json(err);
                    } else {
                        res.status(200).json({ data: result });
                    }
                });
            }
        }
    });

    
}

exports.updateAppointmentSpecialty = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.updateAppointmentSpecialty(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.chosenAppointmentSpecialty = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.chosenAppointmentSpecialty(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.deleteAppointmentSpecialty = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.deleteAppointmentSpecialty(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getAppointmentSpecialtyByMeasure = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.getAppointmentSpecialtyByMeasure(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.getReferralSpecialtyByClinic = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_APPOINTMENT');
    if(!can)return res.status(405).json('Not Permission');
    encounter.getReferralSpecialtyByClinic(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

/*************************************** REFERRAL  ********************************************** */


exports.referral = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.referral(req.query, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.updateReferral = async(req, res, next) => {
    var can = await Acl.can(req.user, ['write'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.updateReferral(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.deleteReferral = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.deleteReferral(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.chosenReferral = async(req, res, next) => {
    var can = await Acl.can(req.user, ['read'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.chosenReferral(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.createReferralTracking = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    var entry = req.body;
    entry.user_id= req.user.id;
    encounter.createReferralTracking(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

/*************************************** REFERRAL TYPE  ********************************************** */

exports.referralStatus = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.referralStatus(req.query, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenReferralStatus = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.chosenReferralStatus(req.query, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenReferralStatus = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.chosenReferralStatus(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.createReferralStatus = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.createReferralStatus(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateReferralStatus = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.updateReferralStatus(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deleteReferralStatus = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.deleteReferralStatus(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

/*************************************** REFERRAL Category  ********************************************** */

exports.referralCategory = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.referralCategory(req.query, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenReferralCategory = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.chosenReferralCategory(req.query, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.chosenReferralCategory = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.chosenReferralCategory(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.createReferralCategory = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.createReferralCategory(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.updateReferralCategory = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.updateReferralCategory(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.deleteReferralCategory = async(req, res, next) => {
    var can = await Acl.can(req.user, ['create'], 'REFERRAL_TRACKING');
    if(!can)return res.status(405).json('Not Permission');
    encounter.deleteReferralCategory(req.body, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}






