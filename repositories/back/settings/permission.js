const connection = require('../../../utilities/database');

const permissions = {
    list: (callback) => {
        
        let query = "SELECT p.*, GROUP_CONCAT(r.`name`) as assigned, GROUP_CONCAT(rp.`value`) as v ";
        query += "FROM `permissions` AS p ";
        query += "LEFT JOIN `rolepermissions` AS rp ON p.id = rp.`perm_id` ";
        query += "LEFT JOIN `roles` AS r ON r.`id` = rp.`role_id` ";
        query += "GROUP BY p.id ORDER BY p.createdAt";


        connection.query(query, (err, result) => {
            callback(err, result);
        });
    },
    add: (permission, callback) => {
       
        let query = "INSERT INTO `permissions` (`id`, `name`, `description`,`createdAt`,`updatedAt`) VALUES (NULL, ? , ? , ? , ? )";
        connection.query(query, [permission.name, permission.description, permission.createdAt, permission.createdAt], (err, result) => {
            callback(err, result);
        });
    },
    chosen: (entry, callback) => {
        let query = "SELECT * FROM `permissions` WHERE `id`= ? "
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
    update: (entry, callback) => {
        let query = "UPDATE `permissions` SET `name`= ?, `description` = ?, `updatedAt` = ? WHERE `id`= ? ";
        connection.query(query, [entry.name, entry.description, entry.updatedAt, entry.id], (err, result) => {
            callback(err, result);
        });
    },
    delete: (entry, callback) => {
        let query = "DELETE FROM `permissions` WHERE `id`= ? ";
        connection.query(query, [entry.id], (err, result) => {
            callback(err, result);
        });
    },
}
module.exports = permissions;