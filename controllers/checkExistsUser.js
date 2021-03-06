/**
 * Created by home on 23.07.2015.
 */

(function(){

    var usersRepository     = require('../repositories').Users;

    module.exports.init = function(app) {
        app.get('/checkExistsUser', function (req, res) {
            if(!req.query.email){
                res.json({
                    success: false
                });
            }
            usersRepository.findOneByEmail(req.query.email, function (err, user) {
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
