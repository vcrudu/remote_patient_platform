/**
 * Created by Victor on 06/08/2015.
 */
var ProviderFactory                = require('../model').ProviderFactory;
var providerDbMapper = require("../repositories/providerDbMapper");
var assert = require('assert');

describe("Test provider entity", function () {
        var providerUnderTest;
        before(function () {
            providerUnderTest = ProviderFactory.createProviderFromBody({email:"test@test.com",title:"Dr", name:"Michael",
                surname:"Scott", providerType:"paediatrics", practiceName:"Rowan Tree Surgery",
                practiceIdentifier:"NHS0121",
                addressLine1:"92 Bathurst Gardens", addressLine2 :"Second floor",
                town:"Great London", county:"London", country:"United Kingdom",
                longitude:-0.158995,latitude:51.519912,
                postCode:"W1H 2JL",
                contactDetails:[{contactType:"Phone", contact:"+442022223334"},
                    {contactType:"Mobile", contact:"+442022223334"}
                ],
                availabilityType:"regular",
                availabilities:[{day:1,startTime:"08:00AM",endTime:"12:00PM"},
                    {day:1,startTime:"01:00PM",endTime:"05:00PM"},
                    {day:2,startTime:"08:00AM",endTime:"12:00AM"},
                    {day:2,startTime:"01:00PM",endTime:"05:00PM"}
                ]
            });

           providerUnderTest.addContactDetail("Phone","+442022223334");
        });
        it("Is mapping correct", function() {
            var dbProvider = providerDbMapper.mapToDbEntity(providerUnderTest);
            assert.equal(dbProvider.id.S, providerUnderTest.id, "Id does not match");
            assert.equal(dbProvider.email.S, providerUnderTest.email, "Email does not match");
            assert.equal(dbProvider.title.S, providerUnderTest.title, "Title does not match");
            assert.equal(dbProvider.name.S, providerUnderTest.name, "Name does not match");
            assert.equal(dbProvider.surname.S, providerUnderTest.surname, "Surname does not match");
            assert.equal(dbProvider.practiceName.S, providerUnderTest.practiceName, "Practice name does not match");
            assert.equal(dbProvider.practiceIdentifier.S, providerUnderTest.practiceIdentifier, "Practice identifier does not match");
            assert.equal(dbProvider.providerType.S, providerUnderTest.providerType, "Provider type does not match");

            assert.equal(dbProvider.address.M.id.S, providerUnderTest.address.id, "Address id does not match");
            assert.equal(dbProvider.address.M.addressLine1.S, providerUnderTest.address.addressLine1, "Address addressLine1 does not match");
            assert.equal(dbProvider.address.M.addressLine2.S, providerUnderTest.address.addressLine2, "Address addressLine2 does not match");
            assert.equal(dbProvider.address.M.town.S, providerUnderTest.address.town, "Address town does not match");
            assert.equal(dbProvider.address.M.county.S, providerUnderTest.address.county, "Address county does not match");
            assert.equal(dbProvider.address.M.country.S, providerUnderTest.address.country, "Address country does not match");
            assert.equal(dbProvider.address.M.postCode.S, providerUnderTest.address.postCode, "Address post code does not match");
            assert.equal(dbProvider.address.M.longitude.S, providerUnderTest.address.longitude, "Address longitude does not match");
            assert.equal(dbProvider.address.M.latitude.S, providerUnderTest.address.latitude, "Address latitude does not match");

            var temp = providerUnderTest.getContactDetails();
            assert.equal(dbProvider.contactDetails.L.length, temp.length, "Contact details length does not match");
            for(i=0; i<temp.length; i++)
            {
                assert.equal(dbProvider.contactDetails.L[i].contactType.S, temp[i].contactType, "Contact type does not match");
                assert.equal(dbProvider.contactDetails.L[i].contact.S, temp[i].contact, "Contact does not match");
            }

            assert.equal(dbProvider.availabilityType.S, providerUnderTest.availabilityType, "Availability type does not match");

            temp = providerUnderTest.getAvailabilities();
            assert.equal(dbProvider.availabilities.L.length, temp.length, "Contact details length does not match");
            for(i=0; i<temp.length; i++)
            {
                assert.equal(dbProvider.availabilities.L[i].day.N, temp[i].day, "Availabilities day does not match");
                assert.equal(dbProvider.availabilities.L[i].startTime.S, temp[i].startTime, "Availabilities start time does not match");
                assert.equal(dbProvider.availabilities.L[i].endTime.S, temp[i].endTime, "Availabilities end time does not match");
            }
        });

        it("Properties are valid", function () {
            //ToDo-here test properties are valid
        });

});
