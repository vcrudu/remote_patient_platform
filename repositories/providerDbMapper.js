/**
 * Created by Victor on 13/08/2015.
 */

(function() {

    //var providerFactory = require('@vcrudu/hcm.domainmodel');
    var providerFactory = require('../model').ProviderFactory;
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
    function buildDynamoDbString(str){
        if(str) return {S:str};
        else return {NULL:true};
    }
    function mapAddressToDbEntity(item)
    {
        return {
            id:buildDynamoDbString(item.id),
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
    function mapContactDetailsToDbEntity(item)
    {
        return {M:{
            contactType: {S: item.contactType},
            contact: {S: item.contact}
        }};
    }
    function mapAvailabilitiesToDbEntity(item)
    {
        return {M:{
            day: {N: item.day.toString()},
            startTime: {S: item.startTime},
            endTime: {S: item.endTime}
        }};
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
    function mapContactDetailsFromDbEntity(item)
    {
        return{
            contactType: item.M.contactType.S,
            contact: item.M.contact.S
        };
    }
    function mapAvailabilitiesFromDbEntity(item)
    {
        return {
            day: item.day.N,
            startTime: item.startTime.S,
            endTime: item.endTime.S
        };
    }
    module.exports  = {

        mapToDbEntity : function(item){
            if (item.agent!=='mobile' && item.agent!=='browser') {
                var fullAddress = mapAddressToDbEntity(item.address);
                var allContactDetails = buildArray(item.getContactDetails(), mapContactDetailsToDbEntity);
                var allAvailabilities = buildArray(item.getAvailabilities(), mapAvailabilitiesToDbEntity);

                return {
                    id: {S: item.id},
                    email: {S: item.email},
                    title: {S: item.title},
                    name: {S: item.name},
                    surname: {S: item.surname},
                    practiceName: {S: item.practiceName},
                    practiceIdentifier: {S: item.practiceIdentifier},
                    providerType: {S: item.providerType},
                    address: {M: fullAddress},
                    contactDetails: {L: allContactDetails},
                    availabilityType: {S: item.availabilityType},
                    availabilities: {L: allAvailabilities}

                };
            } else {
                return {
                    id: {S: item.id},
                    email: {S: item.email},
                    title: {S: 'Mr.'},
                    name: {S: item.name},
                    surname: {S: item.surname},
                    providerType: {S: item.providerType || "Nurse"},
                    availabilityType: {S: 'regular'},
                    contactDetails: {L: [{"M": {"contactType": {"S": "Phone"}, "contact": {"S": item.phone}}}]},
                    availabilities: {L: []}
                };
            }
        },

        mapFromDbEntity : function(dbEntity){
            var fullAddress;
            if(dbEntity.address) fullAddress = mapAddressFromDbEntity(dbEntity.address.M);
            var allContactDetails = buildArray(dbEntity.contactDetails.L, mapContactDetailsFromDbEntity);
            var allAvailabilities = buildArray(dbEntity.availabilities.L, mapAvailabilitiesFromDbEntity);

            var provider = providerFactory.createProviderFromBody({
                id : dbEntity.id.S,
                email: dbEntity.email.S,
                title: dbEntity.title.S,
                name: dbEntity.name.S,
                surname: dbEntity.surname.S,
                providerType: dbEntity.providerType.S,
                address: fullAddress,
                contactDetails: allContactDetails,
                availabilities: allAvailabilities
            });

            provider.contactDetails = provider.getContactDetails();

            return provider;
        }
    };
})();