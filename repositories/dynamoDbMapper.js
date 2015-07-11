/**
 * Created by Victor on 06/07/2015.
 */

(function(){
    var bcrypt      = require('bcrypt');
    var domainModel = require('@vcrudu/hcm.domainmodel');

    function dateToNumber(date){
        //date.
    }

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

        //
        //-----------------Map To DbEntity-------------------
        //

        mapOtherIdentifiersToDbEntity : function(identifier)
        {
            return {
                    otherIdentifierType: {S: identifier.otherIdentifierType},
                    otherIdentifier: {S: identifier.otherIdentifier}
                }
        },

        //----------------- Relevant Contacts
        mapRelevantContactsDetailsToDbEntity : function(contactDetail)
        {
            return {
                contactType : {S : contactDetail.contactType},
                contact : {S : contactDetail.contact}
            }
        },

        mapRelevantContactsToDbEntity : function(relevantContact)
        {
            var allRelevantContactDetails;
            for(var i=0; i<relevantContact.contactDetails.length; i++)
            {
                var temp = mapRelevantContactsDetailsToDbEntity(relevantContact.contactDetails[i]);
                allRelevantContactDetails.push(temp);
            }
            return {
                fullName : {S: relevantContact.fullName},
                relationship : {S: relevantContact.relationship},
                contactDetails : {L : allRelevantContactDetails}
            }
        },
        //---------------- End Relevant Contacts

        mapDevicesToDbEntity : function(device)
        {
            return {
                model : {S: device.model},
                serialNumber : {S: device.serialNumber},
                manufacturer : {S: device.manufacturer},
                deviceType : {S: device.deviceType}
            }
        },

        mapAddressToDbEntity : function(item)
        {
            return {
                id:{S: item.id},
                addressLine1:{S: item.addressLine1},
                addressLine2:{S: item.addressLine2},
                town:{S: item.town},
                county:{S: item.county},
                country:{S: item.country},
                postCode:{S: item.postCode},
                longitude:{S: item.longitude},
                latitude:{S: item.longitude}
            }
        },

        createUserDetailsDbEntityFromPatient : function(patient){
            var allOtherIdentifiers;
            for(var i=0; i<patient.otherIdentifiers.length; i++)
            {
                var temp = mapOtherIdentifiersToDbEntity(patient.otherIdentifiers[i]);
                allOtherIdentifiers.push(temp);
            }

            var allRelevantContacts;
            for(var i=0; i<patient.relevantContacts.length; i++)
            {
                var temp = mapRelevantContactsToDbEntity(patient.relevantContacts[i]);
                allRelevantContacts.push(temp);
            }

            var allDevices;
            for(var i=0; i<patient.devices; i++)
            {
                var temp = mapDevicesToDbEntity(patient.devices[i]);
                allDevices.push(temp);
            }
            var fullAddress = mapAddressToDbEntity(patient.address);

            var dateOfBirthNumber = dateOfBirth.getTime().toString();


            return {
                    id: {S:patient.id},
                    name:{S:patient.name},
                    surname: {S:patient.surname},
                    title: {S:patient.title},
                    dateOfBirth: {N:dateOfBirthNumber},
                    sex: {S:patient.sex},
                    gender: {S:patient.gender},
                    ethnicity: {S:patient.ethnicity},
                    nhsNumber: {S:patient.nhsNumber},
                    otherIdentifiers: {L:allOtherIdentifiers},
                    phone: {S:patient.phone},
                    mobile: {S:patient.mobile},
                    fax: {S:patient.fax},
                    email: {S:patient.email},
                    relevantContacts: {L:allRelevantContacts},
                    communicationPreference: {S:patient.communicationPreference},
                    address: {M:fullAddress},
                    avatar: {S:patient.avatar},
                    externalId: {S:patient.externalId},
                    devices: {L:allDevices}
            };
        },



       //
       //-----------------Map from DbEntity-------------------
       //


        mapOtherIdentifiersFromDbEntity : function(identifier)
        {
            return{
                otherIdentifierType: identifier.otherIdentifierType.S,
                otherIdentifier: identifier.otherIdentifier.S
            }
        },

        mapRelevantContactDetailsToDbEntity : function(contactDetail)
        {
            return{
                contactType : contactDetail.contactType.S,
                contact : contactDetail.contact.S
            }
        },

        mapRelevantContactsFromDbEntity : function(relevantContact)
        {
            var allRelevantContactDetails;
            for(var i=0; i<relevantContact.contactDetails.L.length; i++)
            {
                var temp = mapRelevantContactDetailsToDbEntity(relevantContact.contactDetails.L[i]);
                allRelevantContactDetails.push(temp);
            }
            return {
                fullName : relevantContact.fullName.S,
                relationship : relevantContact.relationship.S,
                contactDetails : allRelevantContactDetails
            }
        },

        mapAddressFromDbEntity : function(item)
        {
            return new Address({
                id: item.id.S,
                addressLine1: item.addressLine1.S,
                addressLine2: item.addressLine2.S,
                town: item.town.S,
                county: item.county.S,
                country: item.country.S,
                postCode: item.postCode.S,
                longitude: item.longitude.S,
                latitude: item.longitude.S
            });
        },

        mapDevicesFromDbEntity : function(device)
        {
            return {
                model :  device.model.S,
                serialNumber : device.serialNumber.S,
                manufacturer : device.manufacturer.S,
                deviceType : device.deviceType.S
            }
        },

        mapPatientFromUserDetailsDbEntity: function(dbEntity)
        {
            var dateOfBirthOriginal = new Date().setTime(parseInt(dbEntity.dateOfBirth.N));
            var allOtherIdentifiers;
            var allRelevantContacts;
            var fullAddress = mapAddressFromDbEntity(dbEntity.address.M);
            var allDevices;

            for(var i=0; i<dbEntity.otherIdentifiers.L.length; i++)
            {
                var temp = mapOtherIdentifiersFromDbEntity(dbEntity.otherIdentifiers.L[i]);
                allOtherIdentifiers.push(temp);
            }

            for(var i=0; i<dbEntity.relevantContacts.L.length; i++)
            {
                var temp = mapRelevantContactsFromDbEntity(dbEntity.relevantContacts.L[i]);
                allRelevantContacts.push(temp);
            }

            for(var i=0; i<dbEntity.devices.L.length; i++)
            {
                var temp = mapDevicesFromDbEntity(dbEntity.devices.L[i]);
                allDevices.push(temp);
            }

            var checkNull = function(arg1){
                if(arg1) return arg1.S;
                else undefined;
            };

            var patient = new Patient({
                    id: dbEntity.id.S,
                    name: dbEntity.name.S,
                    surname: dbEntity.surname.S,
                    title: dbEntity.title.S,
                    dateOfBirth: dateOfBirthOriginal,
                    sex: dbEntity.sex.S,
                    gender: dbEntity.gender.S,
                    ethnicity: dbEntity.ethnicity.S,
                    nhsNumber: dbEntity.nhsNumber.S,
                    otherIdentifiers: allOtherIdentifiers,
                    phone: dbEntity.phone.S,
                    mobile: checkNull(dbEntity.mobile),
                    fax: dbEntity.fax.S,
                    email: dbEntity.email.S,
                    relevantContacts: allRelevantContacts,
                    communicationPreference: dbEntity.communicationPreference.S,
                    address: fullAddress,
                    avatar: dbEntity.avatar.S,
                    externalId: dbEntity.externalId.S,
                    devices: allDevices
                }
            );
            return patient;
        }
    };
})();
