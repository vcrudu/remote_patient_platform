/**
 * Created by Vladcod on 07.01.2016.
 */
(function () {
    var should = require('should');
    var AWS = require('aws-sdk');
    var emailService = require("../../services/emailService");

    var userId='vladcod@yahoo.com';

    describe('Usage SES service', function() {
        it("Send Subscription Confirmation email\n", function (done) {

            emailService.sendSubscriptionConfirmation(userId, function (err) {
                should.not.exist(err);
                done();
            });

        });
        it.only("Send Password Reset email\n", function (done) {

            emailService.sendPasswordReset(userId, function (err) {
                should.not.exist(err);
                done();
            });

        });

    });
})();