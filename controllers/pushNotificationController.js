/**
 * Created by victorcrudu on 15/05/2016.
 */
(function () {

    var util = require('util');
    var logging = require("../logging");
    var snsEndpointsRepository = require('../repositories').SnsEndpoints;
    var snsClient = require('../snsClient');

    module.exports.init = function (router) {
        router.put('/push_subscriptions', function (req, res) {
            if (!req.body.pnToken) {
                res.status(400).json({
                    success: false,
                    message: "Registration token is missing!"
                });
            }

//TODO-here to revise this logic
            snsEndpointsRepository.findFirst(req.body.oldPnToken, req.body.pnToken, function (err, snsEndpoint) {
                if (!err) {
                    if (snsEndpoint) {
                        if (req.body.pnToken != req.body.oldPnToken) {
                            snsClient.getSnsEndpointAttributes(snsEndpoint.endpointArn, function (err, awsSnsEnpoint) {
                                if (!err && awsSnsEnpoint) {
                                    if (!awsSnsEnpoint.Enabled || awsSnsEnpoint.Token != req.body.pnToken) {
                                        snsClient.setSnsEndpointAttributes(snsEndpoint.endpointArn, req.body.pnToken, function (err) {
                                            if (!err) {
                                                snsEndpointsRepository.delete(req.body.oldPnToken, function (err) {
                                                    if (!err) {
                                                        snsEndpointsRepository.save(req.body.pnToken,
                                                            snsEndpoint.endpointArn, req.decoded.email, function (err) {
                                                                if (!err) {
                                                                    res.status(200).end();
                                                                } else {
                                                                    var incidentTicket = logging.getIncidentTicketNumber('pn');
                                                                    logging.getLogger().error({incidentTicket: incidentTicket}, err);
                                                                    res.status(500).json({
                                                                        success: false,
                                                                        message: logging.getUserErrorMessage(incidentTicket)
                                                                    });
                                                                }
                                                            });
                                                    } else {
                                                        var incidentTicket = logging.getIncidentTicketNumber('pn');
                                                        logging.getLogger().error({incidentTicket: incidentTicket}, err);
                                                        res.status(500).json({
                                                            success: false,
                                                            message: logging.getUserErrorMessage(incidentTicket)
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        }

                        if (req.decoded.email != snsEndpoint.userId) {
                            snsEndpointsRepository.updateSnsEndpoint(req.body.pnToken,
                                req.decoded.email, snsEndpoint.endpointArn, function (err) {
                                    if (!err) {
                                        res.status(200).end();
                                    } else {
                                        var incidentTicket = logging.getIncidentTicketNumber('pn');
                                        logging.getLogger().error({incidentTicket: incidentTicket}, err);
                                        res.status(500).json({
                                            success: false,
                                            message: logging.getUserErrorMessage(incidentTicket)
                                        });
                                    }
                                });
                        }

                    } else {
                        snsClient.registerWithSNS(req.body.pnToken, function (err, data) {
                            if (!err && data) {
                                var endpointArn = data;
                                snsEndpointsRepository.save(req.body.pnToken, endpointArn, req.decoded.email, function (err) {
                                    if (!err) {
                                        res.status(200).end();
                                    } else {
                                        var incidentTicket = logging.getIncidentTicketNumber('pn');
                                        logging.getLogger().error({incidentTicket: incidentTicket}, err);
                                        res.status(500).json({
                                            success: false,
                                            message: logging.getUserErrorMessage(incidentTicket)
                                        });
                                    }
                                });
                            } else {
                                var incidentTicket = logging.getIncidentTicketNumber('pn');
                                logging.getLogger().error({incidentTicket: incidentTicket}, err || new Error('Failed to create SNS endpoint'));
                                res.status(500).json({
                                    success: false,
                                    message: logging.getUserErrorMessage(incidentTicket)
                                });
                            }
                        });
                    }
                } else {
                    var incidentTicket = logging.getIncidentTicketNumber('pn');
                    logging.getLogger().error({incidentTicket: incidentTicket}, err);
                    res.status(500).json({
                        success: false,
                        message: logging.getUserErrorMessage(incidentTicket)
                    });
                }
            });
        });
    };
})();