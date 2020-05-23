
/**
 * Created by Victor on 19/06/2015.
 */
(function(){

    var usersRepository     = require('../repositories').Users;
    var videoService        = require('../services/videoService');
    var usersDetailsRepository     = require('../repositories').UsersDetails;
    var providersRepository     = require('../repositories').Providers;
    var UserFactory                = require('../model').UserFactory;
    var ProviderFactory                = require('../model').ProviderFactory;
    var bcrypt              = require('bcrypt');
    var jwt                 = require("jsonwebtoken");
    var _                   = require("underscore");
    var utils               = require('../utils');
    var loggerProvider      = require('../logging');
    var uuid = require("node-uuid");
    var snsClient = require('../snsClient');
    var emailService =require ('../services/emailService');
    var scheduleManagerService =require ('../services/scheduleManagerService');

    module.exports = function(app) {
        app.post('/signup', function(req, res) {

            var userDetails;

            req.body.dateOfBirth = new Date(req.body.dateOfBirth);

            if (req.body.type === 'patient') {
                try {
                    if (!req.body.agent || req.body.agent !== "mobile") {
                        userDetails = UserFactory.createUserDetailsFromBody(req.body);
                    }
                } catch (buildPatientError) {
                    res.json({
                        success: false,
                        error: buildPatientError.message
                    });
                    return;
                }
            } else if (req.body.type === 'provider') {
                try {
                    if (!req.body.agent || req.body.agent !== "mobile") {
                        //userDetails = ProviderFactory.createProviderFromBody(req.body);
                        userDetails = {
                            email: req.body.email,
                            name: req.body.name,
                            surname: req.body.surname,
                            phone: req.body.phone,
                            providerType: req.body.providerType,
                            id: uuid.v4(),
                            agent: "browser"
                        };
                    } else {
                        //TODO-here: review code
                        userDetails = {
                            email: req.body.email,
                            name: req.body.name,
                            surname: req.body.surname,
                            phone: req.body.phone,
                            providerType: req.body.providerType,
                            id: uuid.v4(),
                            agent: "mobile"
                        };
                    }

                } catch (buildPatientError) {
                    res.json({
                        success: false,
                        error: buildPatientError.message
                    });
                    return;
                }
            } else {
                res.json({
                    success: false,
                    error: new Error('Invalid user type!')
                });
                return;
            }

            usersRepository.findOneByEmail(req.body.email, function (err, user) {
                if (err) {
                    res.json({
                        success: false,
                        error: err
                    });
                } else {
                    if (user) {
                        res.json({
                            success: false,
                            error: "User already exists!"
                        });
                    } else {
                        var bodyUser = UserFactory.createUserFromBody(req.body);
                        bodyUser.isActive = (req.body.agent==="mobile");

                        bodyUser.token = jwt.sign({email: bodyUser.email}, process.env.JWT_SECRET);
                        //Todo-here to implement errors compensation actions
                        usersRepository.save(bodyUser, function (err, savedUser) {
                            if (err) {
                                loggerProvider.getLogger().error(err);
                                res.json({
                                    success: false,
                                    error: err
                                });
                            } else {
                                if (bodyUser.type === 'patient') {
                                    usersDetailsRepository.save(userDetails, function (saveDetailsError, savedDetails) {
                                        if (saveDetailsError) {
                                            usersRepository.delete(bodyUser.email, function (deleteError) {
                                                res.json({
                                                    success: false,
                                                    error: saveDetailsError,
                                                    token: bodyUser.token
                                                });
                                            });
                                        }
                                        else {
                                            if (req.body.agent !== "mobile") {
                                                scheduleManagerService.setupSchedulePlan(userDetails, function (err) {
                                                    if(err){
                                                        loggerProvider.getLogger().error(err);
                                                    }
                                                });
                                                emailService.sendPatientSubscriptionConfirmation(bodyUser.email, function () {
                                                    if(err){
                                                        loggerProvider.getLogger().error(err);
                                                    }
                                                });
                                            }

                                            //scheduleService.schedulePlan(userDetails, )

                                            videoService.createVideoUser(bodyUser.email, bodyUser.name, bodyUser.surname, function (error, zoomData) {
                                                if (error) {
                                                    utils.cleanUpUtils.cleanUser(bodyUser.email);
                                                    res.json({
                                                        success: false,
                                                        error: err
                                                    });
                                                } else {
                                                    usersRepository.findOneByEmail(bodyUser.email, function(err, newUser){
                                                        if(!newUser.userState && newUser.type=='patient'){
                                                            snsClient.sendInitStateMchineEvent(newUser.email);
                                                        }

                                                        if (userDetails) {

                                                            var containsHypertension = false;
                                                            var healthProblems = userDetails.getHealthProblems();
                                                            for(var i=0;i<healthProblems.length;i++) {
                                                                healthProblems[i].date = new Date(healthProblems[i].date);
                                                                if (healthProblems[i].problemType.toString().toLowerCase().indexOf("hypertension") !== -1) {
                                                                    containsHypertension = true;
                                                                    break;
                                                                }
                                                            }

                                                            if (containsHypertension) {
                                                                scheduleManagerService.setupSchedulePlan(userDetails, function () {
                                                                    res.json({
                                                                        success: true,
                                                                        data: _.extend(bodyUser, userDetails),
                                                                        token: bodyUser.token
                                                                    });
                                                                });
                                                            } else {

                                                                res.json({
                                                                    success: true,
                                                                    data: _.extend(bodyUser, userDetails),
                                                                    token: bodyUser.token
                                                                });
                                                            }
                                                        } else {

                                                            res.json({
                                                                success: true,
                                                                data: _.extend(bodyUser, userDetails),
                                                                token: bodyUser.token
                                                            });
                                                        }

                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else if (bodyUser.type === 'provider') {
                                    providersRepository.save(userDetails, function (saveDetailsError, savedDetails) {
                                        if (saveDetailsError) {
                                            usersRepository.delete(bodyUser.email, function (deleteError) {
                                                res.json({
                                                    success: false,
                                                    error: saveDetailsError,
                                                    token: bodyUser.token
                                                });
                                            });
                                        }
                                        else {
                                            if (req.body.agent !== "mobile") {
                                                emailService.sendProviderSubscriptionConfirmation(bodyUser.email, function () {
                                                    console.log('mesaj expediat');
                                                });
                                            }
                                            videoService.createVideoUser(bodyUser.email, bodyUser.name, bodyUser.surname, function (error, zoomData) {
                                                if (error) {
                                                    utils.cleanUpUtils.cleanUser(bodyUser.email);
                                                    res.json({
                                                        success: false,
                                                        error: err
                                                    });
                                                } else {
                                                    res.json({
                                                        success: true,
                                                        data: _.extend(bodyUser, userDetails),
                                                        token: bodyUser.token
                                                    });
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    res.json({
                                        success: false,
                                        error: new Error('Invalid user type!')
                                    });
                                }
                            }
                        });
                    }
                }
            });
        });

        app.post('/signin', function(req, res){
            usersRepository.findOneByEmail(req.body.email,function(err, user){
                if(err){
                    res.json({
                        success:false,
                        error:err
                    });
                }else{
                    if(user && user.isActive && bcrypt.compareSync(req.body.password, user.passwordHash)){
                        user.token= jwt.sign({email:user.email}, process.env.JWT_SECRET);
                        usersRepository.updateToken(user, function(err, result){
                            usersDetailsRepository.findOneByEmail(user.email,function(err,userDetails){
                                res.json({
                                    success:true,
                                    data:_.extend(user,userDetails),
                                    token:user.token
                                });

                                if(!user.userState && user.type=='patient'){
                                    snsClient.sendInitStateMchineEvent(user.email);
                                }
                            });
                        });
                    }else{
                        res.status(401).json({
                            success:false,
                            error:'The user is unauthorised!'
                        });
                    }
                }
            });
        });

        app.delete('/users/:userId', function(req, res){
                res.status(401).json({
                    success:false,
                    error:'The user is unauthorised!'
                });
        });
    };
})(module.exports);