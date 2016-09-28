/**
 * Created by home on 23.07.2015.
 */

(function() {

    var usersRepository = require('../repositories').Users;
    var userDetailsRepository = require('../repositories').UsersDetails;
    var providersRepository = require('../repositories').Providers;
    var _ = require('underscore');

    module.exports.init = function (app) {
        app.post('/activate', function (req, res) {
            usersRepository.findOneByEmail(req.decoded.email, function (err, user) {
                var SendActivateResponseToClient = function () {
                    if (user.type == "patient") {
                        user.token = req.headers['x-access-token'];
                        userDetailsRepository.findOneByEmail(user.email, function (err, userDetails) {
                            if (err) {
                                res.json({
                                    success: false,
                                    error: err
                                });
                            }
                            else {
                                if(userDetails.)
                                res.json({
                                    success: true,
                                    data: _.extend(user, userDetails),
                                    token: user.token
                                });
                            }
                        });
                    } else {
                        user.token = req.headers['x-access-token'];
                        providersRepository.getOne(user.email, function (err, providerDetails) {
                            if (err) {
                                res.json({
                                    success: false,
                                    error: err
                                });
                            }
                            else {
                                res.json({
                                    success: true,
                                    data: _.extend(user, providerDetails),
                                    token: user.token
                                });
                            }
                        });
                    }
                };
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    });
                } else {
                    if (user.isActive) {
                        SendActivateResponseToClient();
                    } else {
                        usersRepository.updateActiveStatus(req.decoded.email, true, function (err) {
                            if (err) {
                                res.json({
                                    success: false,
                                    message: err
                                });
                            } else {
                                SendActivateResponseToClient();
                            }
                        });
                    }
                }
            });
        });
    }
})();
