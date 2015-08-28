/**
 * Created by Victor on 13/08/2015.
 */

var stripe = require("stripe")(
    "sk_test_5E9TfNGdHcjff6iioxBDuOed"
);
stripe.setApiVersion('2015-08-19');

(function(){
    module.exports = {
      pay:function(paymentDetails,callback){

      },
        getCustomers:function(callback) {
            stripe.customers.list(
                { limit: 3 },
                function(err, customers) {
                    var list = customers;
                    callback(customers);
                }
            );
        },
        getCustomer:function(customerId, callback) {
            stripe.customers.retrieve(
                customerId,
                function(err, customer) {
                    callback(customer);
                }
            );
        },
        charge:function(payment, callback) {
            stripe.charges.create({
                amount: payment.amount,
                currency: payment.currency,
                //source: {payment}, // obtained with Stripe.js
                description: "Charge for test@example.com"
            }, function(err, charge) {
                callback(err, charge);
            });
        }

    };
})();