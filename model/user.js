/**
 * Created by Victor on 21/06/2015.
 */
(function(){
    var bcrypt      = require('bcrypt');
    var domainModel = require('@vcrudu/hcm.domainmodel');
    var _ = require('underscore');

    // helper methods
    function tryGetStringProperty (property) {
        try {
            return property.S;
        }
        catch(e) {
            return ""
        }
    }

    function tryGetNumberProperty (property) {
        try {
            return property.N;
        }
        catch(e) {
            return -1;
        }
    }

    function mapAddressFromDbEntity(dbEntity){
        if(!dbEntity.address || dbEntity.address.NULL)
            return null;

        return {
            addressLine1: dbEntity.address.M.addressLine1.S,
            addressLine2: dbEntity.address.M.addressLine2.S,
            country: dbEntity.address.M.country.S,
            county: dbEntity.address.M.county.S,
            id: dbEntity.address.M.id.S,
            postCode: dbEntity.address.M.postCode.S,
            town: dbEntity.address.M.town.S
        }
    }

    module.exports  = {
      createUserFromBody : function(requestBody){
         var salt = bcrypt.genSaltSync(10);
         var passwordHash = bcrypt.hashSync(requestBody.password, salt);
          return {
              email: requestBody.email,
              passwordHash: passwordHash,
              name: requestBody.name,
              surname: requestBody.surname,
              type: requestBody.type,
              isActive: false, //TO-DO was true
              socketId:'NULL',
              onlineStatus: "offline"
          };
      },
        createUserFromDbEntity : function(dbEntity) {
            var createdDateTime = new Date();
            var onlineStatus = 'offline';
            var socketId;
            var socketIds;
            //Todo-here to put this in config
            //Todo-here to define the gender of the user
            var avatar = 'https://s3-eu-west-1.amazonaws.com/trichrome/public/male-doctor.png';
            if (dbEntity.onlineStatus) onlineStatus = dbEntity.onlineStatus.S;
            if (dbEntity.avatar) avatar = dbEntity.avatar.S;

            if (dbEntity.socketIds) socketIds = dbEntity.socketIds ? _.map(dbEntity.socketIds.L, function(mappedSocketId){
                return mappedSocketId.S;
            }) : [];
            if (socketIds&&socketIds.length>0) socketId = socketIds[0];
            if (dbEntity.createdDateTime) createdDateTime.setTime(parseInt(dbEntity.createdDateTime.N));
            return {
                email: dbEntity.email.S,
                name: dbEntity.name.S,
                surname: dbEntity.surname.S,
                passwordHash: dbEntity.passwordHash.S,
                token: dbEntity.tokenString.S,
                isActive: dbEntity.isActive.BOOL,
                type: dbEntity.type.S,
                onlineStatus: onlineStatus,
                socketId: socketId,
                socketIds: socketIds,
                avatar: avatar,
                createdDateTime: createdDateTime,
                userState: dbEntity.userState ? dbEntity.userState.S : null
            };
        },
        createUserDtoFromDbEntity : function(dbEntity){
            var createdDateTime = new Date();
            var onlineStatus = 'offline';
            var socketId;
            if(dbEntity.onlineStatus) onlineStatus=dbEntity.onlineStatus.S;
            if(dbEntity.socketId) socketId=dbEntity.socketId.S;
            if(dbEntity.createdDateTime) createdDateTime.setTime(parseInt(dbEntity.createdDateTime.N));
            return {
                email: dbEntity.email.S,
                name:dbEntity.name.S,
                surname:dbEntity.surname.S,
                type:dbEntity.type.S,
                onlineStatus: onlineStatus,
                createdDateTime:createdDateTime
            };
        },
        createUserDetailsFromDbEntity : function(dbEntity){
            //Todo-here to clarify what's up with this method
            return {
                firstname: tryGetStringProperty(dbEntity.name),
                surname: tryGetStringProperty(dbEntity.surname),
                title:tryGetStringProperty(dbEntity.title),
                dateOfBirth: tryGetNumberProperty(dbEntity.dateOfBirth),
                sex: tryGetStringProperty(dbEntity.sex),
                gender: tryGetStringProperty(dbEntity.gender),
                ethnicity: tryGetStringProperty(dbEntity.ethnicity),
                nhsNumber: tryGetStringProperty(dbEntity.nhsNumber),
                phone: tryGetStringProperty(dbEntity.phone),
                mobile: tryGetStringProperty(dbEntity.mobile),
                address: mapAddressFromDbEntity(dbEntity),
                email: tryGetStringProperty(dbEntity.email)
                /* address: dbEntity.fullAddress.M,
                avatar: buildDynamoDbString(patient.avatar),
                externalId: buildDynamoDbString(patient.externalId),
                devices: {L:allDevices},
                healthProblems : {L:allHealthProblems}*/
            };
        },

        createUserDetailsFromBody : function(requestBody){
            var patient = domainModel.createPatient(requestBody);
            requestBody.healthProblems.forEach(function (healthProblem) {
                patient.addHealthProblem(healthProblem, new Date(), healthProblem);
            });
            return patient;
        },
        createDbEntityFromUser : function(user) {
            var createdDateTime = new Date();
            return {
                email: {S: user.email},
                passwordHash: {S: user.passwordHash},
                name: {S: user.name},
                surname: {S: user.surname},
                tokenString: {S: user.token},
                isActive: {BOOL: user.isActive},
                type: {S: user.type},
                onlineStatus: {S: user.onlineStatus},
                createdDateTime: {N: createdDateTime.getTime().toString()}
            };
        }
    };
})();