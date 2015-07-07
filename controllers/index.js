/**
 * Created by v.crudu on 02/03/2015.
 */
(function(controllers){
    var subscribeController = require('./subscribeController');
    controllers.init = function(app){
        subscribeController.init(app);
    };
})(module.exports);