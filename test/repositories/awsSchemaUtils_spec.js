/**
 * Created by Victor on 16/09/2015.
 */

(function() {
    var should = require('should');
    var awsSchemaUtils = require("../../repositories/awsSchemaUtils");
    var connectionOptions = require('../../repositories/awsOptions');
    var AWS               = require('aws-sdk');

    var getDb = function(){
        var dynamodb = new AWS.DynamoDB(connectionOptions);
        return dynamodb;
    };

    describe("Test awsSchemaUtils", function () {
        describe("Verific crearea tabelei Alarm", function () {

            before(function (done) {
                awsSchemaUtils.checkExistsTable("TestAlarm", function (err, result) {
                    if (result){
                        awsSchemaUtils.deleteTable("TestAlarm", function(err,data){});
                    };
                    done();
                });
            });
            after(function (){

                awsSchemaUtils.deleteTable("TestAlarm", function(err,data){

                    done();
                });
                console.log('functia after cu delete');
            });
            it("Creez tabela Alarme", function (){

                awsSchemaUtils.createAlarmTable("Test", function (err, result) {
                    should.not.exist(err);
                },1,1);

            });
        });

    });

})();

/*it("Check tabela Alarme\n", function (done) {
 awsSchemaUtils.createAlarmTable("test1", function (err, result) {
 should.not.exist(err);

 },1,1);
 });


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
 })();*/