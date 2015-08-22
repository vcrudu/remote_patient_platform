/**
 * Created by Victor on 19/08/2015.
 */

var uuid = require("node-uuid");
(function(){
    module.exports.init = function(apiRouter){
        apiRouter.get('/id',function(req, res){
            res.json({
               id:uuid.v4()
            });
        });
    };
})();