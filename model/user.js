/**
 * Created by Victor on 21/06/2015.
 */
(function(){
    var bcrypt      = require('bcrypt');
    var domainModel = require('@vcrudu/hcm.domainmodel');
    module.exports  = {
      createUserFromBody : function(requestBody){
         var salt = bcrypt.genSaltSync(10);
         var passwordHash = bcrypt.hashSync(requestBody.password, salt);
         return {
               email : requestBody.email,
               passwordHash : passwordHash,
               firstname : requestBody.name,
               surname : requestBody.surname,
               isActive:false
         };
      },
        createUserFromDbEntity : function(dbEntity){
            var createdDateTime = new Date();
            if(dbEntity.createdDateTime) createdDateTime.setTime(parseInt(dbEntity.createdDateTime.N));
            return {
                email: dbEntity.email.S,
                passwordHash: dbEntity.passwordHash.S,
                token: dbEntity.tokenString.S,
                isActive:dbEntity.isActive.BOOL,
                createdDateTime:createdDateTime
            };
        },
        createUserDetailsFromDbEntity : function(dbEntity){
            return {
                email: dbEntity.email.S,
                firstname: dbEntity.name.S,
                surname: dbEntity.surname.S
            };
        },
        createUserDetailsFromBody : function(requestBody){
            return domainModel.createPatient(requestBody);
        },
        createDbEntityFromUser : function(user){
            var createdDateTime = new Date();
                return {
                    email           : {S     : user.email},
                    passwordHash    : {S     : user.passwordHash},
                    tokenString     : {S     : user.token},
                    isActive        : {BOOL  : user.isActive},
                    createdDateTime : {N     : createdDateTime.getTime().toString()}
                };
        }
    };
})();