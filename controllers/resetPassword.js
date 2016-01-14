/**
 * Created by home on 05/01/2016.
 */

(function(){

    var usersRepository     = require('../repositories').Users;

    module.exports.init = function(app) {
        app.post('/resetPassword', function (req, res) {
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

