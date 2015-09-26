/**
 * Created by Victor on 16/09/2015.
 */

(function() {
    var should = require('should');
    var awsSchemaUtils = require("../../repositories/awsSchemaUtils");

    describe("Test awsSchemaUtils", function () {
        describe("Check Exists Table", function () {
            it("Check Exists Table return false when table does not exists", function (done) {
                awsSchemaUtils.checkExistsTable("Test", function (err, result) {
                    result.should.be.false();
                    done();
                });
            });

            it("Check Exists Table return true when table exists", function (done) {
                awsSchemaUtils.createUserTable("test", function(err, data){
                    should.not.exist(err);
                    awsSchemaUtils.checkExistsTable("test_User", function (err, result) {
                        should.not.exist(err);
                        result.should.be.true();
                        awsSchemaUtils.deleteTable("test_User", function(err){
                            should.not.exist(err);
                            done();
                        });
                    });
                });
            });

            it("Check Exists Table return true when table exists", function (done) {
                awsSchemaUtils.createUserTable("test", function(err, data){
                    should.not.exist(err);
                    awsSchemaUtils.checkExistsTable("test_User", function (err, result) {
                        should.not.exist(err);
                        result.should.be.true();
                        awsSchemaUtils.deleteTable("test_User", function(err){
                            should.not.exist(err);
                            done();
                        });
                    });
                });
            });
        });
    });
})();