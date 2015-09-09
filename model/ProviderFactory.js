/**
 * Created by Victor on 07/09/2015.
 */
var Provider = require('./provider');
var _ = require('underscore');

(function(){

    function buildProvider(args){
        var provider = new Provider(args);
        if(args.contactDetails){
            _.forEach(args.contactDetails,function(contactDetail){
                provider.addContactDetail(contactDetail.contactType, contactDetail.contact);
            });
        }
        return provider;
    }

    module.exports={
        createProviderFromBody:buildProvider,
        getSample:function(){
            var provider = buildProvider({email:"test@test.com",title:"Dr", name:"Michael",
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

            return _.extend({type:"provider",password:"test"}, provider.getDto());
        }
    };
})();