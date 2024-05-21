const connection = require('../../utilities/database');
var md5 = require('md5');
var lastday = function(y,m){
    if (m < 10) {
      m = '0' + m;
    }
    return  m+"/"+(new Date(y, m, 0).getDate())+"/"+y;
}
var firstday = function(y,m){
    if (m < 10) {
      m = '0' + m;
    }
    d = new Date(y, m, 1).getDate();
    if (d < 10) {
        d = '0' + d;
    }
    return  m+"/"+d+"/"+y;
}
const invoice = {
    getappsms: (clinicid) => {
        query = "SELECT `visittype`,COUNT(visittype) AS total FROM `tracksmssent` WHERE clinicid="+clinicid+" AND date <= STR_TO_DATE('"+lastday(new Date().getFullYear(),(new Date().getMonth()+1))+"', '%m/%d/%Y') AND date >= STR_TO_DATE('"+firstday(new Date().getFullYear(), new Date().getMonth()+1)+"', '%m/%d/%Y') GROUP BY visittype";
        return new Promise((resolve, reject) => {
            connection.query(query, (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
    gethedissms: (clinicid) => {
        query = "SELECT `mid`,COUNT(mid) AS total,mh_table.Measure,mh_table.Rates FROM `trackhedissmssent` LEFT JOIN mh_table ON mh_table.id = trackhedissmssent.mid WHERE trackhedissmssent.clinicid="+clinicid+" AND trackhedissmssent.date <= STR_TO_DATE('"+lastday(new Date().getFullYear(),(new Date().getMonth()+1))+"', '%m/%d/%Y') AND trackhedissmssent.date >= STR_TO_DATE('"+firstday(new Date().getFullYear(), new Date().getMonth()+1)+"', '%m/%d/%Y') GROUP BY mid";
        return new Promise((resolve, reject) => {
            connection.query(query, (err, rows) => {
                if (err) {
                reject(err);
                } else {
                resolve(rows);
                }
            });
        });
    },
}
module.exports = invoice;