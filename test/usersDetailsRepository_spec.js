/**
 * Created by Victor on 01/08/2015.
 */


var assert = require('assert');
var dynamoDbMapper = require("../repositories/dynamoDbMapper");
var usersDetailsRepository = require("../repositories/usersDetailsRepository");
var entitiesFactory = require("@vcrudu/hcm.domainmodel");

describe.skip("Test mapping from entity to Db", function () {
    var pacient;
    var dateOfBirth = new Date(1941, 06, 01);

    var patientsResult;
    var returnQuery = false;

    before(function(){

    });

    it("Should return results", function(done){
        usersDetailsRepository.getAll(function(err,patients){
            patientsResult=patients;
            console.log(typeof patientsResult);
            assert.notEqual(patientsResult.length, 0, "Result should be array with length > 0");
            done();
        });

    });
});