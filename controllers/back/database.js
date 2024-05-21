const database = require('../../repositories/back/database');

exports.import_entity_types = (req, res, next) => {
    
    let entry = {
        types: req.body.types
    }
    database.import_entity_types(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.import_event_sub_types = (req, res, next) => {
    let entry = {
        types: req.body.types
    }
    database.import_event_sub_types(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.import_event_types = (req, res, next) => {
    let entry = {
        types: req.body.types
    }
    database.import_event_types(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.import_languages = (req, res, next) => {
    let entry = {
        types: req.body.types
    }
    database.import_languages(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.import_currencies = (req, res, next) => {
    let entry = {
        types: req.body.types
    }
    database.import_currencies(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.import_coverage_types = (req, res, next) => {
    let entry = {
        types: req.body.types
    }
    database.import_coverage_types(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.import_race = (req, res, next) => {
    let entry = {
        types: req.body.types
    }
    database.import_race(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.import_ethnicity = (req, res, next) => {
    let entry = {
        types: req.body.types
    }
    database.import_ethnicity(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.import_fhir_types = (req, res, next) => {
    let entry = {
        types: req.body.types
    }
    database.import_fhir_types(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.import_jurisdiction = (req, res, next) => {
    let entry = {
        types: req.body.types
    }
    database.import_jurisdiction(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}

exports.import_qpp_measures_data = (req, res, next) => {
    
    database.import_qpp_measures_data([], (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}



