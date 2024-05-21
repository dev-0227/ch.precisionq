const connection = require('../../../utilities/database');


String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

const roles = {
    list: (callback) => {
        let query = "SELECT * FROM `roles` WHERE 1 ORDER BY code";
        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    add: (entry, callback) => {
        let query = "INSERT INTO `roles` (`id`, `code`, `name`, `description`,`createdAt`,`updatedAt`) VALUES (NULL, ? , ? , ? , ? , ? )";
        connection.query(query, [entry.code, entry.name, entry.description, entry.createdAt, entry.createdAt], (err, result) => {
            callback(err, result);
        });
    },
    chosen: (entry, callback) => {
        let query = "SELECT * FROM `roles` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    getPermission: (entry, callback) => {
        let query = "SELECT rp.*, p.name as pname FROM `rolepermissions` as rp ";
        query += "LEFT JOIN permissions as p ON p.id=rp.perm_id "
        query += "WHERE rp.role_id= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    isPermission: async(entry, callback) => {

        let query = "SELECT rp.*, u.permissions as permissions  FROM `rolepermissions` as rp ";
        query += "LEFT JOIN  permissions as p ON p.id = rp.perm_id ";
        query += "LEFT JOIN  managers as u ON u.type = rp.role_id ";
        query += "WHERE u.`id`= ? and  p.`name` = ?"

        return new Promise((resolve, reject) => {
            connection.query(query, [entry.user.id, entry.permission], (err, result) => {
                if(!err){
                    var value = '000';
                    if(result.length>0){
                        var data = result[0];
                        var value = data['value']?data['value']:'000';
                        var perm_id = data['perm_id']?data['perm_id']:'0';
                        var more = []
                        if(data['permissions'])more = data['permissions'].split(',');
                        for(var i=0; i<more.length; i++){
                            var p = more[i].split("_");
                            if(p[0] == perm_id)value = p[1];
                        }
                    }
                    resolve(value);
                }else{
                    return reject(err);
                }
                
            });
        });
            
       
    },
    update: (entry, callback) => {
        let query = "UPDATE `roles` SET `code`= ?, `name`= ?, `description` = ?, `updatedAt` = ? WHERE `id`= ? ";
        connection.query(query, [entry.code, entry.name, entry.description, entry.updatedAt, entry.id], (err, result) => {
            if(!err){
                var permissions = entry.permission.split(',');
                var permission = [];
                for(var i=0; i<permissions.length; i++){
                    var p = permissions[i].split('_');
                    var value = '000';
                    if(permission[p[0]]){
                        value = permission[p[0]];
                    }
                    permission[p[0]] = value.replaceAt(p[1]-1,p[2]);
                    
                }

                permission.forEach(function (value, perm_id) {
                    query = "SELECT * FROM `rolepermissions` WHERE `role_id`= ? and  `perm_id`= ?";
                    connection.query(query, [entry.id, perm_id], (err, result) => {
                        if(result.length){
                            query = "UPDATE `rolepermissions` SET `value` = ?, `updatedAt` = ? WHERE `role_id`= ? and  `perm_id`= ?";
                            connection.query(query, [value, entry.updatedAt, entry.id, perm_id, ], (err, result) => {
                            });
                        }else{
                            query = "INSERT INTO `rolepermissions` (`id`, `role_id`, `perm_id`,`value`, `createdAt`,`updatedAt`) VALUES (NULL, ? , ? , ? , ? , ? )";
                            connection.query(query, [entry.id, perm_id, value, entry.updatedAt, entry.updatedAt], (err, result) => {
                            });
                        };
                    });

                });
                callback(err, result);
            }
            
        });
        

    },
    delete: (entry, callback) => {
        let query = "DELETE FROM `roles` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
}
module.exports = roles;