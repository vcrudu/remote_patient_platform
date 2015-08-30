/**
 * Created by Victor on 13/08/2015.
 */

(function(){
    var stripe = require("stripe")(
        "sk_test_5E9TfNGdHcjff6iioxBDuOed"
    );
    stripe.setApiVersion('2015-08-19');

    function handleStripeError(err){
        switch (err.type) {
            case 'StripeCardError':
                // A declined card error
                return {unhandled:false, error:err};
            case 'StripeInvalidRequest':
                // Invalid parameters were supplied to Stripe's API
                return {unhandled:true, error:err};
            case 'StripeAPIError':
                // An error occurred internally with Stripe's API
                return {unhandled:true, error:err};
            case 'StripeConnectionError':
                // Some kind of error occurred during the HTTPS communication
                return {unhandled:true, error:err};
            case 'StripeAuthenticationError':
                // You probably used an incorrect API key
                return {unhandled:true, error:err};
        }
    }

    module.exports = {
        createCustomer: function (customerDetails, callback) {
            assert.ok(customerDetails.payment, "Customer payment should be provided!");
            stripe.customers.create({
                email: customerDetails.email,
                metadata: {
                    userType: customerDetails.type
                },
                plan: customerDetails.plan,
                source: {
                    object: customerDetails.payment.paymentMethod,
                    number: customerDetails.payment.cardNumber,
                    exp_month: customerDetails.payment.expireMonth,
                    exp_year: customerDetails.payment.expireYear,
                    cvc: customerDetails.payment.cardSecurityNumber,
                    name: customerDetails.payment.nameOnCard
                },
                trial_end: customerDetails.trialEnd
            }, function (err, customer) {
                callback(err, customer);
            });
        },

        getCustomers: function (callback) {
            stripe.customers.list(
                {limit: 30},
                function (err, customers) {
                    var list = customers;
                    callback(customers);
                }
            );
        },

        getCustomer: function (customerId, callback) {
            stripe.customers.retrieve(
                customerId,
                function (err, customer) {
                    callback(customer);
                }
            );
        },

        chargeCustomer: function (source, customerId, amount, description, callback) {
            stripe.charges.create({
                amount: amount,
                currency: 'gbp',
                source: source,
                description: description
            }, {
                idempotency_key: order.orderId
            },function (err, charge) {
                callback(err, charge);
            });
        },

        chargeNonCustomer: function (cardDetails, order, callback) {
            var amount = order.getAmountToPay();
            stripe.charges.create({
                amount: amount,
                currency: 'gbp',
                source: {
                    object: cardDetails.fundingType,
                    number: cardDetails.cardNumber,
                    exp_month: cardDetails.expireMonth,
                    exp_year: cardDetails.expireYear,
                    cvc: cardDetails.cardSecurityNumber,
                    name: cardDetails.nameOnCard
                },
                description: order.getDescription(),
                metadata: {orderId: order.orderId},

            }, {
                idempotency_key: order.orderId
            }, function (err, charge) {
                callback(err, charge);
            });
        }
    };
})();