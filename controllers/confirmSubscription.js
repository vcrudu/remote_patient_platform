/**
 * Created by home on 23.07.2015.
 */

(function(){

    var usersRepository = require('../repositories').Users;
    var emailService =require ('../services/emailService');
    var jwt = require('jsonwebtoken');

    module.exports.init = function(app) {
        app.post('/confirm', function (req, res) {
            usersRepository.findOneByEmail(req.body.email, function (err, user) {
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    });
                } else {
                       if(user.type=='patient'){
                           emailService.sendPatientSubscriptionConfirmation(user.email, function () {
                               res.json({
                                   success: true,
                                   message:"Email has been sent successfully.",
                                   email:req.body.email
                               });
                           });

                       } else {
                           emailService.sendProviderSubscriptionConfirmation(user.email, function () {
                               res.json({
                                   success: true,
                                   message:"Email has been sent successfully.",
                                   email:req.body.email
                               });
                           });
                       }
                }
            });
        });
        app.get('/confirm',function(req,res){
            var token=req.query.token;
            if (token){
                jwt.verify(token, secret, function (err, decoded) {
                    if (err) {
                        res.status(403).json({
                            success: false,
                            message: 'not found',
                            error: err
                        });
                    } else {
                        console.log(decoded);
                    }
                    });
            }

        });
    }
})();
