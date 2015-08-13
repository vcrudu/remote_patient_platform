/**
 * Created by home on 10.08.2015.
 */

(function() {

    var Event = require('../model').Event;

    module.exports  = {

        mapEventToDbEntity : function(event){
            return {
               //Todo-here Build DbEntity
            };
        },

        mapEventFromDbEntity : function(dbEntity){
            var event = new Event({
                //Todo-here Build Event
            });
            return event;
        }
    };
})();

