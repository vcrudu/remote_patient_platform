/**
 * Created by Victor on 13/08/2015.
 */

(function() {

    //var domainModel = require('@vcrudu/hcm.domainmodel');
    var domainModel = require('../model').Provider;

    module.exports  = {

        mapToDbEntity : function(item){
            return {
                email : {S : item.email},
                title : {S : item.title},
                firstname : {S : item.firstname},
                surname : {S : item.surname},
                practiceName : {S : item.practiceName},
                practiceIdentifier : {S : item.practiceIdentifier},
                providerType : {S : item.providerType}
            };
        },

        mapFromDbEntity : function(dbEntity){
            return domainModel.createHealthProfessional({
                email: dbEntity.email.S,
                title: dbEntity.title.S,
                firstname: dbEntity.firstname.S,
                surname: dbEntity.surname.S,
                practiceName: dbEntity.practiceName.S,
                practiceIdentifier: dbEntity.practiceIdentifier.S,
                providerType: dbEntity.providerType.S
            });
        }
    };
})();