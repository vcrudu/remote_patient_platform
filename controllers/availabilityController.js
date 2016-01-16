/**
 * Created by Victor on 30/08/2015.
 */
/**
 * Created by Victor on 06/08/2015.
 */

var availabilityService     = require('../services').AvailabilityService;
var logging = require("../logging");
var utils = require('../utils');

(function() {

    function sendError(res, error) {
        var statusCode;
        if (error.unhandled) {
            statusCode = 500;
        } else {
            statusCode = 400;
        }
        res.status(statusCode).json({
            success: false,
            message: error.message
        });
    }

    module.exports.init = function (router) {
        router.get('/availability', function (req, res) {
            if (req.query.sample) {
                var availabilitySample = [{dateString: '10.03.2015', availabilityString: '08:00-12:00,13:00-17:00'}];
                res.send({
                    success: true,
                    count: 1,
                    result: availabilitySample
                });
            } else {
                availabilityService.getAvailability(req.decoded.email, new Date(), function (err, data) {
                    if (err) {
                        var incidentTicket = logging.getIncidentTicketNumber('pr');
                        logging.getLogger().error({incidentTicket: incidentTicket}, err);
                        res.status(500).json({
                            success: false,
                            message: logging.getUserErrorMessage(incidentTicket)
                        });
                    } else {
                        res.send({
                            success: true,
                            count: data.length,
                            result: data
                        });
                    }
                });
            }
        });

        router.get('/provider_availability_period', function (req, res) {
            if (req.query.sample) {
                var availabilitySample = [{dateString: '10.03.2015', availabilityString: '08:00-12:00,13:00-17:00'}];
                res.send({
                    success: true,
                    count: 1,
                    result: availabilitySample
                });
            } else {
                console.log('Start Date:' + req.query.startDate);
                console.log('End Date:' + req.query.endDate);
                var startDate = new Date(req.query.startDate);
                var endDate = new Date(req.query.endDate);
                availabilityService.getAvailabilityByPeriod(req.decoded.email, startDate, endDate, function (err, data) {
                    if (err) {
                        var incidentTicket = logging.getIncidentTicketNumber('pr');
                        logging.getLogger().error({incidentTicket: incidentTicket}, err);
                        res.status(500).json({
                            success: false,
                            message: logging.getUserErrorMessage(incidentTicket)
                        });
                    } else {
                        res.send({
                            success: true,
                            count: data.length,
                            result: data
                        });
                    }
                });
            }
        });

        router.get('/provider_availability', function (req, res) {
            if (req.query.sample) {
                var availabilitySample = [{dateString: '10.03.2015', availabilityString: '08:00-12:00,13:00-17:00'}];
                res.send({
                    success: true,
                    count: 1,
                    result: availabilitySample
                });
            } else {
                var today = new Date();
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);
                availabilityService.getAvailability(req.decoded.email, today, function (err, data) {
                    if (err) {
                        var incidentTicket = logging.getIncidentTicketNumber('pr');
                        logging.getLogger().error({incidentTicket: incidentTicket}, err);
                        res.status(500).json({
                            success: false,
                            message: logging.getUserErrorMessage(incidentTicket)
                        });
                    } else {
                        res.send({
                            success: true,
                            count: data.length,
                            result: data
                        });
                    }
                });
            }
        });

        router.post('/availability', function (req, res) {
            if (!req.body.availabilityString) {
                res.status(400).json({
                    success: false,
                    message: "Availability string is missing!"
                });
            }

            if (!req.body.dateString) {
                res.status(400).json({
                    success: false,
                    message: "Availability string is missing!"
                });
            }

            var userId = req.decoded.email;
            var newAvailabilities = utils.dateTimeUtils.getAvailabilitiesFromString(req.body.dateString, req.body.availabilityString);
            availabilityService.generateNewSlots(userId, newAvailabilities, null, function (err, data) {
                res.send({
                    success: true,
                    result: data
                });
            });
        });

        router.put('/availability', function (req, res) {
            if (!req.body.availabilityString) {
                res.status(400).json({
                    success: false,
                    message: "Availability string is missing!"
                });
            }

            if (!req.body.dateString) {
                res.status(400).json({
                    success: false,
                    message: "Availability string is missing!"
                });
            }

            if (!req.body.oldAvailabilityString) {
                res.status(400).json({
                    success: false,
                    message: "Modified availability string is missing!"
                });
            }

            var userId = req.decoded.email;
            var newAvailabilities = utils.dateTimeUtils.getAvailabilitiesFromString(req.body.dateString,
                req.body.availabilityString);
            var oldAvailabilities = utils.dateTimeUtils.getAvailabilitiesFromString(req.body.dateString,
                req.body.oldAvailabilityString);

            availabilityService.generateNewSlots(userId, newAvailabilities, oldAvailabilities,
                function (err, data) {
                    res.send({
                        success: true,
                        result: data
                    });
                });
        });
    };
})();