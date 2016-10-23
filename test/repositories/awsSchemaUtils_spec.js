/**
 * Created by Victor on 16/09/2015.
 */

(function() {
    var should = require('should');
    var awsSchemaUtils = require("../../repositories/awsSchemaUtils");
    var connectionOptions = require('../../repositories/awsOptions1');
    var AWS               = require('aws-sdk');
    var uuid = require('node-uuid');
    var exec = require('child_process').exec,
        child;

    child = exec('java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb',
        {shell:'cmd.exe', cwd: __dirname+'../../dblocal'},
        function (error, stdout, stderr) {
            console.log(__dirname+'/');
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });


    var getDb = function(){
    var dynamodb = new AWS.DynamoDB(connectionOptions);
        return dynamodb;
    };
    var tablesPrefix = uuid.v4();

    after(function(done){

       awsSchemaUtils.deleteTable(tablesPrefix+"_Alarm", function (err, data) {});
        awsSchemaUtils.deleteTable(tablesPrefix+"_DeviceModel", function (err, data) {});
        awsSchemaUtils.deleteTable(tablesPrefix+"_AppointmentFeedback", function (err, data) {});
        awsSchemaUtils.deleteTable(tablesPrefix+"_Event", function (err, data) {});
        awsSchemaUtils.deleteTable(tablesPrefix+"_Order", function (err, data) {});
        awsSchemaUtils.deleteTable(tablesPrefix+"_PatientAppointment", function (err, data) {});
        awsSchemaUtils.deleteTable(tablesPrefix+"_Provider", function (err, data) {});
        awsSchemaUtils.deleteTable(tablesPrefix+"_Slot", function (err, data) {});
        awsSchemaUtils.deleteTable(tablesPrefix+"_UserDetails", function (err, data) {});
        awsSchemaUtils.deleteTable(tablesPrefix+"_VitalSign", function (err, data) {
            console.log(err);
        });
        awsSchemaUtils.deleteTable(tablesPrefix+"_User", function (err, data) {
            console.log(err); //eroare
            done();
        });
    });






    it("Creez tabela Alarme\n", function (done){

        awsSchemaUtils.createAlarmTable(tablesPrefix, function (err, result) {
            //console.log(result);
            should.not.exist(err);
            done();
        },1,1);

    });

    it("Creez tabela DeviceModel\n", function (done){

        awsSchemaUtils.createDeviceModelTable(tablesPrefix, function (err, result) {
            console.log(result);
            should.not.exist(err);
            done();
        },1,1);

    });

    it("Creez tabela AppointmentFeedbackTable\n", function (done){

        awsSchemaUtils.createAppointmentFeedbackTable(tablesPrefix, function (err, result) {
            //console.log(result);
            should.not.exist(err);
            done();
        },1,1);

    });

    it("Creez tabela EventTable\n", function (done){

        awsSchemaUtils.createEventTable(tablesPrefix, function (err, result) {
            //console.log(result);
            should.not.exist(err);
            done();
        },1,1);

    });

    it("Creez tabela OrderTable\n", function (done){

        awsSchemaUtils.createOrderTable(tablesPrefix, function (err, result) {
            //console.log(result);
            should.not.exist(err);
            done();
        },1,1);

    });

    it("Creez tabela PatientAppointmentTable\n", function (done){

        awsSchemaUtils.createPatientAppointmentTable(tablesPrefix, function (err, result) {
            //console.log(result);
            should.not.exist(err);
            done();
        },1,1);

    });

    it("Creez tabela ProviderTable\n", function (done){

        awsSchemaUtils.createProviderTable(tablesPrefix, function (err, result) {
            //console.log(result);
            should.not.exist(err);
            done();
        },1,1);

    });

    it("Creez tabela SlotTable\n", function (done){

        awsSchemaUtils.createSlotTable(tablesPrefix, function (err, result) {
            //console.log(result);
            should.not.exist(err);
            done();
        },1,1);

    });

    it("Creez tabela UserTable\n", function (done){

        awsSchemaUtils.createUserTable(tablesPrefix, function (err, result) {
            //console.log(result);
            should.not.exist(err);
            done();
        },1,1);

    });

    it("Creez tabela UserDetailsTable\n", function (done){

        awsSchemaUtils.createUserDetailsTable(tablesPrefix, function (err, result) {
            //console.log(result);
            should.not.exist(err);
            done();
        },1,1);

    });

    it("Creez tabela VitalSignTable\n", function (done){

        awsSchemaUtils.createVitalSignTable(tablesPrefix, function (err, result) {
            //console.log(result);
            should.not.exist(err);
            done();
        },1,1);

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