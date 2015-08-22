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

          callback(null);
      }
    };
})();