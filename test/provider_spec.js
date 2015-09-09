/**
 * Created by Victor on 06/08/2015.
 */
var ProviderFactory                = require('../model').ProviderFactory;
var assert                            = require('assert');

(function(){

    describe("Test health professional entity", function () {
        describe("All constructing arguments are valid", function () {
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

            it("Properties are valid", function () {
                //ToDo-here test properties are valid
            });
        });
    });
})();