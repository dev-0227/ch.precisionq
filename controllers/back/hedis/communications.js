const communications = require('../../../repositories/back/hedis/communications');
const event = require('../../../repositories/back/event');
const Acl = require('../../../middleware/acl');
const CryptoJS = require("crypto-js");


const AccessToken = require("twilio").jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;

function DateFormat(serial) {
    let year = serial.getFullYear();
    let month = serial.getMonth() + 1;
    let dt = serial.getDate();
  
    if (dt < 10) {
        dt = '0' + dt;
    }
    if (month < 10) {
        month = '0' + month;
    }
    return month+'/'+dt+'/'+year;
}

exports.checkcalltime = async (req,res,next) =>{
    let entry = {
        clinic_id: req.body.clinic_id
    }
    let counts = await communications.checkcalltime(entry.clinic_id);
    if(typeof counts[0] == "undefined" || counts[0]['counts'] == null){
        var available_counts = 0;
     }
     else{
         var available_counts =counts[0]['counts'];
     }
     res.status(200).json({ status:"success",counts:available_counts });
}


exports.getcalltoken =  (req,res,next)=>{
    let clid = req.body.clinicid
    communications.gettwiliokeygroups(clid, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            let dgkey = 'roslongenc2023'
           
            let twilioAccountSid = CryptoJS.AES.decrypt(result[0].phone_sid, dgkey).toString(CryptoJS.enc.Utf8)
            let twilioApiKey = CryptoJS.AES.decrypt(result[0].tw_api_key, dgkey).toString(CryptoJS.enc.Utf8)
            let twilioApiSecret = CryptoJS.AES.decrypt(result[0].tw_api_secret, dgkey).toString(CryptoJS.enc.Utf8)
            let clinumber = CryptoJS.AES.decrypt(result[0].phone_num, dgkey).toString(CryptoJS.enc.Utf8)
            let clidentity = "+1"+(clinumber.replace(/-/g, '')).replace(/ /g,'')

            const token = new AccessToken(
                twilioAccountSid,
                twilioApiKey,
                twilioApiSecret,
                {identity: clidentity}
            );
            let outgoingApplicationSid = CryptoJS.AES.decrypt(result[0].tw_app_sid, dgkey).toString(CryptoJS.enc.Utf8)
            let voiceGrant = new VoiceGrant({
                outgoingApplicationSid: outgoingApplicationSid
            });
            
            token.addGrant(voiceGrant);
            console.log(token)
            
            res.status(200).json({ token: token.toJwt()});
        }
    });
   
   
}
exports.gettingtwiliologlist = (req,res,next)=>{
    let clid = req.body.clinicid
    communications.gettwiliokeygroups(clid, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            let dgkey = 'roslongenc2023'
            let phonesid = CryptoJS.AES.decrypt(result[0].phone_sid, dgkey).toString(CryptoJS.enc.Utf8)
            let phonetoken = CryptoJS.AES.decrypt(result[0].phone_token, dgkey).toString(CryptoJS.enc.Utf8)

            var twilio = require('twilio')(
                phonesid,
                phonetoken
              );
              let  event = new Date();

              let entry = {
                userid :  req.body.userid,
                clinicid :  req.body.clinicid,
                patinsid :  req.body.ptinsid,
                patemrid :  req.body.ptemrid,
                phone : req.body.ptnum,
                cmid : req.body.cmid,
                dudration : req.body.durat,
                calldate :event.toLocaleString('en-US', { timeZone: 'UTC' }),
                price :  Number.parseFloat(req.body.durat * 0.0140).toFixed(4),
                status : "completed"
            }

            communications.setcalllogtrack(entry);
                let tmpbody = ''
                let dgtitle = ''
                let dgcategory = "notification"
                communications.fhirtracksmssentinfo (entry.patinsid,entry.patemrid,entry.status,'Outreach Call',entry.cmid,'call',entry.clinicid,entry.userid,entry.phone,tmpbody,DateFormat(new Date()),entry.userid+"/"+entry.patinsid+"/"+entry.calldate,dgtitle,dgcategory)

                communications.updateavailabletime(entry.clinicid,entry.dudration)

            //   twilio.calls.list({limit: 40}).then(calls => {
            //             let entry = {
            //                 userid :  req.body.userid,
            //                 clinicid :  req.body.clinicid,
            //                 patinsid :  req.body.ptinsid,
            //                 patemrid :  req.body.ptemrid,
            //                 phone : req.body.ptnum,
            //                 cmid : req.body.cmid,
            //                 dudration : req.body.durat
            //             }
                        
            //             for( i = calls.length -1 ; i > 0  ;  i--){
            //                 console.log(calls[i])
            //                 if(calls[i].to == entry.phone){
                               
            //                     console.log(entry.phone ,"--------------------------------")
            //                     console.log(calls[i])
                                
            //                         entry.calldate = calls[i].startTime,
            //                         entry.duration =  calls[i].duration,
            //                         entry.price =  calls[i].price
            //                         entry.status = calls[i].status
            //                         entry.sid = call[i].sid
            //                     break;
            //                 }
            //             }
            //             console.log(entry.phone)
                      
            //            hedis.setcalllogtrack(entry);
            //         //     let tmpbody = ''
            //         //     let dgtitle = ''
            //         //     let dgcategory = "notification"
            //         //    hedis.fhirtracksmssentinfo (entry.patinsid,entry.patemrid,entry.status,'Outreach Call',entry.cmid,'call',entry.clinicid,entry.userid,entry.phone,tmpbody,DateFormat(new Date()),entry.sid,dgtitle,dgcategory)

            //         //    hedis.updateavailabletime(entry.clinicid,entry.duration)
                        
        
            //         } );
        
                    res.status(200).json({ result: 'data'});
        }
    })
   
}


exports.setcallcounts = (req, res, next) => {
    let entry = {
        clinicid: req.body.clinicid,
        counts: req.body.counts,
    }
    communications.setcallcounts(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
