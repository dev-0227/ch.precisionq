const connection = require('../../utilities/database');
var md5 = require('md5');
const setting = {
    getgroups: (callback) => {
        let query = "SELECT * FROM `gsetting` WHERE `type`= 'pgroup' ORDER BY name";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getsubgroups: (callback) => {
        let query = "SELECT gsetting.*,t1.name AS parent FROM `gsetting` LEFT JOIN `gsetting` AS t1 ON t1.id = `gsetting`.agerange WHERE gsetting.`type`= 'spgroup' ORDER BY t1.name";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getexclusion: (entry,callback) => {
        let query = "SELECT payment AS value FROM `gsetting` WHERE `type`= 'cptexclusion' AND clinicid="+entry.clinicid;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getmultisearchparams: (entry,callback) => {
        let query = "SELECT `desc`,`agerange`,`age` FROM `gsetting` WHERE `type`= 'multisearch' AND clinicid="+entry.clinicid;
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    setexclusion: (entry,callback) => {
        let query = "SELECT id FROM `gsetting` WHERE `type`= 'cptexclusion' AND clinicid="+entry.clinicid;
        connection.query(query, (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `gsetting` SET `payment`='"+entry.value+"' WHERE `type`= 'cptexclusion' AND clinicid="+entry.clinicid;
                connection.query(query, (err, result) => {
                    callback(err, result);
                });
            }
            else{
                let query = "INSERT INTO `gsetting` (`id`, `type`,`clinicid`, `payment`) VALUES (NULL, 'cptexclusion', "+entry.clinicid+", "+entry.value+")";
                connection.query(query, (err, result) => {
                    callback(err, result);
                });
            }
        });
    },
    setmultisearchparams: (entry,callback) => {
        let query = "SELECT id FROM `gsetting` WHERE `type`= 'multisearch' AND clinicid="+entry.clinicid;
        connection.query(query, (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `gsetting` SET `desc`=?,`agerange`=?,`age`=? WHERE `type`= 'multisearch' AND clinicid="+entry.clinicid;
                connection.query(query,[JSON.stringify(entry.spec),entry.group,entry.type], (err, result) => {
                    callback(err, result);
                });
            }
            else{
                let query = "INSERT INTO `gsetting` (`id`, `type`,`clinicid`, `desc`, `agerange`, `age`) VALUES (NULL, ?, ?, ?, ?, ?)";
                connection.query(query,["multisearch",entry.clinicid,JSON.stringify(entry.spec),entry.group,entry.type], (err, result) => {
                    callback(err, result);
                });
            }
        });
    },
    //Group Area
    addgroup: (entry, callback) => {
        let query = "INSERT INTO `gsetting` (`id`, `type`, `name`, `desc`) VALUES (NULL, ? , ? , ? )";
        connection.query(query, ["pgroup", entry.name, entry.desc], (err, result) => {
            callback(err, result);
        });
    },
    chosengroup: (entry, callback) => {
        let query = "SELECT * FROM `gsetting` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updategroup: (entry, callback) => {
        let query = "UPDATE `gsetting` SET `name`= ?, `desc` = ? WHERE `id`= ? ";
        connection.query(query, [entry.name, entry.desc, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletegroup: (entry, callback) => {
        let query = "DELETE FROM `gsetting` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },

    //Subgroup Area
    addsubgroup: (entry, callback) => {
        let query = "INSERT INTO `gsetting` (`id`, `type`, `agerange`, `name`, `desc`) VALUES (NULL, ? , ? , ? , ? )";
        connection.query(query, ["spgroup", entry.group, entry.name, entry.desc], (err, result) => {
            callback(err, result);
        });
    },
    chosensubgroup: (entry, callback) => {
        let query = "SELECT * FROM `gsetting` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatesubgroup: (entry, callback) => {
        let query = "UPDATE `gsetting` SET `agerange`= ?, `name`= ?, `desc` = ? WHERE `id`= ? ";
        connection.query(query, [entry.group, entry.name, entry.desc, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletesubgroup: (entry, callback) => {
        let query = "DELETE FROM `gsetting` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
}
module.exports = setting;