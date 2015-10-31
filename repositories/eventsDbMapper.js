/**
 * Created by home on 10.08.2015.
 */

(function() {

    var EventFactory = require('../model').EventFactory;

    module.exports  = {

        mapEventToDbEntity : function(event){

                var measurement = event.getMeasurement();

                if(event.getMeasurementType()=="heartRate"){
                    return {
                        heartRate:{N:measurement.heartRate.toString()},
                        userId:{S:measurement.userId},
                        measurementType:{S:measurement.measurementType},
                        measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                    };
                }else if(event.getMeasurementType()=="bloodPressure"){
                    return {
                        bloodPressure:{
                            M:{
                                systolic:{N:measurement.bloodPressure.systolic.toString()},
                                diastolic:{N:measurement.bloodPressure.diastolic.toString()}
                            }
                        },
                        userId:{S:measurement.userId},
                        measurementType:{S:measurement.measurementType},
                        measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                    };
                } else if( event.getMeasurementType()=="bloodGlucose"){
                    return {
                        bloodGlucose:{N:measurement.bloodGlucose.toString()},
                        userId:{S:measurement.userId},
                        measurementType:{S:measurement.measurementType},
                        measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                    };
                } else if(event.getMeasurementType()=="bloodOxygen"){
                    return {
                        bloodOxygen:{N:measurement.bloodOxygen.toString()},
                        userId:{S:measurement.userId},
                        measurementType:{S:measurement.measurementType},
                        measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                    };
                }else if(event.getMeasurementType()=="respiratoryRate"){
                    return {
                        respiratoryRate:{N:measurement.respiratoryRate.toString()},
                        userId:{S:measurement.userId},
                        measurementType:{S:measurement.measurementType},
                        measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                    };
                }else if(event.getMeasurementType()=="temperature"){
                    return {
                        temperature:{N:measurement.temperature.toString()},
                        userId:{S:measurement.userId},
                        measurementType:{S:measurement.measurementType},
                        measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                    };
                } if(event.getMeasurementType()=="weight"){
                return {
                    weight:{N:measurement.weight.toString()},
                    userId:{S:measurement.userId},
                    measurementType:{S:measurement.measurementType},
                    measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                };
            } else if(event.getMeasurementType()=="fallDetection"){
                return {
                    fallDetection:{BOOL:measurement.fallDetection.toString()},
                    userId:{S:measurement.userId},
                    measurementType:{S:measurement.measurementType},
                    measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                };
            } else if(event.getMeasurementType()=="bloodInr"){
                return {
                    bloodInr:{N:measurement.bloodInr.toString()},
                    userId:{S:measurement.userId},
                    measurementType:{S:measurement.measurementType},
                    measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                };
            }
        },

        mapEventFromDbEntity : function(dbEntity){

            var measurementDateTime = new Date();
            measurementDateTime.setTime(parseInt(dbEntity.measurementDateTime.N));

            if(dbEntity.measurementType.S=="heartRate"){
                return EventFactory.buildEvent({
                    heartRate:parseInt(dbEntity.heartRate.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            }else if(dbEntity.measurementType.S=="bloodPressure"){
                return EventFactory.buildEvent({
                    bloodPressure:{
                            systolic:parseInt(dbEntity.bloodPressure.M.systolic.N),
                            diastolic:parseInt(dbEntity.bloodPressure.M.diastolic.N)
                    },
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            } else if( dbEntity.measurementType.S=="bloodGlucose"){
                return EventFactory.buildEvent({
                    bloodGlucose:parseFloat(dbEntity.bloodGlucose.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            } else if(dbEntity.measurementType.S=="bloodOxygen"){
                return EventFactory.buildEvent({
                    bloodOxygen:parseInt(dbEntity.bloodOxygen.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            }else if(dbEntity.measurementType.S=="respiratoryRate"){
                return EventFactory.buildEvent({
                    respiratoryRate:parseInt(dbEntity.respiratoryRate.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            }else if(dbEntity.measurementType.S=="temperature"){
                return EventFactory.buildEvent({
                    temperature:parseFloat(dbEntity.temperature.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            } if(dbEntity.measurementType.S=="weight"){
                return EventFactory.buildEvent({
                    weight:parseFloat(dbEntity.weight.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            } else if(dbEntity.measurementType.S=="fallDetection"){
                return EventFactory.buildEvent({
                    fallDetection:dbEntity.fallDetection.BOOL=='true',
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            } else if(dbEntity.measurementType.S=="bloodInr"){
                return EventFactory.buildEvent({
                    bloodInr:parseFloat(dbEntity.bloodInr.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            }
            throw new Error('Could not map event entity from db entity. Invalid event db entity!');
        }
    };
})();

