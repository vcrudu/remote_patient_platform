/**
 * Created by home on 25/12/2015.
 */
(function(){

    var usersRepository     = require('../repositories').Users;
    var sendResetLink =require ('../services/emailService').sendPasswordReset;

    module.exports.init = function(app) {
        app.post('/reset', function (req, res) {
            if(!req.body.email){
                res.json({
                    success: false
                });
            }
            usersRepository.findOneByEmail(req.body.email, function (err, user) {
                if (err) {
                    res.json({
                        success: false,
                        data: err
                    });
                } else {
                    if (user) {
                        sendResetLink(user,function(){
                            console.log('send email1 '+user.email);
                        });

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
