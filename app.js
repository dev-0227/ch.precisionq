const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const login = require('./routes/login');
const pages = require('./routes/pages');
const settings = require('./routes/settings');
const loaders = require('./routes/loaders');
const hedis = require('./routes/hedis');
const patients = require('./routes/patients');
const insurance = require('./routes/insurance');
const database = require('./routes/database');

const cors = require('cors');
//back
const user = require('./routes/back/user');
const manager = require('./routes/back/manager');
const specialist = require('./routes/back/specialist');
const role = require('./routes/back/role');
const permission = require('./routes/back/permission');
const audit_event = require('./routes/back/audit_event');
const clinic = require('./routes/back/clinic');
const vital = require('./routes/back/vital');
const valueset = require('./routes/back/valueset');
const apidatabase = require('./routes/back/database');

const apilogin = require('./routes/back/login');
const profile = require('./routes/back/profile');
const setting = require('./routes/back/setting');
const hedisloader = require('./routes/back/hedisloader');
const apihedis = require('./routes/back/hedis');
const referral = require('./routes/back/referral');
const invoice = require('./routes/back/invoice');
const hedissetting = require('./routes/back/hedissetting');
const paymentsetting = require('./routes/back/paymentsetting');
const paid = require('./routes/back/paid');
const ffs = require('./routes/back/ffs');
const patientlist = require('./routes/back/patientlist');
const apiinsurance = require('./routes/back/insurance');
const diagnosisgroup = require('./routes/back/diagnosisgroup');

const connection = require('./utilities/database');
const setTZ = require('set-tz')
setTZ('America/New_York')
connection.query("SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''));", (err, result) => {
    //console.log(err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Config middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.disable("x-powered-by");
app.use(cors());



// Static Pages
app.use('/assets', express.static(path.join(__dirname, 'views/assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', login);
app.use('/pages', pages);
app.use('/settings', settings);
app.use('/loaders', loaders);
app.use('/patients', patients);
app.use('/hedis', hedis);
app.use('/insurance', insurance);
app.use('/database', database);

// app.use('*', (req, res) => {
//     //res.status(404).render('pages-404');
//     res.redirect('../');
// });

// Config middlewares
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.disable("x-powered-by");
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, X-Custom-Header, Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
    res.header("Access-Control-Expose-Headers", "Authorization, Content-Type, Allow, X-Response-Time, Cache-Control");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH, DELETE");
        return res.status(200).json({});
    }
    next();
});

// Adding main routes
//back
app.use('/api/user', user);
app.use('/api/manager', manager);
app.use('/api/specialist', specialist);
app.use('/api/role', role);
app.use('/api/permission', permission);
app.use('/api/audit_event', audit_event);
app.use('/api/clinic', clinic);
app.use('/api/vital', vital);
app.use('/api/valueset', valueset);
app.use('/api/database', apidatabase);
app.use('/api/referral', referral);

app.use('/api/login', apilogin);
app.use('/api/profile', profile);
app.use('/api/setting', setting);
app.use('/api/hedisloader', hedisloader);
app.use('/api/hedis', apihedis);
app.use('/api/invoice', invoice);
app.use('/api/hedissetting', hedissetting);
app.use('/api/paymentsetting', paymentsetting);
app.use('/api/paid', paid);
app.use('/api/ffs', ffs);
app.use('/api/patientlist', patientlist);
app.use('/api/insurance', apiinsurance);
app.use('/api/diagnosisgroup', diagnosisgroup);

module.exports = app;
