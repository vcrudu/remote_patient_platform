/**
 * Created by home on 31.07.2015.
 */

(function() {

    var domainModel = require('@vcrudu/hcm.domainmodel');


    module.exports  = {

        mapDeviceModelToDbEntity : function(device){
            return {
                model : {S : device.model},
                description : {S : device.description},
                price : {N : device.price.toString()},
                specifications : {SS : device.getDeviceModelSpecifications()},
                manufacturerUrl : {S : device.manufacturerUrl},
                imagesUrls : {SS : device.getImagesUrls()},
                deviceModelType : {S : device.deviceModelType}
            };

        },

        mapDeviceModelFromDbEntity : function(dbEntity){

            var deviceModel = domainModel.createDeviceModel({

                model : dbEntity.model.S,
                description : dbEntity.description.S,
                price : parseFloat(dbEntity.price.N),
                specifications : dbEntity.specifications.SS,
                manufacturerUrl : dbEntity.manufacturerUrl.S,
                imagesUrls : dbEntity.imagesUrls.SS,
                deviceModelType : dbEntity.deviceModelType.S
            });

            return deviceModel;

        }

    };

})();
