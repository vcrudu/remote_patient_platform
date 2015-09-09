/**
 * Created by Victor on 13/08/2015.
 */

var assert          = require("assert");
var uuid            = require("node-uuid");
var _               = require("underscore");
var entitiesFactory = require("@vcrudu/hcm.domainmodel");
var Payment = require("./payment");

(function(){
    module.exports = function(args){
        assert.ok(args.email, "Email is required!");
        assert.ok(args.title, "Title is required!");
        assert.ok(args.name,"First name is required!");
        assert.ok(args.surname,"Surname name is required!");
        assert.ok(args.practiceName,"Practice Name is required!");
        assert.ok(args.practiceIdentifier,"Practice Identifier is required!");
        assert.ok(args.providerType, "Health Professional Type is required!");
        assert.ok(args.availabilityType, "Please provide availability type!");
        assert.ok(args.availabilityType==="regular" || args.availabilityType==="byDate",
            "Availability type can be either regular or byDate!");

        var providerTypes = ["caregiver",
            "nurse",
            "medicine",
            "general practice",
            "anaesthetics",
            "ophthalmology",
            "paediatrics",
            "pathology",
            "psychiatry",
            "surgery"];

        if(providerTypes.indexOf(args.providerType)==-1) throw new Error("Invalid Health Professional Type!");

        var hp = {};

        if(args.id) {
            assert.equal(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(args.id),true,"Id is not a valid v4 uuid!");
            hp.id = args.id;
        }else{
            hp.id = uuid.v4();
        }

        hp.email = args.email;
        hp.title = args.title;
        hp.name = args.name;
        hp.surname = args.surname;
        hp.practiceName = args.practiceName;
        hp.practiceIdentifier = args.practiceIdentifier;
        hp.providerType = args.providerType;
        if(args.address){
            hp.address = args.address;
        }else{
            hp.address = entitiesFactory.createAddress(args);
        }
        var contactDetails = [];

        var availabilities = [];

        hp.availabilityType=args.availabilityType;

        if(args.availabilityType==="regular") {
            _.forEach(args.availabilities, function (availability) {
                assert.ok(availability.day, "Availability should have day field if is regular!");
                assert.ok(availability.startTime, "Availability should have start time!");
                assert.ok(availability.endTime, "Availability should have end time!");
                availabilities.push(availability);
            });
        } else{
            _.forEach(args.availabilities, function (availability) {
                assert.ok(availability.date, "Availability should have date field if is not regular!");
                assert.ok(availability.startTime, "At least one availability interval does not have start time!");
                assert.ok(availability.endTime, "At least one availability interval does not have end time!");
                availabilities.push(availability);
            });
        }

        hp.addContactDetail = function(contactType, contact){
            assert.ok(contactType, "Contact type is required!");
            assert.ok(contact, "Contact is required!");
            var contactDetail = _.find(this.contactDetails,function(contactType)
            {return contactType.contactType==contactType;});
            if(contactDetail){
                contactDetail.contact = contact;
            }else {
                contactDetails.push({contactType: contactType, contact: contact});
            }
        };

        hp.getContactDetails = function(){
            return contactDetails.concat([]);
        };

        hp.getDto = function(){
            return {
                email:hp.email,
                title:hp.title,
                name:hp.name,
                surname:hp.surname,
                practiceName:hp.practiceName,
                practiceIdentifier:hp.practiceIdentifier,
                providerType:hp.providerType,
                address:hp.address,
                contactDetails:contactDetails,
                availabilityType:hp.availabilityType,
                availabilities:availabilities
            };
        };

        return hp;
    };
})();