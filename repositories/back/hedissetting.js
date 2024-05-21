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

var query_string = function(str, value){
    var result = value?value:"NULL";
    if(str){
        result = '\"'+str.toString().replace(/\"/g,'`').replace(/\n/g,'<br>')+'\"';
    }
    return ', '+result;
}

var query_bool = function(str){
    var result = '0';
    if(str=="true"){
        result = '1';
    }
    return ', \"'+result+'\"';
}
var query_json = function(str){
    
    var result = "NULL";
    if(str){
        result = "'"+JSON.stringify(str)+"'";
    }
    return ', '+result;

}
const setting = {
    gethdomain: (callback) => {
        let query = "SELECT * FROM `hcd_table` WHERE 1 ORDER BY Health_Care_Domain";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addhdomain: (entry, callback) => {
        let query = "INSERT INTO `hcd_table` (`id`, `Organization`, `Measure_Type`, `Health_Care_Domain`) VALUES (NULL, ? , ? , ? )";
        connection.query(query, [entry.org, entry.type, entry.domain], (err, result) => {
            callback(err, result);
        });
    },
    chosenhdomain: (entry, callback) => {
        let query = "SELECT * FROM `hcd_table` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatehdomain: (entry, callback) => {
        let query = "UPDATE `hcd_table` SET `Organization`= ?, `Measure_Type` = ?, `Health_Care_Domain` = ? WHERE `id`= ? ";
        connection.query(query, [entry.org, entry.type, entry.domain, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletehdomain: (entry, callback) => {
        let query = "DELETE FROM `hcd_table` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },


    getmeasure: (callback) => {
        let query = "SELECT mh_table.*,hcd_table.Health_Care_Domain as domain FROM `mh_table` LEFT JOIN `hcd_table` ON `hcd_table`.id = `mh_table`.D_ID WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addmeasure: (entry, callback) => {
        let query = "INSERT INTO `mh_table` (`id`, `D_ID`, `acronym`, `Measure`, `Rates`, `Percentage`, `Gender`, `quantity`, `Description`, `Age_Int`, `Age_End`, `Test_Span`, `Time_Frame`, `Clinical_items`, `Time_duration`, `date_type`, `keywords`) VALUES (NULL, ? , ? , ?, ? , ? , ?, ? , ? , ?, ? , ? , ?, ? , ?,? , ? )";
        connection.query(query, [entry.domain, entry.acronym, entry.measure, entry.rate, entry.percentage, entry.gender, entry.quantity, entry.description, entry.age_int, entry.age_end, entry.test_span, entry.time_frame, entry.clinic_items, entry.time_duration, entry.date_type, entry.variables], (err, result) => {
            callback(err, result);
        });
    },
    chosenmeasure: (entry, callback) => {
        let query = "SELECT * FROM `mh_table` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatemeasure: (entry, callback) => {
        let query = "UPDATE `mh_table` SET `D_ID`= ?, `acronym` = ?, `Measure` = ?, `Rates` = ?, `Percentage` = ?, `Gender` = ?, `quantity` = ?, `Description` = ?, `Age_Int` = ?, `Age_End` = ?, `Test_Span` = ?, `Time_Frame` = ?, `Clinical_items` = ?, `Time_duration` = ?, `date_type` = ?, `keywords` = ? WHERE `id`= ? ";
        connection.query(query, [entry.domain, entry.acronym, entry.measure, entry.rate, entry.percentage, entry.gender, entry.quantity, entry.description, entry.age_int, entry.age_end, entry.test_span, entry.time_frame, entry.clinic_items, entry.time_duration, entry.date_type, entry.variables, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletemeasure: (entry, callback) => {
        let query = "DELETE FROM `mh_table` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updateoutcome: (entry, callback) => {
        let query = "UPDATE `mh_table` SET `outcomecheck`= ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatemeasureyearly: (entry, callback) => {
        let query = "UPDATE `mh_table` SET `yearlycheck`= ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getoutranges: (entry, callback) => {
        let query = "SELECT * FROM `mh_out_range` WHERE `mid`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    addoutrangevalue: (entry, callback) => {
        let query = "INSERT INTO `mh_out_range` (`id`, `mid`, `name`, `v1`, `v2`) VALUES (NULL, ? , ? , ? , ? )";
        connection.query(query, [entry.id, entry.name, entry.v1, entry.v2], (err, result) => {
            callback(err, result);
        });
    },
    deleteoutrangevalue: (entry, callback) => {
        let query = "DELETE FROM `mh_out_range` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },




    getcim: (callback) => {
        let query = "SELECT cpt_icd_map.*,mh_table.Measure,mh_table.Gender,mh_table.Age_Int,mh_table.Age_end FROM `cpt_icd_map` LEFT JOIN `mh_table` ON `mh_table`.id = `cpt_icd_map`.M_ID WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addcim: (entry, callback) => {
        let query = "INSERT INTO `cpt_icd_map` (`id`, `M_ID`, `it_id`, `Des`, `Value`, `sex`, `age_from`, `age_to`, `CPT_1`, `CPT_2`, `ICD_10`, `ICD_10_2`, `ICD_10_3`, `ICD_10_4`, `ICD_9`, `LOCIN`, `LOCIN2`, `LOCIN3`) VALUES (NULL, ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ? , ?, ?, ?, ? )";
        connection.query(query, [entry.m_id, entry.it_id, entry.desc, entry.value, entry.gender, entry.age_from, entry.age_to, entry.cpt1, entry.cpt2, entry.icd1, entry.icd2, entry.icd3, entry.icd4, entry.icd5, entry.locin1, entry.locin2, entry.locin3], (err, result) => {
            callback(err, result);
        });
    },
    chosencim: (entry, callback) => {
        let query = "SELECT * FROM `cpt_icd_map` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatecim: (entry, callback) => {
        let query = "UPDATE `cpt_icd_map` SET `M_ID`= ?, `it_id` = ?, `Des` = ?, `Value` = ?, `sex` = ?, `age_from` = ?, `age_to` = ?, `CPT_1` = ?, `CPT_2` = ?, `ICD_10` = ?, `ICD_10_2` = ?, `ICD_10_3` = ?, `ICD_10_4` = ?, `ICD_9` = ?, `LOCIN` = ?, `LOCIN2` = ?, `LOCIN3` = ? WHERE `id`= ? ";
        connection.query(query, [entry.m_id, entry.it_id, entry.desc, entry.value, entry.gender, entry.age_from, entry.age_to, entry.cpt1, entry.cpt2, entry.icd1, entry.icd2, entry.icd3, entry.icd4, entry.icd5, entry.locin1, entry.locin2, entry.locin3, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletecim: (entry, callback) => {
        let query = "DELETE FROM `cpt_icd_map` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatecimrange: (entry, callback) => {
        let query = "UPDATE `cpt_icd_map` SET `rangecheck`= ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getcimranges: (entry, callback) => {
        let query = "SELECT * FROM `cim_range` WHERE `cimid`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    addcimrangevalue: (entry, callback) => {
        let query = "INSERT INTO `cim_range` (`id`, `cimid`, `icd`, `v1`, `v2`) VALUES (NULL, ? , ? , ? , ? )";
        connection.query(query, [entry.id, entry.name, entry.v1, entry.v2], (err, result) => {
            callback(err, result);
        });
    },
    deletecimrangevalue: (entry, callback) => {
        let query = "DELETE FROM `cim_range` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    gethdate: (callback) => {
        let query = "SELECT * FROM `hedisdaterange` WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    updatehdate: (entry,callback) => {
        let query = "SELECT * FROM `hedisdaterange` WHERE 1";
        connection.query(query, (err, result) => {
            if(result.length > 0){
                let query = "UPDATE `hedisdaterange` SET `edate`= STR_TO_DATE('"+lastday(entry.date,12)+"', '%m/%d/%Y'),`idate`= STR_TO_DATE('"+firstday(entry.date,1)+"', '%m/%d/%Y') WHERE `id`= ? ";
                connection.query(query, [result[0].id], (err, result1) => {
                    callback(err, result1);
                });
            }
            else{
                let query = "INSERT INTO `hedisdaterange` (`id`, `idate`, `edate`, `datecheck`) VALUES (NULL, STR_TO_DATE('"+firstday(entry.date,1)+"', '%m/%d/%Y') , STR_TO_DATE('"+lastday(entry.date,12)+"', '%m/%d/%Y') , ?)";
                connection.query(query, [1], (err, result1) => {
                    callback(err, result1);
                });
            }
        });
    },
    getcolor: (callback) => {
        let query = "SELECT * FROM `hedis_color` WHERE 1 ORDER BY scheck";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addcolor: (entry, callback) => {
        let query = "INSERT INTO `hedis_color` (`id`, `type`, `category`, `name`, `acronym`, `description`, `status`, `tcolor`, `bcolor`, `scheck`) VALUES (NULL, ? , ? , ?, ? , ? , ?, ? , ?, ? )";
        connection.query(query, [entry.type, entry.cat, entry.name, entry.acronym, entry.desc, entry.status, entry.tcolor, entry.bcolor,entry.check], (err, result) => {
            callback(err, result);
        });
    },
    chosencolor: (entry, callback) => {
        let query = "SELECT * FROM `hedis_color` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatecolor: (entry, callback) => {
        let query = "UPDATE `hedis_color` SET `type`= ?, `category`= ?, `name` = ?, `acronym` = ?, `description` = ?, `status` = ?, `tcolor` = ?, `bcolor` = ?, `scheck` = ? WHERE `id`= ? ";
        connection.query(query, [entry.type, entry.cat, entry.name, entry.acronym, entry.desc, entry.status, entry.tcolor, entry.bcolor,entry.check, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletecolor: (entry, callback) => {
        let query = "DELETE FROM `hedis_color` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getimeasure: (callback) => {
        let query = "SELECT `id`,`name`,`desc` FROM `gsetting` WHERE type='imeasure' ORDER BY `name`";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addimeasure: (entry, callback) => {
        let query = "INSERT INTO `gsetting` (`id`,`type`, `name`, `desc`) VALUES (NULL, 'imeasure', ?, ?)";
        connection.query(query, [entry.name, entry.desc], (err, result) => {
            callback(err, result);
        });
    },
    chosenimeasure: (entry, callback) => {
        let query = "SELECT `name`,`desc` FROM `gsetting` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updateimeasure: (entry, callback) => {
        let query = "UPDATE `gsetting` SET `name`= ?, `desc` = ? WHERE `id`= ? ";
        connection.query(query, [entry.name, entry.desc, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deleteimeasure: (entry, callback) => {
        let query = "DELETE FROM `gsetting` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getnmeasure: () => {
        let query = "SELECT `id`,`measure` FROM `hedis_track` GROUP BY `measure`";
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
    getdefinedmeasure: () => {
        let query = "SELECT `id`,`keywords` FROM `mh_table`";
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
    deletenmeasure: (entry, callback) => {
        let query = "";
        if(entry.measure == "null" || entry.measure == "")
            query = "DELETE FROM `hedis_track` WHERE measure IS NULL";
        else
            query = "DELETE FROM `hedis_track` WHERE `measure`= '"+entry.measure+"'";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    applymeasure: (entry, callback) => {
        let query = "SELECT `keywords` FROM `mh_table` WHERE `id` = ?";
        connection.query(query, [entry.id], (err, result) => {
            let query = "UPDATE `mh_table` SET `keywords`= ? WHERE `id`= ? ";
            if(result[0]['keywords'] == null || result[0]['keywords'] == ""){
                connection.query(query, [entry.variable, entry.id], (err, result1) => {
                    callback(err, result1);
                });
            }
            else{
                connection.query(query, [result[0]['keywords']+","+entry.variable, entry.id], (err, result1) => {
                    callback(err, result1);
                });
            }
        });
    },
    getmtime: (callback) => {
        let query = "SELECT * FROM `measure_time_frame` WHERE 1 ORDER BY name";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addmtime: (entry, callback) => {
        let query = "INSERT INTO `measure_time_frame` (`id`, `name`, `description`, `type`, `range`) VALUES (NULL, ? , ? , ?, ? )";
        connection.query(query, [entry.name, entry.desc, entry.type, entry.range], (err, result) => {
            callback(err, result);
        });
    },
    chosenmtime: (entry, callback) => {
        let query = "SELECT * FROM `measure_time_frame` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatemtime: (entry, callback) => {
        let query = "UPDATE `measure_time_frame` SET `name`= ?, `description` = ?, `type` = ?, `range` = ? WHERE `id`= ? ";
        connection.query(query, [entry.name, entry.desc, entry.type, entry.range, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deletemtime: (entry, callback) => {
        let query = "DELETE FROM `measure_time_frame` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getfilenames: (callback) => {
        let query = "SELECT confilename.*,insurances.insName FROM `confilename` LEFT JOIN `insurances` ON `insurances`.id = `confilename`.insid WHERE 1";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addfilename: (entry, callback) => {
        let query = "INSERT INTO `confilename` (`id`, `insid`, `name`, `filetype`, `filedefinition`) VALUES (NULL, ? , ? , ?, ? )";
        connection.query(query, [entry.insid, entry.value, entry.filetype, entry.filedefinition], (err, result) => {
            callback(err, result);
        });
    },
    deletefilename: (entry, callback) => {
        let query = "DELETE FROM `confilename` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            let query = "DELETE FROM `confieldname` WHERE `filenameid`= ? ";
            connection.query(query, [entry.id], (err, result) => {
                callback(err, result);
            });
        });
    },
    chosenfilename: (entry, callback) => {
        let query = "SELECT * FROM `confilename` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updatefilename: (entry, callback) => {
        let query = "UPDATE `confilename` SET `name`= ?, `filetype` = ?, `filedefinition` = ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.filetype, entry.filedefinition, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getfieldlists: (entry, callback) => {
        let query = "SELECT * FROM `confieldname` WHERE `filenameid`= ? ORDER BY `order`"
        connection.query(query, [entry.filename], (err, result) => {
            callback(err, result);
        });
    },
    addfield: (entry, callback) => {
        let query = "SELECT * FROM `confieldname` WHERE `filenameid`= ?"
        connection.query(query, [entry.filename], (err, result) => {
            let query = "INSERT INTO `confieldname` (`id`, `filenameid`, `fieldname`, `fieldtype`, `fieldformat`, `required`, `order`) VALUES (NULL, ? , ? , ? , ? , ? , ? )";
            connection.query(query, [entry.filename, entry.fieldname, entry.fieldtype, entry.fieldformat, entry.required, result.length+1], (err, result) => {
                let query = "SELECT * FROM `confieldname` WHERE `filenameid`= ? ORDER BY `order`"
                connection.query(query, [entry.filename], (err, result) => {
                    callback(err, result);
                });
            });
        });
    },
    deletefield: (entry, callback) => {
        let query = "DELETE FROM `confieldname` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    editfield: (entry, callback) => {
        let query = "SELECT * FROM `confieldname` WHERE `id`= "+entry.id;
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
    updatefield: (entry, callback) => {
        let query = "UPDATE `confieldname` SET `fieldname`= ?, `fieldtype` = ?, `fieldformat` = ?, `required` = ?, `mapfield` = ? WHERE `id`= ? ";
        connection.query(query, [entry.fieldname, entry.fieldtype, entry.fieldformat, entry.required, entry.mapfield, entry.id], (err, result) => {
            let query = "SELECT * FROM `confieldname` WHERE `filenameid`= ? ORDER BY `order`"
            connection.query(query, [entry.filename], (err, result) => {
                callback(err, result);
            });
        });
    },
    setPosfield: (entry) => {
        for(var i = 0;i < entry.field_idarray.length;i++){
            let query = "UPDATE `confieldname` SET `order`= ? WHERE `id`= ? ";
            new Promise((resolve, reject) => {
                connection.query(query,[i+1, entry.field_idarray[i]], (err, rows) => {
                    if (err) {
                    reject(err);
                    } else {
                    resolve(rows);
                    }
                });
            });
        }
        return true;
    },
    getfilealiases: (callback) => {
        let query = "SELECT * FROM `hedis_fields_variables` WHERE 1 ORDER BY fields";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    updatefilealiases: (entry, callback) => {
        let query = "UPDATE `hedis_fields_variables` SET `variables`= ? WHERE `id`= ? ";
        connection.query(query, [entry.value, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getidomain: (callback) => {
        let query = "SELECT insdomain.*,insurances.insName FROM `insdomain` LEFT JOIN `insurances` ON `insurances`.id = `insdomain`.insid WHERE 1 ORDER BY insurances.insName";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    addidomain: (entry, callback) => {
        let query = "INSERT INTO `insdomain` (`id`, `insid`, `domain`, `description`) VALUES (NULL, ? , ? , ? )";
        connection.query(query, [entry.insid, entry.domain, entry.desc], (err, result) => {
            callback(err, result);
        });
    },
    chosenidomain: (entry, callback) => {
        let query = "SELECT * FROM `insdomain` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    updateidomain: (entry, callback) => {
        let query = "UPDATE `insdomain` SET `insid`= ?, `domain` = ?, `description` = ? WHERE `id`= ? ";
        connection.query(query, [entry.insid, entry.domain, entry.desc, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    deleteidomain: (entry, callback) => {
        let query = "DELETE FROM `insdomain` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    qppMeasuresData: (entry, callback) => {
        let query = "SELECT id, measureId, nqfId, title, eMeasureId FROM `f_qpp_measure_data` WHERE eyear=? Order By measureId"
        connection.query(query, [entry.eyear], (err, result) => {
            callback(err, result);
        });
    },
    qppMeasuresDataById: (entry, callback) => {
        let query = "SELECT * FROM `f_qpp_measure_data` WHERE id=?"
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getYearsQppMeasuresData: (entry, callback) => {
        let query = "SELECT eyear FROM `f_qpp_measure_data` GROUP BY eyear"
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
       
    importQppMeasuresData: (entry, callback) => {
        let query = "Delete FROM `f_qpp_measure_data` where eyear=?";
        connection.query(query, [entry.year], (err, result) => {
            console.log(entry.data.length);
            entry.data.forEach(function (data, index) {
                query = "INSERT INTO `f_qpp_measure_data` (";
                query += "`eyear`, `title`, `eMeasureId`, `nqfEMeasureId`, `nqfId`, `measureId`, ";
                query += "`description`, `nationalQualityStrategyDomain`, `measureType`, `isHighPriority`, `primarySteward`, `metricType`, ";
                query += "`firstPerformanceYear`, `lastPerformanceYear`, `isInverse`, `category`, `isRegistryMeasure`, `isRiskAdjusted`, ";
                query += "`icdImpacted`, `isClinicalGuidelineChanged`, `isIcdImpacted`, `clinicalGuidelineChanged`, `allowedPrograms`, `submissionMethods`, ";
                query += "`measureSets`, `measureSpecification`, `eMeasureUuid`, `strata`, `eligibilityOptions`, `performanceOptions`";
                query += ") VALUES (?";
                query += query_string(data['title']);
                query += query_string(data['eMeasureId']);
                query += query_string(data['nqfEMeasureId']);
                query += query_string(data['nqfId']);
                query += query_string(data['measureId']);
                query += query_string(data['description']);
                query += query_string(data['nationalQualityStrategyDomain']);
                query += query_string(data['measureType']);
                query += query_bool(data['isHighPriority']);
                query += query_string(data['primarySteward']);
                query += query_string(data['metricType']);
                query += query_string(data['firstPerformanceYear']);
                query += query_string(data['lastPerformanceYear']);
                query += query_bool(data['isInverse']);
                query += query_string(data['category']);
                query += query_bool(data['isRegistryMeasure']);
                query += query_bool(data['isRiskAdjusted']);
                query += query_json(data['icdImpacted']);
                query += query_bool(data['isClinicalGuidelineChanged']);
                query += query_bool(data['isIcdImpacted']);
                query += query_json(data['clinicalGuidelineChanged']);
                query += query_json(data['allowedPrograms']);
                query += query_json(data['submissionMethods']);
                query += query_json(data['measureSets']);
                query += query_json(data['measureSpecification']);
                query += query_string(data['eMeasureUuid']);
                query += query_json(data['strata']);
                query += query_json(data['eligibilityOptions']);
                query += query_json(data['performanceOptions']);
                query += ");";
                connection.query(query, [entry.year], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });

    },
    measuresData: (entry, callback) => {
        let query = "SELECT id, measureId, nqfId, title, acronym FROM `measure_hedis` ORDER BY measureId"
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    addMeasureaData: (entry, callback) => {
        let query = "INSERT INTO `measure_hedis` (";
        query += "`eyear`, `title`, `acronym`, `multiple`, `multipleQuantity`, `multipleTest`, `hedis`, ";
        query += "`nameMap`, `eMeasureId`, `nqfEMeasureId`, `nqfId`, `measureId`, ";
        query += "`description`, `nationalQualityStrategyDomain`, `measureType`, `isHighPriority`, `primarySteward`, ";
        query += "`metricType`, `firstPerformanceYear`, `lastPerformanceYear`, `isInverse`, `category`, ";
        query += "`isRegistryMeasure`, `isRiskAdjusted`, `icdImpacted`, `isClinicalGuidelineChanged`, `isIcdImpacted`,  ";
        query += "`clinicalGuidelineChanged`, `allowedPrograms`, `submissionMethods`, `measureSets`, `measureSpecification`, ";
        query += "`eMeasureUuid`, `strata`, `eligibilityOptions`, `performanceOptions`) ";
        query += " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
        var values = []
        values.push(entry.eyear?entry.eyear:'0');
        values.push(entry.title);
        values.push(entry.acronym?entry.acronym:'');
        values.push(entry.multiple?entry.multiple:'0');
        values.push(entry.multipleQuantity?entry.multipleQuantity:'1');
        values.push(entry.multipleTest?entry.multipleTest:'0');
        values.push(entry.hedis?entry.hedis:'0');
        values.push(entry.nameMap?entry.nameMap:'');
        values.push(entry.eMeasureId);
        values.push(entry.nqfEMeasureId);
        values.push(entry.nqfId);
        values.push(entry.measureId);
        values.push(entry.description);
        values.push(entry.nationalQualityStrategyDomain);
        values.push(entry.measureType);
        values.push(entry.isHighPriority);
        values.push(entry.primarySteward);
        values.push(entry.metricType);
        values.push(entry.firstPerformanceYear);
        values.push(entry.lastPerformanceYear);
        values.push(entry.isInverse);
        values.push(entry.category);
        values.push(entry.isRegistryMeasure);
        values.push(entry.isRiskAdjusted);
        values.push(entry.icdImpacted);
        values.push(entry.isClinicalGuidelineChanged);
        values.push(entry.isIcdImpacted);
        values.push(entry.clinicalGuidelineChanged);
        values.push(entry.allowedPrograms);
        values.push(entry.submissionMethods);
        values.push(entry.measureSets);
        values.push(entry.measureSpecification);
        values.push(entry.eMeasureUuid);
        values.push(entry.strata);
        values.push(entry.eligibilityOptions);
        values.push(entry.performanceOptions);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    updateMeasureaData: (entry, callback) => {
        let query = "UPDATE `measure_hedis` SET ";
        query += "`title`=?, `acronym`=?, `multiple`=?, `multipleQuantity`=?, `multipleTest`=?, `hedis`=?, ";
        query += "`nameMap`=?, `eMeasureId`=?, `nqfEMeasureId`=?, `nqfId`=?, `measureId`=?, ";
        query += "`description`=?, `nationalQualityStrategyDomain`=?, `measureType`=?, `isHighPriority`=?, `primarySteward`=?, ";
        query += "`metricType`=?, `firstPerformanceYear`=?, `lastPerformanceYear`=?, `isInverse`=?, `category`=?, ";
        query += "`isRegistryMeasure`=?, `isRiskAdjusted`=?, `icdImpacted`=?, `isClinicalGuidelineChanged`=?, `isIcdImpacted`=?,  ";
        query += "`clinicalGuidelineChanged`=?, `allowedPrograms`=?, `submissionMethods`=?, `measureSets`=?, `measureSpecification`=?, ";
        query += "`eMeasureUuid`=?, `strata`=?, `eligibilityOptions`=?, `performanceOptions`=? ";
        query += " WHERE `id`=? ";
        var values = []
        values.push(entry.title);
        values.push(entry.acronym);
        values.push(entry.multiple);
        values.push(entry.multipleQuantity);
        values.push(entry.multipleTest);
        values.push(entry.hedis);
        values.push(entry.nameMap);
        values.push(entry.eMeasureId);
        values.push(entry.nqfEMeasureId);
        values.push(entry.nqfId);
        values.push(entry.measureId);
        values.push(entry.description);
        values.push(entry.nationalQualityStrategyDomain);
        values.push(entry.measureType);
        values.push(entry.isHighPriority);
        values.push(entry.primarySteward);
        values.push(entry.metricType);
        values.push(entry.firstPerformanceYear);
        values.push(entry.lastPerformanceYear);
        values.push(entry.isInverse);
        values.push(entry.category);
        values.push(entry.isRegistryMeasure);
        values.push(entry.isRiskAdjusted);
        values.push(entry.icdImpacted);
        values.push(entry.isClinicalGuidelineChanged);
        values.push(entry.isIcdImpacted);
        values.push(entry.clinicalGuidelineChanged);
        values.push(entry.allowedPrograms);
        values.push(entry.submissionMethods);
        values.push(entry.measureSets);
        values.push(entry.measureSpecification);
        values.push(entry.eMeasureUuid);
        values.push(entry.strata);
        values.push(entry.eligibilityOptions);
        values.push(entry.performanceOptions);
        values.push(entry.id);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },
    deleteMeasureaData: (entry, callback) => {
        let query = "DELETE FROM `measure_hedis` WHERE id=? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    measuresDataById: (entry, callback) => {
        let query = "SELECT * FROM `measure_hedis` WHERE id=?"
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    vsPublicationState: (entry, callback) => {
        let query = "SELECT * FROM `f_vs_publication_status` "
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    vsJurisdiction: (entry, callback) => {
        let query = "SELECT * FROM `f_vs_jurisdiction` "
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    vsObservationCategory: (entry, callback) => {
        let query = "SELECT * FROM `f_vs_observation_category` "
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    vsSpecimenType: (entry, callback) => {
        let query = "SELECT * FROM `f_vs_specimentype` "
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    vsPermittedDataType: (entry, callback) => {
        let query = "SELECT * FROM `f_vs_permit_data_type` "
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    csCalendarCycle: (entry, callback) => {
        let query = "SELECT * FROM `f_cs_calendar_cycle` "
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    getMeasureObservation: (entry, callback) => {
        let query = "SELECT o.*, q.title FROM `measure_observation_definition` as o";
        query += " LEFT JOIN `f_qpp_measure_data` as q ON q.measureId=o.m_id";
        query += " WHERE q.eyear = 2023";
        connection.query(query, [], (err, result) => {
            callback(err, result);
        });
    },
    getMeasureObservationById: (entry, callback) => {
        let query = "SELECT * FROM `measure_observation_definition` WHERE id=? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getMeasureObservationByMeasure: (entry, callback) => {
        let query = "SELECT * FROM `measure_observation_definition` WHERE m_id=? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    
    deleteMeasureObservation: (entry, callback) => {
        let query = "DELETE FROM `measure_observation_definition` WHERE id=? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    
    addMeasureObservation: (entry, callback) => {
        let query = "INSERT INTO `measure_observation_definition` (`id`, ";
        query += "`m_id`, `name`, `preferredReportName`, `title`, `multiple`, `quantity`, `description`, `p_status`, ";
        query += "`lastdate`, `publisher`, `url`, `jurisdiction`, `purpose`, `category`, ";
        query += "`specimen_type`, `permitted_data_type`, `calendar_cycle`, `calendar_length`, `qualified_value`, `acronym`, ";
        query += "`ICD`, `CPT`, `HCPCS`, `LOINC`, `SNOMED`, `observ_name_map`, ";
        query += "`min_age`, `max_age`, `time_cycle`, `ins_acronym`)";
        query += " VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )";
        var values = []
        values.push(entry.mid);
        values.push(entry.name);
        values.push(entry.report_name);
        values.push(entry.title);
        values.push(entry.multiple);
        values.push(entry.quantity);
        values.push(entry.description);
        values.push(entry.status);
        values.push(entry.ldate);
        values.push(entry.publisher);
        values.push(entry.url);
        values.push(entry.jurisdiction);
        values.push(entry.purpose);
        values.push(entry.category);
        values.push(entry.specimen_type);
        values.push(entry.permitted_data_type);
        values.push(entry.calendar_cycle);
        values.push(entry.calendar_length);
        values.push(entry.qualified);
        values.push(entry.acronym);
        values.push(entry.icd);
        values.push(entry.cpt);
        values.push(entry.hcpcs);
        values.push(entry.loinc);
        values.push(entry.snomed);
        values.push(entry.map);
        values.push(entry.min_age);
        values.push(entry.max_age);
        values.push(entry.time_cycle);
        values.push(entry.ins_acronym);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },

    updateMeasureObservation: (entry, callback) => {
        let query = "UPDATE `measure_observation_definition` SET ";
        query += "`m_id`=?, `name`=?, `preferredReportName`=?, `title`=?, `multiple`=?, `quantity`=?, `description`=?, `p_status`=?, ";
        query += "`lastdate`=?, `publisher`=?, `url`=?, `jurisdiction`=?, `purpose`=?, `category`=?, ";
        query += "`specimen_type`=?, `permitted_data_type`=?, `calendar_cycle`=?, `calendar_length`=?, `qualified_value`=?, `acronym`=?, ";
        query += "`ICD`=?, `CPT`=?, `HCPCS`=?, `LOINC`=?, `SNOMED`=?, `observ_name_map`=?, ";
        query += "`min_age`=?, `max_age`=?, `time_cycle`=?, `ins_acronym`=? ";
        query += " WHERE `id`=? ";
        var values = []
        values.push(entry.mid);
        values.push(entry.name);
        values.push(entry.report_name);
        values.push(entry.title);
        values.push(entry.multiple);
        values.push(entry.quantity);
        values.push(entry.description);
        values.push(entry.status);
        values.push(entry.ldate);
        values.push(entry.publisher);
        values.push(entry.url);
        values.push(entry.jurisdiction);
        values.push(entry.purpose);
        values.push(entry.category);
        values.push(entry.specimen_type);
        values.push(entry.permitted_data_type);
        values.push(entry.calendar_cycle);
        values.push(entry.calendar_length);
        values.push(entry.qualified);
        values.push(entry.acronym);
        values.push(entry.icd);
        values.push(entry.cpt);
        values.push(entry.hcpcs);
        values.push(entry.loinc);
        values.push(entry.snomed);
        values.push(entry.map);
        values.push(entry.min_age);
        values.push(entry.max_age);
        values.push(entry.time_cycle);
        values.push(entry.ins_acronym);
        values.push(entry.id);
        connection.query(query, values, (err, result) => {
            callback(err, result);
        });
    },

    getstatusreason: (callback) => {
        let query = "SELECT *  FROM f_c_statusreason Where 1 ";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getstatuscode: (callback) => {
        let query = "SELECT *  FROM f_e_status Where 1 ";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getcategorycode: (callback) => {
        let query = "SELECT *  FROM f_c_category Where 1 ";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    gettopiccode: (callback) => {
        let query = "SELECT *  FROM f_c_topic Where 1 ";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getmediumcode: (callback) => {
        let query = "SELECT *  FROM f_pmode_medium Where 1 ";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getprioritycode: (callback) => {
        let query = "SELECT *  FROM f_vs_request_priority Where 1 ";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getedcategorycode: (callback) => {
        let query = "SELECT *  FROM f_r_edu_category Where 1 ";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    getcomcategorycode: (callback) => {
        let query = "SELECT *  FROM f_r_com_category Where 1 ";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    
    
}
module.exports = setting;