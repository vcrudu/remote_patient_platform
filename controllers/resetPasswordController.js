/**
 * Created by home on 05/01/2016.
 */

(function(){

    var usersRepository     = require('../repositories').Users;
    var jwt = require('jsonwebtoken');
    var secret = 'shhhhh';//to-do insert in config secret
    var bcrypt = require('bcrypt');
    var usersRepository = require("../repositories/usersRepository");


    module.exports.init = function(app) {
        app.get('/resetPassword', function (req, res) {

            var token = req.query.token;
            if (token) {
                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.status(403).json({
                            success: false,
                            message: 'not found',
                            error: err
                        });
                    } else {

                        var expiredAge = Date.now() / 1000 - 900; //To-do insert in config time to expire900-15min
                        if (expiredAge < decoded.iat) {
                            res.json({
                                success: true,
                                message: 'token ok',
                                token: token
                            });
                            console.log('token ok');
                        } else {
                            res.json({
                                success: false,
                                message: 'token expired'
                            });
                            console.log('token expired');
                        }
                    }
                });
            }

        });
        app.post('/resetPassword',function (req, res) {
            var token=req.body.new.token;
            if (token) {
                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.status(403).json({
                            success: false,
                            message: 'not found',
                            error: err
                        });
                    } else {

                        var expiredAge = Date.now() / 1000 - 2700; //To-do insert in config time to expire2700-45min
                        if (expiredAge < decoded.iat) {
                            var email=decoded.email;
                            var passwordHash = bcrypt.hashSync(req.body.new.pass, bcrypt.genSaltSync(10));
                            var userData = {
                                email:email,
                                passwordHash:passwordHash
                            }
                            console.log(passwordHash);
                            console.log(email);
                            console.log('urmeaza update la parola in baza');
                            usersRepository.resetUserPassword(userData, function (err) {
                                if(!err) {
                                    res.json({
                                        success: true,
                                        message: 'password reset succefull'

                                    });
                                } else {
                                    res.json({
                                        success: false,
                                        message: 'password reset fault',

                                    });
                                }
                            });




                        } else {
                            res.json({
                                success: false,
                                message: 'Expired reset'
                            });
                            console.log('token expired');
                        }
                    }
                });
            }
        });
    }
})();

