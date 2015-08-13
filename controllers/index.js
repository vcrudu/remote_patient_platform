/**
 * Created by v.crudu on 02/03/2015.
 */
var subscribeController = require('./subscribeController');
var devicesController = require('./devicesController');

(function(controllers){
    controllers.init = function(app){
        subscribeController.init(app);
        devicesController.init(app);
    };
})(module.exports);