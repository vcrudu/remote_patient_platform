/**
 * Created by Victor on 31/08/2015.
 */

/**
 * Created by Victor on 06/08/2015.
 */

var videoService     = require('../services').VideoService;
var EventFactory = require('../model').EventFactory;
var logging = require("../logging");

(function(){

    module.exports.init = function(router){

        router.post('/call', function(req, res){
            var recipient =  req.body.recipient;

            videoService.createVideoMeeting(req.decoded.email, function(error, meeting){
                res.json(meeting);
            });
        });
    };
})();
