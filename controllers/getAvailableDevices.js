/**
 * Created by home on 23.07.2015.
 */

(function(){

    var usersRepository     = require('../repositories').Users;
    var usersDetailsRepository     = require('../repositories').UsersDetails;
    var UserFactory                = require('../model').UserFactory;
    var bcrypt              = require('bcrypt');
    var jwt                 = require("jsonwebtoken");
    var _                   = require("underscore");

    module.exports.init = function(app) {
        app.get('/checkExistsUser', function (req, res) {
            usersRepository.findOneByEmail(req.body.email, function (err, user) {
                if (err) {
                    res.json({
                        success: false,
                        data: err
                    });
                } else {
                    if (user) {
                        res.json({
                            success: true
                        });
                    } else {
                        res.json({
                            success: false
                        });
                    }
                }
            });

        });
    };
})();
