/**
 * Created by Victor on 28/08/2015.
 */

var uuid = require("node-uuid");
var domainModel = require("@vcrudu/hcm.domainmodel");
var _ = require('underscore');
var assert = require('assert');

(function(){
    module.exports = function(args){
        var cardBrand = ["Visa","American Express","MasterCard","Discover","JCB","Diners Club","Unknown"];
        var fundingType = ["credit", "debit", "prepaid", "unknown"];
        assert.ok(args.cardNumber,"Card number is mandatory!");
        assert.ok(args.cardBrand,"Card brand is mandatory!");
        assert.ok(args.expireMonth,"Expire month is mandatory!");
        assert.ok(args.expireYear,"Expire year is mandatory!");
        assert.ok(args.cardSecurityNumber,"Card security number is mandatory!");
        assert.ok(args.lastFour,"Last four number is mandatory!");
        assert.ok(args.fundingType,"Funding type is mandatory!");
        assert.ok(args.nameOnCard,"Name on card is mandatory!");
        assert.ok(args.amount, "Amount should be specified!");
        assert.ok(args.currency, "Currency should be specified!");


        this.paymentMethod = args.paymentMethod;
        this.cardNumber = args.cardNumber;
        this.cardBrand = args.cardBrand;
        this.expireMonth = args.expireMonth;
        this.expireYear = args.expireYear;
        this.lastFour = args.lastFour;
        this.fundingType = args.fundingType;
        this.cardSecurityNumber = args.cardSecurityNumber;
        this.nameOnCard = args.nameOnCard;
        this.amount = args.amount;
        this.currency = args.currency;
    };
})();
