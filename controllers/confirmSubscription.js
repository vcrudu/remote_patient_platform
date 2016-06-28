/**
 * Created by home on 23.07.2015.
 */

(function(){

    var usersRepository = require('../repositories').Users;

    module.exports.init = function(app) {
        app.post('/confirm', function (req, res) {
            usersRepository.findOneByEmail(req.body.email, function (err, user) {
                if (err) {
                    res.json({
                        success: false,
                        message: err
                    });
                } else {
                    if (user) {
                       if(user.isActive);
                        res.json({
                            success: false,
                            message:"User is active, please login",
                            email:req.body.email
                        });
                    } else {
                        res.json({
                            success: true,
                            message:"Message was sent successful, please verify emailbox",
                        });
                    }
                }
            });

        });
    };
})();
