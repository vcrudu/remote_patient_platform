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
             email: requestBody.email,
             passwordHash: passwordHash,
             name: requestBody.name,
             surname: requestBody.surname,
             isActive: true,
             onlineStatus: "offline"
         };
      },
        createUserFromDbEntity : function(dbEntity){
            var createdDateTime = new Date();
            var onlineStatus = 'offline';
            var socketId = undefined;
            if(dbEntity.onlineStatus.S) onlineStatus=dbEntity.onlineStatus.S;
            if(dbEntity.socketId.S) onlineStatus=dbEntity.socketId.S;
            if(dbEntity.createdDateTime) createdDateTime.setTime(parseInt(dbEntity.createdDateTime.N));
            return {
                email: dbEntity.email.S,
                passwordHash: dbEntity.passwordHash.S,
                token: dbEntity.tokenString.S,
                isActive:dbEntity.isActive.BOOL,
                onlineStatus: onlineStatus,
                socketId:socketId,
                createdDateTime:createdDateTime
            };
        },
        createUserDtoFromDbEntity : function(dbEntity){
            var createdDateTime = new Date();
            var onlineStatus = 'offline';
            var socketId = undefined;
            if(dbEntity.onlineStatus) onlineStatus=dbEntity.onlineStatus.S;
            if(dbEntity.socketId) socketId=dbEntity.socketId.S;
            if(dbEntity.createdDateTime) createdDateTime.setTime(parseInt(dbEntity.createdDateTime.N));
            return {
                email: dbEntity.email.S,
                name:dbEntity.name.S,
                surname:dbEntity.surname.S,
                onlineStatus: onlineStatus,
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
                    onlineStatus    : {S  : user.onlineStatus},
                    createdDateTime : {N     : createdDateTime.getTime().toString()}
                };
        }
    };
})();