/**
 * Created by home on 23.07.2015.
 */

(function(){

    var usersRepository = require('../repositories').Users;

    module.exports.init = function(app) {
        app.post('/confirm', function (req, res) {
            console.log(req.body.email);
            console.log("test");
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
