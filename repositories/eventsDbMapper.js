/**
 * Created by home on 10.08.2015.
 */

(function() {

    var EventFactory = require('../model').EventFactory;

    module.exports  = {

        mapEventToDbEntity : function(event){

                var measurement = event.getMeasurement();

                if(event.getMeasurementType()=="HeartRate"){
                    return {
                        heartRate:{N:measurement.heartRate.toString()},
                        userId:{S:measurement.userId},
                        measurementType:{S:measurement.measurementType},
                        measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                    };
                }else if(event.getMeasurementType()=="BloodPressure"){
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
                } else if( event.getMeasurementType()=="BloodGlucose"){
                    return {
                        bloodGlucose:{N:measurement.bloodGlucose.toString()},
                        userId:{S:measurement.userId},
                        measurementType:{S:measurement.measurementType},
                        measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                    };
                } else if(event.getMeasurementType()=="BloodOxygen"){
                    return {
                        bloodOxygen:{N:measurement.bloodOxygen.toString()},
                        userId:{S:measurement.userId},
                        measurementType:{S:measurement.measurementType},
                        measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                    };
                }else if(event.getMeasurementType()=="RespiratoryRate"){
                    return {
                        respiratoryRate:{N:measurement.respiratoryRate.toString()},
                        userId:{S:measurement.userId},
                        measurementType:{S:measurement.measurementType},
                        measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                    };
                }else if(event.getMeasurementType()=="Temperature"){
                    return {
                        temperature:{N:measurement.temperature.toString()},
                        userId:{S:measurement.userId},
                        measurementType:{S:measurement.measurementType},
                        measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                    };
                } if(event.getMeasurementType()=="Weight"){
                return {
                    weight:{N:measurement.weight.toString()},
                    userId:{S:measurement.userId},
                    measurementType:{S:measurement.measurementType},
                    measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                };
            } else if(event.getMeasurementType()=="FallDetection"){
                return {
                    fallDetection:{BOOL:measurement.fallDetection.toString()},
                    userId:{S:measurement.userId},
                    measurementType:{S:measurement.measurementType},
                    measurementDateTime:{N:measurement.measurementDateTime.getTime().toString()}
                };
            } else if(event.getMeasurementType()=="BloodInr"){
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

            if(dbEntity.measurementType.S=="HeartRate"){
                return EventFactory.buildEvent({
                    heartRate:parseInt(dbEntity.heartRate.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            }else if(dbEntity.measurementType.S=="BloodPressure"){
                return EventFactory.buildEvent({
                    bloodPressure:{
                            systolic:parseInt(dbEntity.bloodPressure.M.systolic.N),
                            diastolic:parseInt(dbEntity.bloodPressure.M.diastolic.N)
                    },
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            } else if( dbEntity.measurementType.S=="BloodGlucose"){
                return EventFactory.buildEvent({
                    bloodGlucose:parseFloat(dbEntity.bloodGlucose.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            } else if(dbEntity.measurementType.S=="BloodOxygen"){
                return EventFactory.buildEvent({
                    bloodOxygen:parseInt(dbEntity.bloodOxygen.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            }else if(dbEntity.measurementType.S=="RespiratoryRate"){
                return EventFactory.buildEvent({
                    respiratoryRate:parseInt(dbEntity.respiratoryRate.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            }else if(event.getMeasurementType()=="Temperature"){
                return EventFactory.buildEvent({
                    temperature:parseFloat(dbEntity.temperature.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            } if(dbEntity.measurementType.S=="Weight"){
                return EventFactory.buildEvent({
                    weight:parseFloat(dbEntity.weight.N),
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            } else if(dbEntity.measurementType.S=="FallDetection"){
                return EventFactory.buildEvent({
                    fallDetection:dbEntity.fallDetection.BOOL=='true',
                    userId:dbEntity.userId.S,
                    measurementDateTime:measurementDateTime
                });
            } else if(dbEntity.measurementType.S=="BloodInr"){
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

