/**
 * Created by home on 25/12/2015.
 */
(function(){

    var usersRepository     = require('../repositories').Users;

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
                        //Todo-here: De implimentat trimiterea emailului
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
