/**
 * Created by Victor on 17/08/2015.
 */

(function() {
    var bunyan = require('bunyan');
    var log = bunyan.createLogger({
        name: 'hcm.registration',
        streams: [{
            level: 'trace',
            type: 'rotating-file',
            path: './log/hcm.log',
            period: '1d',   // daily rotation
            count: 3        // keep 3 back copies
        }]
    });

    function getIncidentTicketNumber(componentCode) {
        var dateTime = new Date();
        return componentCode + dateTime.getDate() + dateTime.getMonth() + dateTime.getHours() + dateTime.getMinutes();
    }

    function getUserErrorMessage(incidentTicket) {
        return "Something went wrong! We apologize about this." +
            " Use please the incident ticket " + incidentTicket + " and contact please our support.";
    }

    function getLogger() {
        return log;
    }

    function processUnhandledError(req, error, callback) {
        var incidentTicket = logging.getIncidentTicketNumber("or");
        getLogger().error({
            incident: incidentTicket,
            url: req.url,
            userId: req.decoded.email
        }, error);
        var unhandledError = new Error(logging.getUserErrorMessage(incidentTicket));
        unhandledError.unhandled = true;
        callback(unhandledError, null);
    }

    module.exports = {
        getIncidentTicketNumber: getIncidentTicketNumber,
        getUserErrorMessage: getUserErrorMessage,
        getLogger: getLogger,
        processUnhandledError: processUnhandledError
    };
})();