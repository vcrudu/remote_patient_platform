/**
 * Created by home on 23.07.2015.
 */

(function(){

    var usersRepository = require('../repositories').Users;
    var sendConfirmLink =require ('../services/emailService').sendPatientSubscriptionConfirmation;
    var jwt = require('jsonwebtoken');
    var secret = 'shhhhh';//to-do insert in config secret

    module.exports.init = function(app) {
        app.post('/confirm', function (req, res) {
            usersRepository.findOneByEmail(req.body.email, function (err, user) {
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    });
                } else {
                       if(user.isActive){
                        res.json({
                            success: false,
                            message:"User is active, please login",
                            email:req.body.email
                        });
                       } else {
                           sendConfirmLink(req.body.email, function () {
                               res.json({
                                   success: true,
                                   message: "Message was sent successful, please verify emailbox",
                               });
                               console.log('send email1 ' + user.email);
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
