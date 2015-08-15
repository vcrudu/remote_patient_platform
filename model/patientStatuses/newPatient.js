/**
 * Created by Victor on 15/08/2015.
 */

(function(){
    module.exports = function(status){
        var statuses = ["New","DevicesOrdered","DevicesDelivered","DevicesAttached","Green","Amber","Red"];
        assert.ok(statuses.indexOf(status)!=-1, "Invalid patient status");

    };
})();