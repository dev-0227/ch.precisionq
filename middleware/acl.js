const roleRepo = require('../repositories/back/settings/role');

const Acl = {
    can: async(user, method, permission) => {
        var isCan = false;
        var result = await roleRepo.isPermission({user: user, permission}, (result, err) => {
            if(err)return isCan;
        });
        
        if(!Array.isArray(method)){
            methods[0] = method;
        }else{
            methods = method;
        }
        for(var i=0; i<methods.length; i++){
            if(methods[i]=="read"){
                if(result.charAt(0)=="1")isCan = true;
            }
            if(methods[i]=="write"){
                if(result.charAt(1)=="1")isCan = true;
            }
            if(methods[i]=="create"){
                if(result.charAt(2)=="1")isCan = true;
            }
        }
        return isCan;
     
        
    }
}

module.exports = Acl;