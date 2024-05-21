const connection = require('../../../utilities/database');

const encounterRepo = {
    encounter: (entry, callback) => {
        let query = "SELECT * FROM `f_encounters` WHERE `clinic_id`=? AND `patient_id`=? ORDER BY enc_start desc";
        connection.query(query, [entry.clinic_id, entry.patient_id], (err, result) => {
            callback(err, result);
        });
    },
    createEncounter: (entry, callback) => {
        let query = "INSERT INTO `f_encounters` (";
        query += "`clinic_id`, `emr_id`,`patient_id`,`pcp_id`, `appointment_id`,`enc_type`,`status`,";
        query += "`team_member`,`assigned`,`notes`,`action_taken`,`class`,`priority`, `completed`,";
        query += "`service_type`,`participant_type`,`enc_start`,`total_mins`,`reason`,`reason_use`";
        query += ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
          var values = []
        values.push(entry.clinic_id);
        values.push(entry.emr_id);
        values.push(entry.patient_id);
        values.push(entry.pcp_id);
        values.push(entry.appointment_id);
        values.push(entry.enc_type);
        values.push(entry.status);
        values.push(entry.team_member);
        values.push(entry.assigned);
        values.push(entry.notes);
        values.push(entry.action_taken);
        values.push(entry.class);
        values.push(entry.priority);
        values.push(entry.completed);
        values.push(entry.service_type);
        values.push(entry.participant_type);
        values.push(new Date(entry.enc_start).toISOString());
        values.push(entry.total_mins);
        values.push(entry.reason);
        values.push(entry.reason_use)
        
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    chosenEncounter: (entry, callback) => {
        let query = "SELECT enc.*, cln.name as clinic_name, pt.* ";
        query += "FROM `f_encounters` as enc "
        query += "LEFT JOIN `clinics` as cln ON cln.id= enc.clinic_id "
        query += "LEFT JOIN `patient_list` as pt ON pt.id= enc.patient_id "
        query += "WHERE enc.id= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getEncounterByAppointment: (entry, callback) => {
        let query = "SELECT * FROM `f_encounters` WHERE `appointment_id`= ? "
        connection.query(query, [entry.appointment_id], (err, result) => {
            callback(err, result);
        });
    },
    updateEncounter: (entry, callback) => {
        let query = "UPDATE `f_encounters` SET ";
        query += "`clinic_id`=?, `emr_id`=?,`patient_id`=?,`pcp_id`=?,`enc_type`=?,`status`=?,";
        query += "`team_member`=?,`assigned`=?,`notes`=?,`action_taken`=?,`class`=?,`priority`=?,`completed`=?,";
        query += "`service_type`=?,`participant_type`=?,`enc_start`=?,`total_mins`=?,`reason`=?,`reason_use`=?,`reason_codes`=?";
        query += " WHERE `id`= ? ";
        var values = []
        values.push(entry.clinic_id);
        values.push(entry.emr_id);
        values.push(entry.patient_id);
        values.push(entry.pcp_id);
        values.push(entry.enc_type);
        values.push(entry.status);
        values.push(entry.team_member);
        values.push(entry.assigned);
        values.push(entry.notes);
        values.push(entry.action_taken);
        values.push(entry.class);
        values.push(entry.priority);
        values.push(entry.completed);
        values.push(entry.service_type);
        values.push(entry.participant_type);
        values.push(new Date(entry.enc_start).toISOString());
        values.push(entry.total_mins);
        values.push(entry.reason);
        values.push(entry.reason_use);
        values.push(entry.reason_codes);
        values.push(entry.id);
        connection.query(query, values, (err, result) => {
            if(!err){
                query = "SELECT ref.* FROM `f_referral` as ref ";
                query += "LEFT JOIN `f_encounters` as enc ON enc.appointment_id=ref.appointment_id "
                query += "WHERE enc.id=?"
                connection.query(query, [entry.id], (err1, result1) => {
                    callback(err1, result1);
                });
            }else{
                callback(err, result);
            }
            
            
        });
    },
    deleteEncounter: (entry, callback) => {
        let query = "DELETE FROM `f_encounters` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    appointment: (entry, callback) => {
        let query = "SELECT a.*, m.fname, m.lname FROM `f_appointment` as a ";
        query += "LEFT JOIN `managers` as m ON m.id = a.provider_id "
        query += "WHERE a.clinic_id=? AND a.patient_id=? ORDER BY start_date desc";
        connection.query(query, [entry.clinic_id, entry.patient_id], (err, result) => {
            callback(err, result);
        });
    },
    createAppointment: (entry, callback) => {
        var provider_id = entry.clinic_provider;
        if(entry.provider=="1"){
            provider_id = entry.specialist_provider;
        }
        let query = "INSERT INTO `f_appointment` (";
        query += "`clinic_id`, `emr_id`,`patient_id`,`pcp_id`,`pt_participate_status`,`approve_date`,";
        query += "`measure`, `assessment`,`provider`,`provider_id`, `attended`,";
        query += "`status`,`cancel_reason`,`class`,`service_category`,`appt_type`,`reason`, `priority`,";
        query += "`description`,`start_date`,`end_date`,`created_date`,`cancel_date`,`notes`,";
        query += "`pt_instruction`";
        query += ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
        var values = []
        values.push(entry.clinic_id);
        values.push(entry.emr_id);
        values.push(entry.patient_id);
        values.push(entry.pcp_id);
        values.push(entry.pt_participate_status);
        values.push(entry.approve_date);
        values.push(entry.measure);
        values.push(entry.assessment);
        values.push(entry.provider);
        values.push(provider_id);
        values.push(entry.attended);
        values.push(entry.status);
        values.push(entry.cancel_reason);
        values.push(entry.class);
        values.push(entry.service_category);
        values.push(entry.appt_type);
        values.push(entry.reason);
        values.push(entry.priority);
        values.push(entry.description);
        values.push(entry.start_date?entry.start_date+":00":"");
        values.push(entry.end_date?entry.end_date+":00":"");
        values.push(new Date().toISOString());
        values.push(entry.cancel_date);
        values.push(entry.notes);
        values.push(entry.pt_instruction);
        
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    updateAppointment: (entry, callback) => {
        var provider_id = entry.clinic_provider;
        if(entry.provider=="1"){
            provider_id = entry.specialist_provider;
        }
        let query = "UPDATE `f_appointment` SET ";
        query += "`clinic_id`=?, `emr_id`=?,`patient_id`=?,`pcp_id`=?,`pt_participate_status`=?,`approve_date`=?,";
        query += "`measure`=?, `assessment`=?,`provider`=?,`provider_id`=?, `attended`=?,";
        query += "`status`=?,`cancel_reason`=?,`class`=?,`service_category`=?,`appt_type`=?,`reason`=?, `priority`=?,";
        query += "`description`=?,`start_date`=?,`end_date`=?,`created_date`=?,`cancel_date`=?,`notes`=?,";
        query += "`pt_instruction`=?";
        query += "WHERE `id`= ? ";
        var values = []
        values.push(entry.clinic_id);
        values.push(entry.emr_id);
        values.push(entry.patient_id);
        values.push(entry.pcp_id);
        values.push(entry.pt_participate_status);
        values.push(entry.approve_date);
        values.push(entry.measure);
        values.push(entry.assessment);
        values.push(entry.provider);
        values.push(provider_id);
        values.push(entry.attended);
        values.push(entry.status);
        values.push(entry.cancel_reason);
        values.push(entry.class);
        values.push(entry.service_category);
        values.push(entry.appt_type);
        values.push(entry.reason);
        values.push(entry.priority);
        values.push(entry.description);
        values.push(entry.start_date?entry.start_date+":00":"");
        values.push(entry.end_date?entry.end_date+":00":"");
        values.push(new Date().toISOString());
        values.push(entry.cancel_date);
        values.push(entry.notes);
        values.push(entry.pt_instruction);
        values.push(entry.id);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    chosenAppointment: (entry, callback) => {
        let query = "SELECT app.*, cln.name as clinic_name, ";
        query += "pt.*, pt.patientid as emr_id "
        query += "FROM `f_appointment` as app "
        query += "LEFT JOIN `clinics` as cln ON cln.id= app.clinic_id "
        query += "LEFT JOIN `patient_list` as pt ON pt.id= app.patient_id "
        query += "WHERE app.id= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    checkAppointment: (entry, callback) => {
        var provider_id = entry.clinic_provider;
        if(entry.provider=="1"){
            provider_id = entry.specialist_provider;
        }
        let query = "SELECT * FROM `f_appointment` WHERE `patient_id`= ? AND `provider_id`=? AND `approve_date`=? "
        connection.query(query, [entry.patient_id, provider_id, entry.approve_date], (err, result) => {
            callback(err, result);
        });
    },
    deleteAppointment: (entry, callback) => {
        let query = "DELETE FROM `f_appointment` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getAppointment: (entry, callback) => {
        
        let query = "SELECT a.*, p.FNAME, p.LNAME, p.PHONE, p.ADDRESS, p.DOB, p.GENDER, p.Language, p.EMAIL, p.MOBILE, ";
        query += "usr.fname as doctor_fname, usr.lname as doctor_lname "
        query += "FROM `f_appointment` as a "
        query += "LEFT JOIN patient_list as p ON a.patient_id = p.id "
        query += "LEFT JOIN managers as usr ON usr.id = a.provider_id "
        query += "LEFT JOIN specialty as spc ON FIND_IN_SET(a.measure, spc.mid) "
        query += "WHERE `clinic_id`=? ";
        query += "AND FIND_IN_SET(usr.type, (";
        query += "SELECT GROUP_CONCAT(value) FROM `f_settings` WHERE type='appointment_doctor'";
        query += ")) ";
        if(entry.doctors){
            query += "AND FIND_IN_SET(a.provider_id, '"+entry.doctors+"') ";
        }
        if(entry.specialties != "0"){
            query += "AND FIND_IN_SET(spc.id, '"+entry.specialties+"') ";
        }
        if(entry.date){
            var date = new Date(entry.date+" 23:59:00");
            var this_month = new Date(date.getFullYear(), date.getMonth(), 1);
            var next_month = new Date(date.getFullYear(), date.getMonth()+1, 1);
            query += "AND a.approve_date >= '"+this_month.toISOString().split("T")[0]+"' ";
            query += "AND a.approve_date < '"+next_month.toISOString().split("T")[0]+"' ";
        }
        connection.query(query, [entry.clinic_id], (err, result) => {
            callback(err, result);
        });
    },
    appointmentType: (entry, callback) => {
        let query = "SELECT t.*, c.name as categoryName FROM `f_appointment_type` as t ";
        query += "LEFT JOIN `f_appointment_category` as c ON c.id=t.category";
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    createAppointmentType: (entry, callback) => {
        let query = "INSERT INTO `f_appointment_type` (";
        query += "`name`, `description`,`category`,`visit`,`duration`,`status`, `color`";
        query += ") VALUES (?, ?, ?, ?, ?, ?, ?)";
        var values = []
        values.push(entry.name);
        values.push(entry.description);
        values.push(entry.category);
        values.push(entry.visit);
        values.push(entry.duration);
        values.push(entry.status);
        values.push(entry.color);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    updateAppointmentType: (entry, callback) => {
        let query = "UPDATE `f_appointment_type` SET ";
        query += "`name`=?, `description`=?,`category`=?,`visit`=?,`duration`=?,`status`=?, `color`=?";
        query += "WHERE `id`= ? ";
        var values = []
        values.push(entry.name);
        values.push(entry.description);
        values.push(entry.category);
        values.push(entry.visit);
        values.push(entry.duration);
        values.push(entry.status);
        values.push(entry.color);
        values.push(entry.id);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    chosenAppointmentType: (entry, callback) => {
        let query = "SELECT * FROM `f_appointment_type` WHERE id=?";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deleteAppointmentType: (entry, callback) => {
        let query = "DELETE FROM `f_appointment_type` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    appointmentCategory: (entry, callback) => {
        let query = "SELECT * FROM `f_appointment_category`";
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    createAppointmentCategory: (entry, callback) => {
        let query = "INSERT INTO `f_appointment_category` (";
        query += "`name`, `description`";
        query += ") VALUES (?, ?)";
        var values = []
        values.push(entry.name);
        values.push(entry.description);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    updateAppointmentCategory: (entry, callback) => {
        let query = "UPDATE `f_appointment_category` SET ";
        query += "`name`=?, `description`=?";
        query += "WHERE `id`= ? ";
        var values = []
        values.push(entry.name);
        values.push(entry.description);
        values.push(entry.id);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    chosenAppointmentCategory: (entry, callback) => {
        let query = "SELECT * FROM `f_appointment_category` WHERE id=?";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deleteAppointmentCategory: (entry, callback) => {
        let query = "DELETE FROM `f_appointment_category` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },

    appointmentSpecialty: (entry, callback) => {
        let query = "SELECT * FROM `specialty`";
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    createAppointmentSpecialty: (entry, callback) => {

        let query = "INSERT INTO `specialty` (";
        query += "`name`, `description`, `mid`, `map`";
        query += ") VALUES (?, ?, ?, ?)";
        var values = []
        values.push(entry.name);
        values.push(entry.description);
        values.push(entry.mid);
        values.push(entry.map);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    updateAppointmentSpecialty: (entry, callback) => {
        let query = "UPDATE `specialty` SET ";
        query += "`name`=?, `description`=?, `mid`=?, `map`=?";
        query += "WHERE `id`= ? ";
        var values = []
        values.push(entry.name);
        values.push(entry.description);
        values.push(entry.mid);
        values.push(entry.map);
        values.push(entry.id);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    chosenAppointmentSpecialty: (entry, callback) => {
        let query = "SELECT * FROM `specialty` WHERE id=?";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    chosenAppointmentSpecialtyByName: (entry, callback) => {
        let query = "SELECT * FROM `specialty` WHERE name=?";
        connection.query(query, [entry.name], (err, result) => {
            callback(err, result);
        });
    },
    deleteAppointmentSpecialty: (entry, callback) => {
        let query = "DELETE FROM `specialty` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getAppointmentSpecialtyByMeasure: (entry, callback) => {
        let query = "SELECT * FROM `specialty` WHERE FIND_IN_SET(?, `mid`)";
        connection.query(query, [entry.measure_id], (err, result) => {
            callback(err, result);
        });
    },
    getReferralSpecialtyByClinic: (entry, callback) => {
        let query = "SELECT GROUP_CONCAT(DISTINCT m_id) as m_id FROM `f_referral` WHERE clinic_id=? ";
        
        connection.query(query, [entry.clinic_id], (err, result) => {
            if(!err){
                if(result.length>0){
                    query = "SELECT * FROM `specialty` WHERE ";
                    var mids = result[0]['m_id'].split(",");
                    for(var i=0; i<mids.length; i++){
                        if(i>0) query += "OR "
                        query += "FIND_IN_SET('"+mids[i]+"', `mid`) >0 ";
                    }
                    connection.query(query, [entry.clinic_id], (err1, result1) => {
                        callback(err1, result1);
                    });
                }else{
                    callback(err, result);
                }

            }else callback(err, result);
        });
    },
    referral: (entry, callback) => {
        
        let query = "SELECT ref.*, ins.insName as insurance, pt.FNAME as pt_fname, pt.LNAME as pt_lname, pt.PHONE as pt_phone, pt.MOBILE as pt_mobile, pt.EMAIL as pt_email, pt.DOB as pt_dob, ";
        query += "usr.fname as doctor_fname, usr.lname as doctor_lname, usr.id as doctor_id, mes.title as measure, spc.name as specialty_name, app.approve_date as appt_date, ";
        query += "ret.display as referral_type, trk.referral_type_id as rt_type, trk.created_at as rt_date, ";
        query += "enc.id as encounter_id "
        query += "FROM `f_referral` as ref ";
        query += "LEFT JOIN `insurances` as ins ON ins.id=ref.ins_id ";
        query += "LEFT JOIN `measure_hedis` as mes ON mes.measureId=ref.m_id ";
        query += "LEFT JOIN `specialty` as spc ON spc.id=ref.specialty ";
        query += "LEFT JOIN `f_appointment` as app ON app.id=ref.appointment_id ";
        query += "LEFT JOIN `f_encounters` as enc ON enc.appointment_id=ref.appointment_id ";
        query += "LEFT JOIN `patient_list` as pt ON pt.id=ref.patient_id ";
        query += "LEFT JOIN `managers` as usr ON usr.id=ref.ref_to ";
        query += "LEFT JOIN `f_referral_tracking` as trk ON trk.id=( SELECT trk2.id FROM `f_referral_tracking` as trk2 WHERE trk2.referral_id=ref.id ORDER BY trk2.created_at desc LIMIT 1 )";
        query += "LEFT JOIN `f_referral_type` as ret ON ret.id=trk.referral_type_id ";
        query += "WHERE ref.clinic_id='"+entry.clinic_id+"' ";
        query += "AND FIND_IN_SET(usr.type, (";
        query += "SELECT GROUP_CONCAT(value) FROM `f_settings` WHERE type='appointment_doctor'";
        query += ")) ";
        if(entry.doctors){
            query += "AND FIND_IN_SET(ref.ref_to, '"+entry.doctors+"') ";
        }
        if(entry.specialty){
            query += "AND `specialty`='"+entry.specialty+"' ";
        }
        if(entry.range){
            var from_to = entry.range.split(",");
            query += "AND trk.created_at >= '"+from_to[0]+"' ";
            query += "AND trk.created_at < '"+from_to[1]+" 23:59:00' ";
        }
        // query += "GROUP BY trk.referral_id ";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    updateReferral: (entry, callback) => {
        let query = "UPDATE `f_referral` SET `"+entry.key+"`=? WHERE `id`= ? ";
        var values = []
        values.push(entry.value);
        values.push(entry.id);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    deleteReferral: (entry, callback) => {
        let query = "DELETE FROM `f_referral` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },

    chosenReferral: (entry, callback) => {
        let query = "SELECT ref.*, ins.insName as insurance, pt.FNAME as pt_fname, pt.LNAME as pt_lname, ";
        query += "pt.DOB as pt_dob, pt.GENDER as pt_gender, pt.ADDRESS as pt_address, pt.PHONE as pt_phone, ";
        query += "usr.fname as doctor_fname, usr.lname as doctor_lname, spc.name as doctor_specialty, ";
        query += "ret.display as referral_type, trk.referral_type_id as rt_type, trk.created_at as rt_date ";
        query += "FROM `f_referral` as ref ";
        query += "LEFT JOIN `insurances` as ins ON ins.id=ref.ins_id ";
        query += "LEFT JOIN `patient_list` as pt ON pt.id=ref.patient_id ";
        query += "LEFT JOIN `managers` as usr ON usr.id=ref.ref_to ";
        query += "LEFT JOIN `specialty` as spc ON spc.id=ref.specialty ";
        query += "LEFT JOIN `f_referral_tracking` as trk ON trk.referral_id=ref.id ";
        query += "LEFT JOIN `f_referral_type` as ret ON ret.id=trk.referral_type_id ";
        query += "WHERE ref.id=? ORDER BY trk.created_at";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getReferral: (entry, callback) => {
        let query = "SELECT * FROM `f_referral` ";
        query += "WHERE appointment_id="+entry.appointment_id;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    createReferral: (entry, callback) => {
        var provider_id = entry.clinic_provider;
        if(entry.provider=="1"){
            provider_id = entry.specialist_provider;
        }
        let query = "INSERT INTO `f_referral` (";
        query += "`clinic_id`, `ins_id`, `m_id`,`patient_id`,`emr_id`,`subscrber_no`,`year`,";
        query += "`referral_id`, `r_date`,`ref_from`,`ref_to`, `spe_npi`,";
        query += "`reason`,`priority`,`specialty`,`facility_id`,`appointment_id`";
        query += ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
        var values = []
        values.push(entry.clinic_id);
        values.push(entry.ins_id);
        values.push(entry.measure);
        values.push(entry.patient_id);
        values.push(entry.emr_id);
        values.push(entry.subscrber_no);
        values.push(entry.year);
        values.push('0');
        values.push(new Date().toISOString());
        values.push('');
        values.push(provider_id);
        values.push('');
        values.push(entry.reason);
        values.push(entry.priority);
        values.push(entry.specialty); //specialty
        values.push(''); //facility_id
        values.push(entry.appointment_id);
        
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    getReferralTracking: (entry, callback) => {
        let query = "SELECT t.* FROM `f_referral_tracking` as t ";
        query += "LEFT JOIN `f_referral` as r ON r.id=t.referral_id ";
        query += "WHERE r.appointment_id="+entry.appointment_id;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    createReferralTracking: (entry, callback) => {
        let query = "INSERT INTO `f_referral_tracking` (";
        query += "`referral_id`, `referral_category_id`, `referral_type_id`,`created_at`,`created_by`";
        query += ") VALUES (?, ?, ?, ?, ? )";
        var values = []
        values.push(entry.referral_id);
        values.push(entry.referral_category_id);
        values.push(entry.referral_type_id);
        values.push(entry.date?entry.date:new Date().toISOString());
        values.push(entry.user_id);
    
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    referralStatus: (entry, callback) => {
        let query = "SELECT ret.*, cat.display as categoryName FROM `f_referral_type` as ret ";
        query += "LEFT JOIN `f_referral_category` as cat ON cat.id=ret.category";
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    createReferralStatus: (entry, callback) => {
        let query = "INSERT INTO `f_referral_type` (";
        query += "`category`, `code`, `display`, `color`";
        query += ") VALUES (?, ?, ?, ?)";
        var values = []
        values.push(entry.category);
        values.push(entry.display.replace(" ","_").toLowerCase());
        values.push(entry.display);
        values.push(entry.color);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    updateReferralStatus: (entry, callback) => {
        let query = "UPDATE `f_referral_type` SET ";
        query += "`category`=?, `code`=?, `display`=?, `color`=?";
        query += "WHERE `id`= ? ";
        var values = []
        values.push(entry.category);
        values.push(entry.display.replace(" ","_").toLowerCase());
        values.push(entry.display);
        values.push(entry.color);
        values.push(entry.id);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    chosenReferralStatus: (entry, callback) => {
        let query = "SELECT * FROM `f_referral_type` WHERE id=?";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deleteReferralStatus: (entry, callback) => {
        let query = "DELETE FROM `f_referral_type` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    referralCategory: (entry, callback) => {
        let query = "SELECT * FROM `f_referral_category` ORDER BY `id`";
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    createReferralCategory: (entry, callback) => {
        let query = "INSERT INTO `f_referral_category` (";
        query += "`code`, `display`";
        query += ") VALUES (?, ?)";
        var values = []
        values.push(entry.display.replace(" ","_").toLowerCase());
        values.push(entry.display);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    updateReferralCategory: (entry, callback) => {
        let query = "UPDATE `f_referral_category` SET ";
        query += "`code`=?, `display`=?";
        query += "WHERE `id`= ? ";
        var values = []
        values.push(entry.display.replace(" ","_").toLowerCase());
        values.push(entry.display);
        values.push(entry.id);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    chosenReferralCategory: (entry, callback) => {
        let query = "SELECT * FROM `f_referral_category` WHERE id=?";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deleteReferralCategory: (entry, callback) => {
        let query = "DELETE FROM `f_referral_category` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    
}
module.exports = encounterRepo;