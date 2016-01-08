/**
 * Created by Vladcod on 07.01.2016.
 */
(function () {
    var should = require('should');
    var AWS = require('aws-sdk');
    var emailService = require("../../services/emailService");

    it("Expediez o scrisoare\n", function (done){

        emailService.sendSubscriptionCofirmation(userId, function (err, result) {
            should.not.exist(err);
            done();
        },1,1);

    });



})();