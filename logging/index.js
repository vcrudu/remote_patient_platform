/**
 * Created by Victor on 17/08/2015.
 */

var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'hcm.registration',
    streams: [{
        level:'trace',
        type: 'rotating-file',
        path: './log/hcm.log',
        period: '1d',   // daily rotation
        count: 3        // keep 3 back copies
    }]
});

(function(){
    module.exports = {
        getIncidentTicketNumber : function(componentCode){
            var dateTime = new Date();
            return componentCode+dateTime.getDate()+dateTime.getMonth()+dateTime.getHours()+dateTime.getMinutes();
        },
        getUserErrorMessage : function(incidentTicket){
            return "Something went wrong! We apologize about this." +
            " Use please the incident ticket "+ incidentTicket + " and contact please our support.";
        },
        getLogger:function(){
            return log;
        }
    };
})();