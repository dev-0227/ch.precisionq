const connection = require('../../utilities/database');

const AuditEvent = {
    logger: (entry, callback) => {
        var  s = new Date(entry.sdate);
        var sstr = [s.getFullYear(), s.getMonth()+1, s.getDate(),].join('-') + ' 00:00:00';
        var  e = new Date(entry.edate);
        var estr = [e.getFullYear(), e.getMonth()+1, e.getDate()].join('-') + ' 23:59:59';
        var where = "recorded >= '"+sstr+"' ";
         where += " AND recorded <= '"+estr+"' ";
        let query = "SELECT u.fname as u_fname, u.lname as u_lname, u.email as u_email, ";
        query += "pl.fname as pt_fname, pl.lname as pt_lname, pl.patientid as pt_emr_id, ";
        query += "t.display as type,  st.display as subtype, a.display as action, ";
        query += "oc.code as outcome, e.description,  e.recorded as time ";
        query += "FROM `f_audit_event` AS e ";
        query += "LEFT JOIN `managers` AS u ON u.id = e.`user_id` ";
        query += "LEFT JOIN `patient_list` AS pl ON pl.id = e.`patient_id` ";
        query += "LEFT JOIN `f_vs_audit_event_type` AS t ON t.id = e.`type_id` ";
        query += "LEFT JOIN `f_vs_audit_event_subtype` AS st ON st.`id` = e.`subtype_id` ";
        query += "LEFT JOIN `f_vs_audit_event_action` AS a ON a.`id` = e.`action_id` ";
        query += "LEFT JOIN `f_vs_audit_event_outcome` AS oc ON oc.`id` = e.`outcome_id` ";
        query += "WHERE "+ where;
        query += "ORDER BY e.recorded desc";
   

        connection.query(query, (err, result) => {
            callback(err, result);
        });
    }
}
module.exports = AuditEvent;