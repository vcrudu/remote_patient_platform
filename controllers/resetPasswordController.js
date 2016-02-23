/**
 * Created by home on 05/01/2016.
 */

(function(){

    var usersRepository     = require('../repositories').Users;
    var jwt = require('jsonwebtoken');


    module.exports.init = function(app) {
        app.get('/resetPassword', function (req, res) {

            var token = req.query.token;
            if (token) {
                jwt.verify(token, 'shhhhh', function (err, decoded) {//to-do insert in config secret
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
                                email: decoded.email
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
            ;
        });
    }
})();

