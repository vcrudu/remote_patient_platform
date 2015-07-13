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
               firstname : requestBody.firstName,
               surname : requestBody.surname
         };
      },
        createUserFromDbEntity : function(dbEntity){
            var createdDateTime = new Date();
            if(dbEntity.createdDateTime) createdDateTime.setTime(parseInt(dbEntity.createdDateTime.N));
            return {
                email: dbEntity.email.S,
                passwordHash: dbEntity.passwordHash.S,
                token: dbEntity.tokenString.S,
                createdDateTime:createdDateTime
            };
        },
        createUserDetailsFromDbEntity : function(dbEntity){
            return {
                email: dbEntity.email.S,
                firstname: dbEntity.firstname.S,
                surname: dbEntity.surname.S
            };
        },
        createUserDetailsFromBody : function(requestBody){
            return domainModel.createPatient(requestBody);
        }
    };
})();