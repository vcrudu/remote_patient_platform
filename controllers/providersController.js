/**
 * Created by Victor on 30/08/2015.
 */
/**
 * Created by Victor on 06/08/2015.
 */

var ProviderFactory     = require('../model').ProviderFactory;
var usersRepository     = require('../repositories').Users;
var providerRepository     = require('../repositories').Providers;
var logging = require("../logging");


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
        router.get('/providers', function (req, res) {
            if (req.query.sample) {
                var providerSample = ProviderFactory.getSample();
                res.send({
                    success: true,
                    count: 1,
                    result: providerSample
                });
            } else {
                usersRepository.getAllByType('provider',function (err, data) {
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

        router.get('/provider', function (req, res) {
            if (req.query.sample) {
                var providerSample = ProviderFactory.getSample();
                res.send({
                    success: true,
                    count: 1,
                    result: providerSample
                });
            } else {
                var providerId = req.query.providerId;
                providerRepository.getOne(providerId,function (err, data) {
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
                            result: data
                        });
                    }
                });
            }
        });
    };
})();