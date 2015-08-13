/**
 * Created by Victor on 13/08/2015.
 */

var assert = require("assert");
var uuid = require("node-uuid");
var _ = require("underscore");
var entitiesFactory      = require("@vcrudu/hcm.domainmodel");

var Address = require("./address");

(function(){
    module.exports = function(args){
        assert.ok(args.email, "Email is required!");
        assert.ok(args.title, "Title is required!");
        assert.ok(args.firstname,"First name is required!");
        assert.ok(args.surname,"Surname name is required!");
        assert.ok(args.practiceName,"Practice Name is required!");
        assert.ok(args.practiceIdentifier,"Practice Identifier is required!");
        assert.ok(args.healthProfessionalType, "Health Professional Type is required!");

        var hpTypes = ["caregiver",
            "nurse",
            "medicine",
            "general practice",
            "anaesthetics",
            "ophthalmology",
            "paediatrics",
            "pathology",
            "psychiatry",
            "surgery"];

        if(hpTypes.indexOf(args.healthProfessionalType)==-1) throw new Error("Invalid Health Professional Type!");

        var hp = {};

        if(args.id) {
            assert.equal(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(args.id),true,"Id is not a valid v4 uuid!");
            hp.id = args.id;
        }else{
            hp.id = uuid.v4();
        }

        hp.email = args.email;
        hp.title = args.title;
        hp.firstname = args.firstname;
        hp.surname = args.surname;
        hp.practiceName = args.practiceName;
        hp.practiceIdentifier = args.practiceIdentifier;
        hp.healthProfessionalType = args.healthProfessionalType;
        if(args.address){
            hp.address = args.address;
        }else{
            hp.address = entitiesFactory.createAddress(args);
        }
        var contactDetails = [];

        hp.addContactDetail = function(contactType, contact){
            assert.ok(contactType, "Contact type is required!");
            assert.ok(contact, "Contact is required!");
            var contactDetail = _.find(this.contactDetails,function(contactType)
            {return contactType.contactType==contactType;});
            if(contactDetail){
                contactDetail.contact = contact;
            }else {
                this.contactDetails.push({contactType: contactType, contact: contact});
            }
        };

        hp.getContactDetails = function(){
            return contactDetails.concat([]);
        };

        return hp;
    };
})();