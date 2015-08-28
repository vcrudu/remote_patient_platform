/**
 * Created by Victor on 07/08/2015.
 */

var uuid = require("node-uuid");
var domainModel = require("@vcrudu/hcm.domainmodel");
var _ = require('underscore');
var assert = require('assert');

(function(){
    var eventTypes = ["HeartRate","BloodPressure","BloodGlucose",
        "BloodOxygen","RespiratoryRate","Temperature",
        "Weight", "FallDetection","BloodInr","ECG","QuestionAnswer"];

    function Event(args){

        //Todo-here to decide if the event could contain more then one measurement

        assert.ok(args.heartRate || args.bloodPressure ||
            args.bloodGlucose || args.bloodOxygen ||
            args.respiratoryRate || args.temperature ||
            args.weight || args.fallDetection ||
            args.bloodInr || args.questionAnswer || args.ecg, "The measurement should be provided!");

        assert(args.measurementDateTime,"Measurement date and time should be provided!");
        var measurementDateTime = new Date(args.measurementDateTime);

        assert(args.userId,"User id should be provided!");
        this.userId = args.userId;
        var measurementType;

        if(args.heartRate){
            assert.ok(!isNaN(args.heartRate) && args.heartRate>0 && args.heartRate<300, "Invalid heart rate!");
            this.heartRate = args.heartRate;
            measurementType="HeartRate";
        }else if(args.bloodPressure){
            assert.ok(args.bloodPressure.systolic, "Systolic value is not specified!");
            assert.ok(args.bloodPressure.diastolic, "Diastolic value is not specified!");

            assert.ok(!isNaN(args.bloodPressure.systolic) && (args.bloodPressure.systolic>0 && args.bloodPressure.systolic<300), "Invalid systolic value!");
            assert.ok(!isNaN(args.bloodPressure.diastolic) && (args.bloodPressure.diastolic>0 && args.bloodPressure.diastolic<300), "Invalid systolic value!");

            this.bloodPressure = {systolic : args.bloodPressure.systolic, diastolic : args.bloodPressure.diastolic};
            measurementType="BloodPressure";
        } else if(args.bloodGlucose){
            assert.ok(!isNaN(args.bloodGlucose), "Invalid blood glucose value!");
            this.bloodGlucose=args.bloodGlucose;
            measurementType="BloodGlucose";
        } else if(args.bloodOxygen){
            assert.ok(!isNaN(args.bloodOxygen) && args.bloodOxygen<=100 && args.bloodOxygen>=50, "Invalid blood oxygen value!");
            measurementType="BloodOxygen";
            this.bloodOxygen=args.bloodOxygen;
        }else if(args.respiratoryRate){
            assert.ok(!isNaN(args.respiratoryRate) && args.respiratoryRate<=300 && args.respiratoryRate>=1, "Invalid respiratory rate value!");
            measurementType="RespiratoryRate";
            this.respiratoryRate=args.respiratoryRate;
        }else if(args.temperature){
            assert.ok(!isNaN(args.temperature) && args.temperature<=50 && args.temperature>=20, "Invalid temperature value!");
            measurementType="Temperature";
            this.temperature=args.temperature;
        } else if(args.weight){
            assert.ok(!isNaN(args.weight) && args.weight<500 && args.weight>=1, "Invalid weight value!");
            measurementType="Weight";
            this.weight=args.weight;
        } else if(args.fallDetection){
            assert.ok(args.fallDetection===true || args.fallDetection===false, "Invalid fall detection value!");
            measurementType="FallDetection";
            this.fallDetection=args.fallDetection;
        } else if(args.bloodInr){
            assert.ok(!isNaN(args.bloodInr) && args.bloodInr>0, "Invalid blood Inr value!");
            measurementType="BloodInr";
            this.bloodInr=args.bloodInr;
        }else if(args.questionAnswer){
            measurementType="QuestionAnswer";
            this.questionAnswer=args.questionAnswer;
            this.questionId = args.questionId;
        } else assert.ok(false, "Invalid measurement type!");


        this.getMeasurementType = function(){
            return measurementType;
        };

        this.getMeasurement = function(){
            if(measurementType=="HeartRate"){
                return {heartRate:this.heartRate,
                    userId:this.userId,
                    measurementType:measurementType,
                    measurementDateTime:measurementDateTime};
            }else if(measurementType=="BloodPressure"){
                return {bloodPressure:this.bloodPressure,
                    userId:this.userId,
                    measurementType:measurementType,
                    measurementDateTime:measurementDateTime};
            } else if( measurementType=="BloodGlucose"){
                return {bloodGlucose:this.bloodGlucose,
                    userId:this.userId,
                    measurementType:measurementType,
                    measurementDateTime:measurementDateTime};
            } else if(measurementType=="BloodOxygen"){
                return {bloodOxygen:this.bloodOxygen,
                    userId:this.userId,
                    measurementType:measurementType,
                    measurementDateTime:measurementDateTime};
            }else if(measurementType=="RespiratoryRate"){
                return {respiratoryRate:this.respiratoryRate,
                    userId:this.userId,
                    measurementType:measurementType,
                    measurementDateTime:measurementDateTime};
            }else if(measurementType=="Temperature"){
                return {temperature:this.temperature,
                    userId:this.userId,
                    measurementType:measurementType,
                    measurementDateTime:measurementDateTime};
            } if(measurementType=="Weight"){
                return {weight:this.weight,
                    userId:this.userId,
                    measurementType:measurementType,
                    measurementDateTime:measurementDateTime};
            } else if(measurementType=="FallDetection"){
                return {fallDetection:this.fallDetection,
                    userId:this.userId,
                    measurementType:measurementType,
                    measurementDateTime:measurementDateTime};
            } else if(measurementType=="BloodInr"){
                return {bloodInr:this.bloodInr,
                    userId:this.userId,
                    measurementType:measurementType,
                    measurementDateTime:measurementDateTime};
            }

        };

        this.getMeasurementDateTime = function(){
            return measurementDateTime;
        };

        this.getSample = function(measurementType){

        };

        this.getEventId = function(){
            return measurementDateTime.getTime().toString()+'#'+measurementType;
        };
    }
    module.exports = {
        buildEvent:function(args){
            return new Event(args);
        },
        getSample:function(measurementType){
            var testUserId = 'test@test.com';
            var nowDateTime = new Date();
            if(measurementType=="HeartRate"){
                return {heartRate:80,
                    measurementType:measurementType,
                    measurementDateTime:nowDateTime};
            }else if(measurementType=="BloodPressure"){
                return {bloodPressure:{systolic:120,diastolic:80},
                    measurementType:measurementType,
                    measurementDateTime:nowDateTime};
            } else if( measurementType=="BloodGlucose"){
                return {bloodGlucose:130,
                    measurementType:measurementType,
                    measurementDateTime:nowDateTime};
            } else if(measurementType=="BloodOxygen"){
                return {bloodOxygen:98,
                    measurementType:measurementType,
                    measurementDateTime:nowDateTime};
            }else if(measurementType=="RespiratoryRate"){
                return {respiratoryRate:15,
                    measurementType:measurementType,
                    measurementDateTime:nowDateTime};
            }else if(measurementType=="Temperature"){
                return {temperature:36.6,
                    measurementType:measurementType,
                    measurementDateTime:nowDateTime};
            } if(measurementType=="Weight"){
                return {weight:80,
                    measurementType:measurementType,
                    measurementDateTime:nowDateTime};
            } else if(measurementType=="FallDetection"){
                return {fallDetection:true,
                    measurementType:measurementType,
                    measurementDateTime:nowDateTime};
            } else if(measurementType=="BloodInr"){
                return {bloodInr:2.8,
                    measurementType:measurementType,
                    measurementDateTime:nowDateTime};
            }
        },
        getMeasurementTypes:function(){
            return eventTypes;
        }
    };
})();