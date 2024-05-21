const paid = require('../../repositories/back/paid');

exports.getdesc = (req, res, next) => {
    paid.getdesc((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getgroups = (req, res, next) => {
    paid.getgroups((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getclinicspec = (req, res, next) => {
    paid.getclinicspec((err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getInsamount = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    paid.getInsamount(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getins = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let result = await paid.getins(entry);
    res.status(200).json({ data: result});
}
exports.getdaterange = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let result = await paid.getdaterange(entry);
    res.status(200).json({ data: result});
}
exports.getVisitsPTs = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let visits = await paid.getVisits(entry);
    let pts = await paid.getPTs(entry);
    res.status(200).json({ visits: visits,pts: pts});
}
exports.getBestCPT = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    paid.getBestCPT(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.getTotalvisitpts = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let visits = await paid.getTotalVisits(entry);
    let pts = await paid.getTotalPTs(entry);
    res.status(200).json({ visits: visits,pts: pts});
}
exports.getGroupamount = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let groups = await paid.getGroups();
    let modgroups = await paid.getModGroups();
    
    for(var i=0;i<groups.length;i++){
        for(var j=0;j<modgroups.length;j++){
            if(groups[i]['name'] == modgroups[j]['name']){
                groups[i]['cpts'] += ","+modgroups[j]['cpts'];
            }
        }
    }
    let groupamount = {};
    let groupamountbyins = [];
    var tmpgroups = [];
    for(var i=0;i<groups.length;i++){
        if(groups[i]['cpts'] !=null){
            var tmpgroups = groups[i]['cpts'].split(",");
            var groupsstring = "('0'";
            for(var j=0;j<tmpgroups.length;j++){
                groupsstring += ",'"+tmpgroups[j]+"'";
            }
            groupsstring += ")";
            var tmp = await paid.getgroupamount(entry,groups[i]['name'],groupsstring);
            if(tmp[0]['amount'] != null&&tmp[0]['amount'] != 0){
                groupamount[groups[i]['name']] = tmp[0]['amount']
            }
            var tmpins = await paid.getgroupamountbyins(entry,groups[i]['name'],groupsstring);
            for(var k=0;k<tmpins.length;k++){
                if(tmpins[k]['amount'] != null&&tmpins[k]['amount'] != 0){
                    groupamountbyins.push({ins:tmpins[k]['InsName'],group:groups[i]['name'],amount:tmpins[k]['amount']})
                }
            }
            groupamountbyins.sort(function (a, b) {
                return a.ins.localeCompare(b.ins) || a.group.localeCompare(b.group);
            });
        }
    }
    var insname = "";
    var tmpgroupins = {};
    for(var i = 0;i < groupamountbyins.length;i++){
        if(insname == groupamountbyins[i]['ins']){
            tmpgroupins[groupamountbyins[i]['ins']].push({group:groupamountbyins[i]['group'],amount:groupamountbyins[i]['amount']});
        }
        else{
            tmpgroupins[groupamountbyins[i]['ins']] = [];
            tmpgroupins[groupamountbyins[i]['ins']].push({group:groupamountbyins[i]['group'],amount:groupamountbyins[i]['amount']});
            insname = groupamountbyins[i]['ins'];
        }
    }
    res.status(200).json({ groupamount: groupamount,groupamountbyins: tmpgroupins});
}
exports.getsubGroupamount = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let subgroups = await paid.getsubGroups();
    let modsubgroups = await paid.getModsubGroups();
    let tmpmodsgroups = [];
    for(var i=0;i<subgroups.length;i++){
        for(var j=0;j<modsubgroups.length;j++){
            if(subgroups[i]['pname'] == modsubgroups[j]['pname']&&subgroups[i]['name'] == modsubgroups[j]['name']){
                subgroups[i]['cpts'] += ","+modsubgroups[j]['cpts'];
            }
            else if(subgroups[i]['pname'] == modsubgroups[j]['pname']&&subgroups[i]['name'] != modsubgroups[j]['name']){
                tmpmodsgroups.push(modsubgroups[j])
            }
        }
    }
    tmpmodsgroups = [...new Set(tmpmodsgroups)];
    for(i=0;i<tmpmodsgroups.length;i++){
        subgroups.push(tmpmodsgroups[i]);
    }
    let subgroupamount = [];
    for(var i=0;i<subgroups.length;i++){
        if(subgroups[i]['cpts'] !=null){
            var tmpgroups = subgroups[i]['cpts'].split(",");
            var groupsstring = "('0'";
            for(var j=0;j<tmpgroups.length;j++){
                groupsstring += ",'"+tmpgroups[j]+"'";
            }
            groupsstring += ")";
            var tmp = await paid.getsubgroupamount(entry,subgroups[i]['pname'],groupsstring);
            if(tmp[0]['amount'] != null&&tmp[0]['amount'] != 0){
                subgroupamount.push({group:subgroups[i]['pname'],subgroup:subgroups[i]['name'],amount:tmp[0]['amount']})
            }
        }
    }
    subgroupamount.sort(function (a, b) {
        return a.group.localeCompare(b.group) || a.subgroup.localeCompare(b.subgroup);
    });
    var pname = "";
    var tmpsubgroup = {};
    for(var i = 0;i < subgroupamount.length;i++){
        if(pname == subgroupamount[i]['group']){
            tmpsubgroup[subgroupamount[i]['group']].push({subgroup:subgroupamount[i]['subgroup'],amount:subgroupamount[i]['amount']});
        }
        else{
            tmpsubgroup[subgroupamount[i]['group']] = [];
            tmpsubgroup[subgroupamount[i]['group']].push({subgroup:subgroupamount[i]['subgroup'],amount:subgroupamount[i]['amount']});
            pname = subgroupamount[i]['group'];
        }
    }
    res.status(200).json({data: tmpsubgroup});
}
exports.gettopins = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    paid.gettopins(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.gettopinsclaim = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    paid.gettopinsclaim(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result });
        }
    });
}
exports.gettopinspts = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let pts = await paid.getTotalPTs(entry);
    await paid.gettopinspts(entry, (err, result) => {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({ data: result,total:pts });
        }
    });
}
exports.getavgpcppayment = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let result = await paid.getavgpcppayment(entry);
    res.status(200).json({ data: result });
}
exports.getpcppts = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let pts = await paid.getTotalPTs(entry);
    let pcppts = await paid.getpcppts(entry);
    res.status(200).json({ data: pcppts,total:pts });
}
exports.getprenpvisits = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let annnp = await paid.getannnp();
    var tmpannnp = "('0'";
    for(var i=0;i<annnp.length;i++){
        tmpannnp += ",'"+annnp[i]['id']+"'";
    }
    tmpannnp += ")";
    let mainnp = await paid.getmainnp();
    var tmpmainnp = "('0'";
    for(var i=0;i<mainnp.length;i++){
        tmpmainnp += ",'"+mainnp[i]['id']+"'";
    }
    tmpmainnp += ")";

    let annnpcodes = await paid.getannnpcodes(tmpannnp);
    let npcodes = await paid.getnpcodes(tmpmainnp);

    var tmpannnpcodes = "('0'";
    for(var i=0;i<annnpcodes.length;i++){
        tmpannnpcodes += ",'"+annnpcodes[i]['cpt']+"'";
    }
    tmpannnpcodes += ")";

    var tmpnpcodes = "('0'";
    for(var i=0;i<npcodes.length;i++){
        tmpnpcodes += ",'"+npcodes[i]['cpt']+"'";
    }
    tmpnpcodes += ")";

    let pcpannnptotal = await paid.getpcpannnptotal(entry,tmpannnpcodes);
    let pcpnptotal = await paid.getpcpnptotal(entry,tmpnpcodes);
    
    res.status(200).json({ pcpannnptotal: pcpannnptotal,pcpnptotal:pcpnptotal });

}
exports.getinsbypcp = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let insbypcp = await paid.getinsbypcp(entry);
    tmppcp = "";
    let tmpinsbypcp = {};
    for(var i=0;i<insbypcp.length;i++){
        if(tmppcp == insbypcp[i]['pcpname'].trim()){
            tmpinsbypcp[insbypcp[i]['pcpname'].trim()].push({InsName:insbypcp[i]['InsName'],amount:insbypcp[i]['amount']});
        }
        else{
            tmpinsbypcp[insbypcp[i]['pcpname'].trim()] = [];
            tmpinsbypcp[insbypcp[i]['pcpname'].trim()].push({InsName:insbypcp[i]['InsName'],amount:insbypcp[i]['amount']});
            tmppcp = insbypcp[i]['pcpname'].trim();
        }
    }
    res.status(200).json({ data: tmpinsbypcp });
}
exports.gettoppatients = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    tmpbestpts = {};
    let gettop10pts = await paid.gettop10pts(entry);
    for(var i=0;i<gettop10pts.length;i++){
        let getptinfo = await paid.getptinfo(entry.clinicid,gettop10pts[i]['PT_ID']);
        let insamountbypt = await paid.getinsamountbypt(entry,gettop10pts[i]['PT_ID']);
        var namekey = "Unknown - "+gettop10pts[i]['PT_ID'];
        if(typeof getptinfo[0] != "undefined"){
            namekey = getptinfo[0]['FNAME'].trim()+" "+getptinfo[0]['LNAME'].trim();
        }
        tmpbestpts[namekey] = insamountbypt;
    }
    res.status(200).json({ data: tmpbestpts });
}
exports.getbestinsareas = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let groups = await paid.getGroups();
    let modgroups = await paid.getModGroups();

    for(var i=0;i<groups.length;i++){
        for(var j=0;j<modgroups.length;j++){
            if(groups[i]['name'] == modgroups[j]['name']){
                groups[i]['cpts'] += ","+modgroups[j]['cpts'];
            }
        }
    }
    let groupamount = {};
    var tmpgroups = [];
    for(var i=0;i<groups.length;i++){
        if(groups[i]['cpts'] !=null){
            var tmpgroups = groups[i]['cpts'].split(",");
            var groupsstring = "('0'";
            for(var j=0;j<tmpgroups.length;j++){
                groupsstring += ",'"+tmpgroups[j]+"'";
            }
            groupsstring += ")";
            var tmp = await paid.gettopgroupamount(entry,groups[i]['name'],groupsstring);
            if(tmp.length > 0){
                groupamount[groups[i]['name']] = tmp
            }
        }
    }
    res.status(200).json({ data: groupamount });
}

exports.getpcpview = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let pcptotal = await paid.getavgpcppayment(entry);
    let pcppts = await paid.getpcppts(entry);
    let pcpdates = await paid.getpcpdates(entry);

    res.status(200).json({ pcptotal: pcptotal,pcppts: pcppts,pcpdates: pcpdates });
}

exports.getcptsbyins = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let result = await paid.getcptsbyins(entry);
    res.status(200).json({ data: result});
}

exports.getcptinsbill = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        group: req.body.group,
        spec: req.body.spec,
        type: req.body.type,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let gcodes = await paid.getgcodes(entry.group);
    var tmpgcodes = [];
    var tmpgcodestring = "('0'";
    for(var i = 0;i < gcodes.length;i++){
        tmpgcodes.push(gcodes[i]['cpt'].trim());
        tmpgcodestring += ",'"+gcodes[i]['cpt'].trim()+"'";
    }
    tmpgcodestring += ")";
    
    let acodes = await paid.getacodes(entry);
    var tmpacodes = [];
    var tmpacodestring = "('0'";
    for(var i = 0;i < acodes.length;i++){
        tmpacodes.push(acodes[i]['CPT'].trim());
        tmpacodestring += ",'"+acodes[i]['CPT'].trim()+"'";
    }
    tmpacodestring += ")";
    
    if(entry.spec != ""){
        tmpspecs = entry.spec.split(",");
        let cspec = await paid.getcspec();
        var tmpclinics = [];
        var aspecclinics = [parseInt(entry.clinicid)];
        for(var i = 0;i < cspec.length;i++){
            tmpclinics.push({id:cspec[i]['id'],specs:cspec[i]['cspec'].split(",")});
        }
        for(var i=0;i<tmpclinics.length;i++){
            for(var j=0;j<tmpspecs.length;j++){
                if(tmpclinics[i]['specs'].includes(tmpspecs[j])){
                    aspecclinics.push(tmpclinics[i]['id'])
                }
            }
        }
        aspecclinics = [...new Set(aspecclinics)];
    }
    else{
        var aspecclinics = [];
    }
    var tmpaspecclinicstring = "('0'";
    for(var i = 0;i < aspecclinics.length;i++){
        tmpaspecclinicstring += ",'"+aspecclinics[i]+"'";
    }
    tmpaspecclinicstring += ")";
    
    if(entry.group != 0){
        var nogroupcodes = [];
    }
    else{
        var nogroupcodes = await paid.getnogroupcodes(entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics)
    }
    let groupcodes = await paid.getgroupcodes(entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics)
    let modgroupcodes = await paid.getmodgroupcodes(entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics)
    for(i=0;i<modgroupcodes.length;i++){
        groupcodes.push(modgroupcodes[i]);
    }
    groupcodes.sort(function (a, b) {
        return a.name.localeCompare(b.name) || (b.subname==null?"zzzz":b.subname).localeCompare((a.subname==null?"zzzz":a.subname)) || a.CPT.localeCompare(b.CPT) || a.InsName.localeCompare(b.InsName);
    });
    res.status(200).json({ data: groupcodes,nogroup:nogroupcodes,tmpcode:tmpacodes});
}

exports.getsuperbill = async (req, res, next) => {
    let exvalue = await paid.getexvalue(req.body.clinicid);
    let entry = {
        clinicid: req.body.clinicid,
        sdate: req.body.sdate,
        edate: req.body.edate,
        ins: req.body.ins,
        spec: req.body.spec,
        type: req.body.type,
        value: exvalue.length>0?exvalue[0]['payment']:0.02
    }
    let gcodes = await paid.getgcodessuper();
    var tmpgcodes = [];
    var tmpgcodestring = "('0'";
    for(var i = 0;i < gcodes.length;i++){
        tmpgcodes.push(gcodes[i]['cpt'].trim());
        tmpgcodestring += ",'"+gcodes[i]['cpt'].trim()+"'";
    }
    tmpgcodestring += ")";
    
    let acodes = await paid.getacodessuper(entry);
    var tmpacodes = [];
    var tmpacodestring = "('0'";
    for(var i = 0;i < acodes.length;i++){
        tmpacodes.push(acodes[i]['CPT'].trim());
        tmpacodestring += ",'"+acodes[i]['CPT'].trim()+"'";
    }
    tmpacodestring += ")";
    
    if(entry.spec != ""){
        tmpspecs = entry.spec.split(",");
        let cspec = await paid.getcspec();
        var tmpclinics = [];
        var aspecclinics = [parseInt(entry.clinicid)];
        for(var i = 0;i < cspec.length;i++){
            tmpclinics.push({id:cspec[i]['id'],specs:cspec[i]['cspec'].split(",")});
        }
        for(var i=0;i<tmpclinics.length;i++){
            for(var j=0;j<tmpspecs.length;j++){
                if(tmpclinics[i]['specs'].includes(tmpspecs[j])){
                    aspecclinics.push(tmpclinics[i]['id'])
                }
            }
        }
        aspecclinics = [...new Set(aspecclinics)];
    }
    else{
        var aspecclinics = [];
    }
    var tmpaspecclinicstring = "('0'";
    for(var i = 0;i < aspecclinics.length;i++){
        tmpaspecclinicstring += ",'"+aspecclinics[i]+"'";
    }
    tmpaspecclinicstring += ")";

    let nogroupcodes = await paid.getnogroupcodessuper(entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics)
    let groupcodes = await paid.getgroupcodessuper(entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics)
    let modgroupcodes = await paid.getmodgroupcodessuper(entry,tmpgcodestring,tmpacodestring,tmpaspecclinicstring,aspecclinics)
    for(i=0;i<modgroupcodes.length;i++){
        groupcodes.push(modgroupcodes[i]);
    }
    groupcodes.sort(function (a, b) {
        return a.name.localeCompare(b.name) || (b.subname==null?"zzzz":b.subname).localeCompare((a.subname==null?"zzzz":a.subname)) || a.CPT.localeCompare(b.CPT) || a.InsName.localeCompare(b.InsName);
    });
    res.status(200).json({ data: groupcodes,nogroup:nogroupcodes,tmpcode:tmpacodes});
}
