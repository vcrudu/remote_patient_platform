/**
 * Created by Victor on 06/07/2015.
 */

var model = require("@vcrudu/hcm.domainmodel");
var usersDetailsRepo = require("../repositories").UsersDetails;

    module.exports = {
    definePatientUserDetails:function(args){
        var patient = model.createPatient(args);
        usersDetailsRepo.save(patient);
    }
};