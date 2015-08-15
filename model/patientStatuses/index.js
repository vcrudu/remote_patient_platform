/**
 * Created by Victor on 15/08/2015.
 */

var DevicesOrdered = require('devicesOrdered');
var DevicesAttached = require('devicesAttached');
var DevicesDelivered = require('devicesDelivered');
var NewPatient = require('newPatient');
var Red = require('red');
var Amber = require('amber');
var Green = require('green');


(function(){
    module.exports = function(status){
        var statuses = ["New","DevicesOrdered","DevicesDelivered","DevicesAttached","Normal","Green","Amber","Red"];
        assert.ok(statuses.indexOf(status)!=-1, "Invalid patient status");
        if(status=="New"){
            return new NewPatient();
        }else if(status=="DevicesOrdered"){
            return new DevicesOrdered();
        }else if(status=="DevicesDelivered"){
            return new DevicesOrdered();
        }else if(status=="DevicesDelivered"){
            return new DevicesDelivered();
        }else if(status=="Green"){
            return new Green();
        }else if(status=="Amber"){
            return new Amber();
        }else if(status=="Red"){
            return new Red();
        }
    };
})();