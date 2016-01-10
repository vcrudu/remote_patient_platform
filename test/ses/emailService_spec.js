/**
 * Created by Vladcod on 07.01.2016.
 */
(function () {
    var should = require('should');
    var AWS = require('aws-sdk');
    var emailService = require("../../services/emailService");

    var userId={
        email:'vladcod@yahoo.com',
        title:'Mr.',
        name:'Vlad',
        surname:'Codreanu',
    };

    describe('Usage SES service', function() {
        it("Verify send email\n", function (done) {

            emailService.sendSubscriptionConfirmation(userId, function (err) {
                should.not.exist(err);
                done();
            });

        });


    });
})();