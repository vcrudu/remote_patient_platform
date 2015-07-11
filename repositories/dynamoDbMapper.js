/**
 * Created by Victor on 06/07/2015.
 */

(function(){
    var bcrypt      = require('bcrypt');
    var domainModel = require('@vcrudu/hcm.domainmodel');


    module.exports  = {
        createUserFromBody : function(requestBody){
            var salt = bcrypt.genSaltSync(10);
            var passwordHash = bcrypt.hashSync(requestBody.password, salt);
            return {
                email: requestBody.email,
                passwordHash: passwordHash
            };
        },
        createUserFromDbEntity : function(dbEntity){
            var createdDateTime = new Date();
            createdDateTime.setTime(dbEntity.createdDateTime.N);
            return {
                email: dbEntity.email.S,
                passwordHash: dbEntity.passwordHash.S,
                token: dbEntity.token.S,
                createdDateTime:createdDateTime
            };
        },

        createUserDetailsDbEntityFromPatient : function(patient){
            return {
                    email:{S:patient.email},
                    name:{S:patient.name},
                    surname:{S:patient.surname},
                    title:{S:patient.title},
                    dateOfBirth:{N:patient.dateOfBirth}

            };
        }
    };
})();
