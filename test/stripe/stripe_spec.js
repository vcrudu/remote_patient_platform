/**
 * Created by Victor on 22/08/2015.
 */

var paymentService = require('../../services/paymentService');
var Payment = require('../model').Payment;
var should = require('should');

var stripe = require("stripe")(
    "sk_test_5E9TfNGdHcjff6iioxBDuOed"
);

describe('Stripe',function(){

    describe('Manage customers',function(){
            it("Get customers list", function(done){
                paymentService.getCustomer(function(customer){
                    customer.length.should.be.equal(1);
                    done();
                });
            });

        it("Create token customers list", function(done){

            var payment =  new Payment({
                cardNumber: '2334234234',
                cardBrand:"Visa",
                expireMonth: 11,
                expireYear: 2015,
                lastFour:2333,
                fundingType:"debit",
                nameOnCard:'Victor Crudu',
                cardSecurityNumber: '2332'});
            paymentService.createToken(payment, function(token){
                token.should.be.ok();
                done();
            });
        });

    });

});