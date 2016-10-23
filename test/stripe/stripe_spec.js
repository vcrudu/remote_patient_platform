/**
 * Created by Victor on 22/08/2015.
 */

var paymentService = require('../../services/paymentService');
var should = require('should');

var stripe = require("stripe")(
    "sk_test_5E9TfNGdHcjff6iioxBDuOed"
);

describe.skip('Stripe',function(){

    describe('Manage customers',function(){
            it("Get customers list", function(done){
                paymentService.getCustomer(function(customer){
                    customer.length.should.be.equal(1);
                    done();
                });
            });

        it("Create charge", function(done){
            var order = {getDescription:function(){
                return "Order monitoring devices";
            },getAmountToPay:function(){
                    return 10*100;
            },orderId:"TestOrder1"};

            var payment = {cardNumber:'4242424242424242',
                expireMonth:'11',
                expireYear:'2017',
                cardSecurityNumber:'111',
                nameOnCard:'Victor Crudu'
            };
            paymentService.chargeNonCustomer(payment, order, function(err, charge){
                charge.should.be.ok();
                done();
            });
        });

    });

});