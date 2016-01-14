/**
 * Created by home on 25/12/2015.
 */
(function(){

    var usersDetailsRepository     = require('../repositories').UsersDetails;

    module.exports.init = function(app) {
        app.get('/checkExistsNhs', function (req, res) {
            if(!req.query.nhsNumber){
                res.json({
                    success: false
                });
            }
            usersDetailsRepository.getUserDetailsByNhsNumber(req.query.nhsNumber, function (err, user) {
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
