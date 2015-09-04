/**
 * Created by Victor on 13/08/2015.
 */

(function() {

    //var domainModel = require('@vcrudu/hcm.domainmodel');
    var domainModel = require('../model').HealthProfessional;

    module.exports  = {

        mapToDbEntity : function(item){
            return {
                email : {S : item.email},
                title : {S : item.title},
                firstname : {S : item.firstname},
                surname : {S : item.surname},
                practiceName : {S : item.practiceName},
                practiceIdentifier : {S : item.practiceIdentifier},
                healthProfessionalType : {S : item.healthProfessionalType}
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
                healthProfessionalType: dbEntity.healthProfessionalType.S
            });
        }
    };
})();