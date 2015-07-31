/**
 * Created by home on 11.07.2015.
 */
var assert = require('assert');
var dynamoDbMapper = require("../repositories/dynamoDbMapper");
var entitiesFactory = require("@vcrudu/hcm.domainmodel");

describe("Test mapping from entity to Db", function () {
    var patient;
    var dateOfBirth = new Date(1941, 06, 01);
    before(function(){

        patient = entitiesFactory.createPatient({
                title: "Mr", name: "John", surname: "Smith",
                dateOfBirth: dateOfBirth, sex: "Male",
                gender: "Male",
                ethnicity: "European", nhsNumber: "943 476 5919",
                otherIdentifierType: "France", otherIdentifier: "12345678", fullName: "Jhon Smith", relationship:"Friend", contactDetails:{contactType : "Friend", contact: "Gh"},
                email: "john.smith@test.com", phone: "+373 796 04494", mobile: "+373 796 04494",
                fax: "+373 796 04494", communicationPreference: "Phone",
                addressLine1: "92 Bathurst Gardens", addressLine2: "Second floor",
                town: "Great London", county: "London", country: "United Kingdom",
                longitude: -0.158995, latitude: 51.519912,
                postCode: "W1H 2JL"
            }
        );

        patient.addRelevantContact({fullName: "Peter Bowl", relationship: "Friend"});
        patient.addRelevantContactDetail({
            fullName: "Peter Bowl",
            contactType: "Phone",
            contact: "01892345678"
        });
        patient.addRelevantContactDetail({
            fullName: "Peter Bowl",
            contactType: "Mobile",
            contact: "07512345678"
        });

        patient.attachDevice("PT307", "SN12345","A&D Medical", "BloodPressure");
        var today = new Date(1941, 06, 01);
        patient.addHealthProblem("Head Pain", today, "Health problem description.");
    });

    it("Is mapping correct", function(){
        var dbPatient = dynamoDbMapper.createUserDetailsDbEntityFromPatient(patient);
        assert.equal(dbPatient.id.S, patient.id, "Id does not match");
        assert.equal(dbPatient.name.S, patient.name, "Name does not match");
        assert.equal(dbPatient.surname.S, patient.surname, "Surname does not match");
        assert.equal(dbPatient.title.S, patient.title, "Title does not match");
        assert.equal(parseInt(dbPatient.dateOfBirth.N), patient.dateOfBirth.getTime(), "Date of birth does not match");
        assert.equal(dbPatient.sex.S, patient.sex, "Sex does not match");
        assert.equal(dbPatient.gender.S, patient.gender, "Gender does not match");
        assert.equal(dbPatient.ethnicity.S, patient.ethnicity, "Ethnicity does not match");
        assert.equal(dbPatient.nhsNumber.S, patient.nhsNumber, "Ensurance number does not match");
        assert.equal(dbPatient.otherIdentifiers.L.length, patient.otherIdentifiers.length, "Other identifiers does not match");
        for(var i=0; i<patient.otherIdentifiers.length; i++)
        {
            assert.equal(dbPatient.otherIdentifiers.L[i].otherIdentifierType.S, patient.otherIdentifiers[i].otherIdentifierType, "Other identifiers does not match");
            assert.equal(dbPatient.otherIdentifiers.L[i].otherIdentifier.S, patient.otherIdentifiers[i].otherIdentifier, "Other identifiers does not match");
        }
        assert.equal(dbPatient.phone.S, patient.phone, "Phone does not match");
        assert.equal(dbPatient.mobile.S, patient.mobile, "Mobile does not match");
        assert.equal(dbPatient.fax.S, patient.fax, "Fax does not match");
        assert.equal(dbPatient.email.S, patient.email, "Email does not match");
        assert.equal(dbPatient.relevantContacts.L.length, patient.relevantContacts.length, "Relevant contacts does not match");

        for(i=0; i<patient.relevantContacts.length; i++)
        {
            assert.equal(dbPatient.relevantContacts.L[i].fullName.S, patient.relevantContacts[i].fullName, "Relevant contacts does not match");
            assert.equal(dbPatient.relevantContacts.L[i].relationship.S, patient.relevantContacts[i].relationship, "Relevant contacts does not match");
            assert.equal(dbPatient.relevantContacts.L[i].contactDetails.L.length, patient.relevantContacts[i].contactDetails.length, "Relevant contacts details length does not match");
            for(var j=0; j < patient.relevantContacts[i].contactDetails.length; j++)
            {
                assert.equal(dbPatient.relevantContacts.L[i].contactDetails.L[j].contactType.S, patient.relevantContacts[i].contactDetails[j].contactType, "Relevant contacts details does not match");
                assert.equal(dbPatient.relevantContacts.L[i].contactDetails.L[j].contact.S, patient.relevantContacts[i].contactDetails[j].contact, "Relevant contacts details does not match");
            }

        }
        assert.equal(dbPatient.communicationPreference.S, patient.communicationPreference, "Communication preference does not match");
        assert.equal(dbPatient.address.M.id.S, patient.address.id, "Address id does not match");
        assert.equal(dbPatient.address.M.addressLine1.S, patient.address.addressLine1, "Address addressLine1 does not match");
        assert.equal(dbPatient.address.M.addressLine2.S, patient.address.addressLine2, "Address addressLine2 does not match");
        assert.equal(dbPatient.address.M.town.S, patient.address.town, "Address town does not match");
        assert.equal(dbPatient.address.M.county.S, patient.address.county, "Address county does not match");
        assert.equal(dbPatient.address.M.country.S, patient.address.country, "Address country does not match");
        assert.equal(dbPatient.address.M.postCode.S, patient.address.postCode, "Address post code does not match");
        assert.equal(dbPatient.address.M.longitude.S, patient.address.longitude, "Address longitude does not match");
        assert.equal(dbPatient.address.M.latitude.S, patient.address.latitude, "Address latitude does not match");

        assert.equal(dbPatient.avatar.S, patient.avatar, "Avatar does not match");
        assert.equal(dbPatient.externalId.S, patient.externalId, "External id does not match");

        assert.equal(dbPatient.devices.L.length, patient.devices.length, "Devices length does not match");
        for(i=0; i<patient.devices.length; i++)
        {
            assert.equal(dbPatient.devices.L[i].model.S, patient.devices[i].model, "Devices model does not match");
            assert.equal(dbPatient.devices.L[i].serialNumber.S, patient.devices[i].serialNumber, "Devices serial number does not match");
            assert.equal(dbPatient.devices.L[i].manufacturer.S, patient.devices[i].manufacturer, "Devices manufacturer does not match");
            assert.equal(dbPatient.devices.L[i].deviceType.S, patient.devices[i].deviceType, "Devices device type does not match");
        }

        assert.equal(dbPatient.healthProblems.L.length, patient.healthProblems.length, "Health problems length does not match");
        for(i=0; i<patient.healthProblems.length; i++)
        {
            assert.equal(dbPatient.healthProblems.L[i].problemType.S, patient.healthProblems[i].problemType, "Health problems type does not match");
            assert.equal(dbPatient.healthProblems.L[i].date.N, patient.healthProblems[i].date.getTime(), "Health problems date does not match");
            assert.equal(dbPatient.healthProblems.L[i].description.S, patient.healthProblems[i].description, "Health problems description type does not match");
        }
    });

});