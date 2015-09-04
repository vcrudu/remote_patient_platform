/**
 * Created by Victor on 13/08/2015.
 */

var assert = require('assert');

(function(){
    module.exports = function(args){
        var cardBrand = ["Visa","American Express","MasterCard","Discover","JCB","Diners Club","Unknown"];
        var fundingTypes = ["credit", "debit", "prepaid", "unknown"];
        assert.ok(args.cardNumber,"Card number is mandatory!");
        assert.ok(args.expireMonth,"Expire month is mandatory!");
        assert.ok(args.expireYear,"Expire year is mandatory!");
        assert.ok(args.cardSecurityNumber,"Card security number is mandatory!");
        assert.ok(args.nameOnCard,"Name on card is mandatory!");
        this.fundingType='card';

        this.paymentMethod = args.paymentMethod;
        this.cardNumber = args.cardNumber;
        this.cardBrand = args.cardBrand;
        this.expireMonth = args.expireMonth;
        this.expireYear = args.expireYear;
        this.fundingType = args.fundingType;
        this.cardSecurityNumber = args.cardSecurityNumber;
        this.nameOnCard = args.nameOnCard;
    };
})();

