/**
 * Created by Victor on 06/07/2015.
 */

(function(){
    var bcrypt      = require('bcrypt');
    var domainModel = require('@vcrudu/hcm.domainmodel');

    function buildArray(source, mapper)
    {
        var all = [];
        for(var i=0; i<source.length; i++)
        {
            var temp = mapper(source[i]);
            all.push(temp);
        }
        return all;
    }

    //
    //-----------------Map To DbEntity-------------------
    //

    function mapOtherIdentifiersToDbEntity(identifier)
    {
        return {
            otherIdentifierType: {S: identifier.otherIdentifierType},
            otherIdentifier: {S: identifier.otherIdentifier}
        };
    }

    //----------------- Relevant Contacts
    function mapRelevantContactsDetailsToDbEntity(contactDetail)
    {
        return {
            contactType : {S : contactDetail.contactType},
            contact : {S : contactDetail.contact}
        };
    }

    function mapRelevantContactsToDbEntity(relevantContact)
    {
        var allRelevantContactDetails = [];
        for(var i=0; i<relevantContact.contactDetails.length; i++)
        {
            var temp = mapRelevantContactsDetailsToDbEntity(relevantContact.contactDetails[i]);
            allRelevantContactDetails.push(temp);
        }
        return {
            fullName : {S: relevantContact.fullName},
            relationship : {S: relevantContact.relationship},
            contactDetails : {L : allRelevantContactDetails}
        };
    }
    //---------------- End Relevant Contacts

    function mapDevicesToDbEntity(device)
    {
        return {
            model : {S: device.model},
            serialNumber : {S: device.serialNumber},
            manufacturer : {S: device.manufacturer},
            deviceType : {S: device.deviceType}
        };
    }

    function mapHealthProblemsToDbEntity(item)
    {
        var dateTemp = item.date.getTime().toString();
        return {
            problemType : {S: item.problemType},
            date : {N: dateTemp},
            description : {S: item.description}
        };
    }

    function buildDynamoDbString(str){
        if(str) return {S:str};
        else return {NULL:true};
    }

    function mapAddressToDbEntity(item)
    {
        return {
            id:{S: item.id},
            addressLine1:{S: item.addressLine1},
            addressLine2:buildDynamoDbString(item.addressLine2),
            town:{S: item.town},
            county:{S: item.county},
            country:{S: item.country},
            postCode:{S: item.postCode},
            longitude:buildDynamoDbString(item.longitude),
            latitude:buildDynamoDbString(item.latitude)
        };
    }

    //-----------------End Map To DbEntity-------------------

    //
    //-----------------Map From DbEntity-------------------
    //


    function mapOtherIdentifiersFromDbEntity(identifier)
    {
        return{
            otherIdentifierType: identifier.otherIdentifierType.S,
            otherIdentifier: identifier.otherIdentifier.S
        };
    }

    function mapRelevantContactDetailsFromDbEntity(contactDetail)
    {
        return{
            contactType : contactDetail.contactType.S,
            contact : contactDetail.contact.S
        };
    }

    function mapRelevantContactsFromDbEntity(relevantContact)
    {
        var allRelevantContactDetails = [];
        for(var i=0; i<relevantContact.contactDetails.L.length; i++)
        {
            var temp = mapRelevantContactDetailsFromDbEntity(relevantContact.contactDetails.L[i]);
            allRelevantContactDetails.push(temp);
        }
        return domainModel.createRelevantContact( {
            fullName : relevantContact.fullName.S,
            relationship : relevantContact.relationship.S,
            contactDetails : allRelevantContactDetails
        });
    }


    function mapAddressFromDbEntity(item)
    {
        return domainModel.createAddress({
            id: item.id.S,
            addressLine1: item.addressLine1.S,
            addressLine2: item.addressLine2.S,
            town: item.town.S,
            county: item.county.S,
            country: item.country.S,
            postCode: item.postCode.S,
            longitude: item.longitude.S,
            latitude: item.latitude.S
        });
    }

    function mapDevicesFromDbEntity(device)
    {
        return {
            model :  device.model.S,
            serialNumber : device.serialNumber.S,
            manufacturer : device.manufacturer.S,
            deviceType : device.deviceType.S
        };
    }

    function mapHealthProblemsFromDbEntity(item)
    {
        var dateTemp = new Date();
        dateTemp.setTime(parseInt(item.date.N));
        return {
            problemType : item.problemType.S,
            date : item.dateTemp,
            description : item.description.S
        };
    }

    //-----------------End Map From DbEntity-------------------


    module.exports  = {
        //Todo-here to move db mapper from user model to here
        createUserFromDbEntity : function(dbEntity){
            var createdDateTime = new Date();
            createdDateTime.setTime(dbEntity.createdDateTime.N);
            return {
                email: dbEntity.email.S,
                passwordHash: dbEntity.passwordHash.S,
                token: dbEntity.token.S,
                isActive:dbEntity.isActive.BOOL,
                name:dbEntity.name.S,
                surname:dbEntity.surname.S,
                onlineStatus:dbEntity.onlineStatus.S,
                createdDateTime:createdDateTime
            };
        },

        createUserDetailsDbEntityFromPatient : function(patient){
            var patientDbEntity = {
                id: {S:patient.id},
                name:{S:patient.name},
                surname: {S:patient.surname},
                email: {S:patient.email}
            }

            if (patient.title) { patientDbEntity.title = {S:patient.title}; }
            if (patient.dateOfBirth) {
                var dateOfBirthNumber = patient.dateOfBirth.getTime().toString();
                patientDbEntity.dateOfBirth = {N:dateOfBirthNumber};
            }
            if (patient.sex) { patientDbEntity.dateOfBirth = {S:patient.sex}; }
            if (patient.gender) { patientDbEntity.dateOfBirth = {S:patient.gender}; }
            if (patient.ethnicity) { patientDbEntity.ethnicity = {S:patient.ethnicity}; }
            if (patient.nhsNumber) { patientDbEntity.nhsNumber = {S:patient.nhsNumber}; }
            if (patient.otherIdentifiers) {
                var allOtherIdentifiers = buildArray(patient.otherIdentifiers, mapOtherIdentifiersToDbEntity);
                patientDbEntity.otherIdentifiers = {L:allOtherIdentifiers};
            }
            if (patient.phone) { patientDbEntity.phone = buildDynamoDbString(patient.phone); }
            if (patient.mobile) { patientDbEntity.mobile = buildDynamoDbString(patient.mobile); }
            if (patient.fax) { patientDbEntity.fax = buildDynamoDbString(patient.fax); }
            if (patient.relevantContacts) {
                var allRelevantContacts = buildArray(patient.relevantContacts, mapRelevantContactsToDbEntity);
                patientDbEntity.relevantContacts = {L:allRelevantContacts};
            }
            if (patient.communicationPreference) { patientDbEntity.communicationPreference = buildDynamoDbString(patient.communicationPreference); }
            if (patient.address) {
                var fullAddress = mapAddressToDbEntity(patient.address);
                patientDbEntity.address = {M:fullAddress};
            }
            if (patient.avatar) { patientDbEntity.avatar = buildDynamoDbString(patient.avatar); }
            if (patient.externalId) { patientDbEntity.externalId = buildDynamoDbString(patient.externalId); }
            if (patient.devices) {
                var allDevices = buildArray(patient.devices, mapDevicesToDbEntity);
                patientDbEntity.devices = {L:allDevices};
            }
            if (patient.healthProblems) {
                var allHealthProblems = buildArray(patient.healthProblems, mapHealthProblemsToDbEntity);
                patientDbEntity.devices = {L:allHealthProblems};
            }

            return patientDbEntity;

            /*return {
                    //id: {S:patient.id},
                    //name:{S:patient.name},
                    //surname: {S:patient.surname},
                    //title: {S:patient.title},
                    //dateOfBirth: {N:dateOfBirthNumber},
                    //sex: {S:patient.sex},
                    //gender: {S:patient.gender},
                    //ethnicity: {S:patient.ethnicity},
                    //nhsNumber: {S:patient.nhsNumber},
                    //otherIdentifiers: {L:allOtherIdentifiers},
                    //phone: buildDynamoDbString(patient.phone),
                    //mobile: buildDynamoDbString(patient.mobile),
                    //fax: buildDynamoDbString(patient.fax),
                    //email: {S:patient.email},
                    //relevantContacts: {L:allRelevantContacts},
                    //communicationPreference:buildDynamoDbString(patient.communicationPreference),
                    //address: {M:fullAddress},
                    //avatar: buildDynamoDbString(patient.avatar),
                    //externalId: buildDynamoDbString(patient.externalId),
                    //devices: {L:allDevices},
                    //healthProblems : {L:allHealthProblems}
            };*/
        },


        mapPatientFromUserDetailsDbEntity: function(dbEntity)
        {
            var dateOfBirthOriginal = new Date();
            dateOfBirthOriginal.setTime(parseInt(dbEntity.dateOfBirth.N));
            var allOtherIdentifiers = buildArray(dbEntity.otherIdentifiers.L, mapOtherIdentifiersFromDbEntity);
            var allRelevantContacts = buildArray(dbEntity.relevantContacts.L, mapRelevantContactsFromDbEntity);
            var fullAddress = mapAddressFromDbEntity(dbEntity.address.M);
            var allDevices = buildArray(dbEntity.devices.L, mapDevicesFromDbEntity);
            var allHealthProblems = buildArray(dbEntity.healthProblems, mapHealthProblemsFromDbEntity);

            var checkNull = function(arg1){
                if(arg1) return arg1.S;
                else return undefined;
            };

            var patient = domainModel.createPatient({
                    id: dbEntity.id.S,
                    name: dbEntity.name.S,
                    surname: dbEntity.surname.S,
                    title: dbEntity.title.S,
                    dateOfBirth: dateOfBirthOriginal,
                    sex: checkNull(dbEntity.sex),
                    gender: dbEntity.gender.S,
                    ethnicity: dbEntity.ethnicity.S,
                    nhsNumber: dbEntity.nhsNumber.S,
                    otherIdentifiers: allOtherIdentifiers,
                    phone: checkNull(dbEntity.phone),
                    mobile: checkNull(dbEntity.mobile),
                    fax: checkNull(dbEntity.fax),
                    email: dbEntity.email.S,
                    relevantContacts: allRelevantContacts,
                    communicationPreference: dbEntity.communicationPreference.S,
                    address: fullAddress,
                    avatar: checkNull(dbEntity.avatar),
                    externalId: checkNull(dbEntity.externalId),
                    devices: allDevices,
                    healthProblems: allHealthProblems
                }
            );
            return patient;
        },
        mapAddressFromDbEntity:mapAddressFromDbEntity
    };
})();
