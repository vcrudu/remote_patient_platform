

(function(){
    var smsClient = require('../../smsClient');
        describe("clockwork sms", function() {
            it("send sms", function (done) {
                var slotDateTime = new Date();
                smsClient.sendAppointmentSms("vcrudu@hotmail.com",slotDateTime.getTime(), function(err, data){
                    done();
                });
            });
        });
})();