(function () {
    var should = require('should');
    var AWS = require('aws-sdk');
    var usersRepository = require("../repositories/usersRepository");

    var userData={email:'vladcod@yahoo.com',
                    passwordHash:'testhashhh'};
    describe.skip('Initialisation test', function() {
        it("Test update user passwordHash\n", function (done) {

            usersRepository.resetUserPassword(userData, function (err) {
                should.not.exist(err);
                done();
            });

        });


    });
})();