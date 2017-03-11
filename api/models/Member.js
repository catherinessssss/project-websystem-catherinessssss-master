/**
 * Member.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// api/models/Member.js

var bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;

module.exports = {

    tableName: 'cm_users',
    attributes: {
        username: {
            type: 'string',
            unique: true,
            required: true,
            columnName: 'username'
        },
        password: {
            type: 'string',
            required: true,
            columnName: 'password'
        },
        properties : {
            collection: 'Property',
            via: 'owner'
        },
        interestedProperties: {
            collection: 'Property',
            via: 'interestedMembers'
        },
        verifyPassword: function (password) {
          return bcrypt.compareSync(password, this.password);
        },
        toJSON: function() {
          var obj = this.toObject();
          delete obj.password;
          return obj;
        }
    },
    beforeCreate: function(values, next) {
        bcrypt.hash(values.password, SALT_WORK_FACTOR, function(err, hash) {
            if(err) {
                return next(err);
            }

            values.password = hash;
            next();
        });  
    }
};

