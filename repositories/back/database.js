const connection = require('../../utilities/database');
const qppMeasuresData = require('../../tmp/measures/2018/enriched-measures-data-quality.json')

const roles = {
    import_entity_types: (entry, callback) => {

        let query = "DELETE FROM `f_vs_audit_entity_type`";
        connection.query(query, [], (err, result) => {

            entry.types.forEach(function (data, index) {
                var f = data.split(',');
                query = "INSERT INTO `f_vs_audit_entity_type` (`id`, `code`, `system`,`display`, `definition`) VALUES (?, ? , ? , ? , ? )";
                connection.query(query, [index+1, f[0], f[1], f[2], f[3]], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });

    },

    import_event_types: (entry, callback) => {

        let query = "DELETE FROM `f_vs_audit_event_type`";
        connection.query(query, [], (err, result) => {

            entry.types.forEach(function (data, index) {
                var f = data.split(',');
                query = "INSERT INTO `f_vs_audit_event_type` (`id`, `code`, `system`,`display`, `definition`) VALUES (?, ? , ? , ? , ? )";
                connection.query(query, [index+1, f[0], f[1], f[2], f[3]], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });

    },

    import_event_sub_types: (entry, callback) => {

        let query = "DELETE FROM `f_vs_audit_event_subtype`";
        connection.query(query, [], (err, result) => {

            entry.types.forEach(function (data, index) {
                var f = data.split(',');
                query = "INSERT INTO `f_vs_audit_event_subtype` (`id`, `code`, `system`,`display`, `definition`) VALUES (?, ? , ? , ? , ? )";
                connection.query(query, [index+1, f[0], f[1], f[2], f[3]], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });

    },

    import_languages: (entry, callback) => {

        let query = "DELETE FROM `f_vs_cov_languages`";
        connection.query(query, [], (err, result) => {
            
            entry.types.forEach(function (data, index) {
                var f = data.split(',');
                query = "INSERT INTO `f_vs_cov_languages` (`id`, `code`, `display`,`danish`, `german`,`english`, `dutch`,`polish`, `russia`, `china`) VALUES (?, ? , ? , ? , ?, ?, ?, ?, ?, ? )";
                connection.query(query, [index+1, f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], f[8]], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });

    },

    import_currencies: (entry, callback) => {

        let query = "DELETE FROM `f_vs_currencies`";
        connection.query(query, [], (err, result) => {

            entry.types.forEach(function (data, index) {
                var f = data.split(',');
                query = "INSERT INTO `f_vs_currencies` (`id`, `code`, `display`) VALUES (?, ? , ?)";
                connection.query(query, [index+1, f[0], f[1]], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });

    },

    import_coverage_types: (entry, callback) => {

        let query = "DELETE FROM `f_vs_cov_type`";
        connection.query(query, [], (err, result) => {

            entry.types.forEach(function (data, index) {
                var f = data.split(',');
                query = "INSERT INTO `f_vs_cov_type` (`id`, `code`, `system`,`display`, `definition`) VALUES (?, ? , ? , ? , ? )";
                connection.query(query, [index+1, f[0], f[1], f[2], f[3]], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });

    },

    import_race: (entry, callback) => {
        let query = "DELETE FROM `f_vs_race`";
        connection.query(query, [], (err, result) => {

            entry.types.forEach(function (data, index) {
                var f = data.split(',');
                query = "INSERT INTO `f_vs_race` (`id`, `level`, `code`, `display`, `definition`, `internalId`, `status`) VALUES (?, ? , ? , ? , ? , ? , ? )";
                connection.query(query, [index+1, f[0], f[1], f[2], f[3], f[4], f[5]], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });

    },
    import_ethnicity: (entry, callback) => {
        let query = "DELETE FROM `f_vs_ethnicity`";
        connection.query(query, [], (err, result) => {
            entry.types.forEach(function (data, index) {
                var f = data.split(',');
                query = "INSERT INTO `f_vs_ethnicity` (`id`, `level`, `code`, `display`, `definition`, `internalId`, `status`) VALUES (?, ? , ? , ? , ? , ? , ? )";
                connection.query(query, [index+1, f[0], f[1], f[2], f[3], f[4], f[5]], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });

    },

    import_fhir_types: (entry, callback) => {
        let query = "DELETE FROM `f_vs_ethnicity`";
        connection.query(query, [], (err, result) => {
            entry.types.forEach(function (data, index) {
                var f = data.split(',');
                query = "INSERT INTO `f_vs_fhir_types` (`id`, `level`, `link`, `code`, `system`, `display`, `definition`) VALUES (?, ? , ? , ? , ? , ? , ? )";
                connection.query(query, [index+1, f[0], f[1], f[2], f[3], f[4], f[5], f[6]], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });

    },
    import_jurisdiction: (entry, callback) => {
        let query = "DELETE FROM `f_vs_ethnicity`";
        connection.query(query, [], (err, result) => {
            entry.types.forEach(function (data, index) {
                var f = data.split(',');
                query = "INSERT INTO `f_vs_jurisdiction` (`id`, `code`, `system`, `display`) VALUES (?, ? , ? , ? )";
                connection.query(query, [index+1, f[0], f[1], f[2], f[3]], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });
    },

    import_qpp_measures_data: (entry, callback) => {

        let query = "Delete FROM `f_qpp_measure_data`";
        connection.query(query, [], (err, result) => {
            qppMeasuresData.forEach(function (data, index) {
                query = "INSERT INTO `f_qpp_measure_data` (";
                query += "`id`, `title`, `eMeasureId`, `nqfEMeasureId`, `nqfId`, `measureId`, ";
                query += "`description`, `nationalQualityStrategyDomain`, `measureType`, `isHighPriority`, `primarySteward`, `metricType`, ";
                query += "`firstPerformanceYear`, `lastPerformanceYear`, `isInverse`, `category`, `isRegistryMeasure`, `isRiskAdjusted`, ";
                query += "`icdImpacted`, `isClinicalGuidelineChanged`, `isIcdImpacted`, `clinicalGuidelineChanged`, `allowedPrograms`, `submissionMethods`, ";
                query += "`measureSets`, `measureSpecification`, `eMeasureUuid`, `strata`, `eligibilityOptions`, `performanceOptions`";
                query += ") VALUES (?, \"";
                query += (data['title']?data['title'].replaceAll(`\"`, `'`).replaceAll(`"`, `\"`):"NULL")+"\", \'";
                query += (data['eMeasureId']?data['eMeasureId']:"NULL")+"\', \'";
                query += (data['nqfEMeasureId']?data['nqfEMeasureId']:"NULL")+"\', \'";
                query += (data['nqfId']?data['nqfId']:"NULL")+"\', \'";
                query += (data['measureId']?data['measureId']:"NULL")+"\', \"";
                query += (data['description']?data['description'].replaceAll('\"', "'"):"NULL")+"\", \'";
                query += (data['nationalQualityStrategyDomain']?data['nationalQualityStrategyDomain']:"NULL")+"\', \'";
                query += (data['measureType']?data['measureType']:"NULL")+"\', \'";
                query += (data['isHighPriority']?data['isHighPriority']:"NULL")+"\', \'";
                query += (data['primarySteward']?data['primarySteward']:"NULL")+"\', \'";
                query += (data['metricType']?data['metricType']:"NULL")+"\', \'";
                query += (data['firstPerformanceYear']?data['firstPerformanceYear']:"NULL")+"\', \'";
                query += (data['lastPerformanceYear']?data['lastPerformanceYear']:"NULL")+"\', \'";
                query += (data['isInverse']?data['isInverse']:"NULL")+"\', \'";
                query += (data['category']?data['category']:"NULL")+"\', \'";
                query += (data['isRegistryMeasure']?data['isRegistryMeasure']:"NULL")+"\', \'";
                query += (data['isRiskAdjusted']?data['isRiskAdjusted']:"NULL")+"\', \'";
                query += (data['icdImpacted']?JSON.stringify(data['icdImpacted']).replaceAll('"', '\"'):"NULL")+"\', \'";
                query += (data['isClinicalGuidelineChanged']?data['isClinicalGuidelineChanged']:"NULL")+"\', \'";
                query += (data['isIcdImpacted']?data['isIcdImpacted']:"NULL")+"\', \'";
                query += (data['clinicalGuidelineChanged']?JSON.stringify(data['clinicalGuidelineChanged']).replaceAll('"', '\"'):"NULL")+"\', \'";
                query += (data['allowedPrograms']?JSON.stringify(data['allowedPrograms']).replaceAll('"', '\"'):"NULL")+"\', \'";
                query += (data['submissionMethods']?data['submissionMethods']:"NULL")+"\', \'";
                query += (data['measureSets']?JSON.stringify(data['measureSets']).replaceAll('"', '\"'):"NULL")+"\', \'";
                query += (data['measureSpecification']?JSON.stringify(data['measureSpecification']).replaceAll('"', '\"'):"NULL")+"\', \'";
                query += (data['eMeasureUuid']?data['eMeasureUuid']:"NULL")+"\', \'";
                query += (data['strata']?JSON.stringify(data['strata']).replaceAll('"', '\"').replaceAll("'", '`'):"NULL")+"\', \'";
                query += (data['eligibilityOptions']?JSON.stringify(data['eligibilityOptions']).replaceAll('"', '\"').replaceAll("'", '`'):"NULL")+"\', \'";
                query += (data['performanceOptions']?JSON.stringify(data['performanceOptions']).replaceAll('"', '\"').replaceAll("'", '`'):"NULL")+"\'";
                query += ");";
                connection.query(query, [index+1], (err, result) => {
                    if(err){
                        console.log(err);
                    }
                });

            });

            callback(err, result);
        });

        


    },

}
module.exports = roles;