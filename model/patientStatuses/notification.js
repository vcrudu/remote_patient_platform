/**
 * Created by Victor on 15/08/2015.
 */

var _ = require('underscore');

(function(){
    module.exports = function(notificationType, text, notificationParameters){

        var notificationTypes = ["Guidance","Question","Alert"];
        var parameterTypes = ["Scalar","Link"];

        var notification = {};
        var parameters = [];

        assert.ok(args.text,"Notification text should be specified!");
        assert.ok(args.parameters,"Parameters should be specified!");

        _.forEach(notificationParameters,function(parameter){
            assert.ok(parameter.parameterName,"Parameter name should be specified");
            assert.ok(text.indexOf("{"+parameter.parameterName+"}")!=-1,
                "Notification text does not contain the parameter "+ parameter.parameterName);
            assert.ok(parameter.parameteType,"Parameter type should be specified");

            parameters.push({name:parameter.parameterName,
                parameterType:parameter.parameteType});
        });

        notification.paremeters = parameters;
        notification.text=args.text;

        return notification;
    };
})();