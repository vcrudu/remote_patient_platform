/**
 * Created by home on 31.07.2015.
 */

(function() {

    var domainModel = require('@vcrudu/hcm.domainmodel');


    module.exports  = {

        mapDeviceDetailsDbEntityFromDevice : function(device){

            return {
                model : {S : device.model},
                description : {S : device.description},
                price : {N : device.price},
                specifications : {SS : device.specifications},
                manufacturerUrl : {S : device.manufacturerUrl},
                imagesUrls : {L : device.imagesUrls}
            };

        },

        mapDeviceFromDeviceDetailsDbEntity : function(dbEntity){

            var deviceModel = new DeviceModel({

                model : dbEntity.model.S,
                description : dbEntity.description.S,
                price : dbEntity.price.N,
                specifications : dbEntity.specifications.SS,
                manufacturerUrl : dbEntity.manufacturerUrl.S,
                imagesUrls : dbEntity.imagesUrls.L
            });

        }

    };

})();
