/**
 * Created by Victor on 1/10/2016.
 */

var Bridge = {};

Bridge.getToken = function(callBack){
    Bridge.resultCallback = callBack;
    var message = {method:"getToken"};
    prompt("bridge_key", JSON.stringify(message));
}

Bridge.getUrl = function(callBack){
    Bridge.resultCallback = callBack;
    var message = {method:"getUrl"};
    prompt("bridge_key", JSON.stringify(message));
}

Bridge.callBack = function(result){
    if(Bridge.resultCallback){
        if(result.token && Bridge.resultCallback){
            Bridge.resultCallback(result.token);
           // delete Bridge.resultCallback;
            return;
        }
        if(result.url && Bridge.resultCallback){
            Bridge.resultCallback(result.url);
         //   delete Bridge.resultCallback;
            return;
        }
    }
}

angular.module('mobileApp')
    .factory('commonService',['$localStorage', function($localStorage) {
        return {
            getToken: function (callback) {
                if ((/android/gi).test(navigator.userAgent)) {
                    Bridge.getToken(callback);
                } else {
                    setTimeout(function () {
                        callback($localStorage.user.token);
                    }, 0);
                }
            },
            getServerUrl: function (callback) {
                if ((/android/gi).test(navigator.userAgent)) {
                    Bridge.getUrl(callback);
                } else {
                    setTimeout(function () {
                        callback("http://192.168.0.12:8081/v1/api/");
                    }, 0);
                }
            },
            getDeviceTypeLabel: function(deviceType)
            {
                var label = "";
                switch (deviceType)
                {
                    case "bloodPressure":
                        label = "Blood Pressure"
                        break;
                    case "heartRate":
                        label = "Heart Rate"
                        break;
                    case "bloodGlucose":
                        label = "Blood Glucose"
                        break;
                    case "bloodOxygen":
                        label = "Blood Oxygen"
                        break;
                    case "respiratoryRate":
                        label = "Respiration Rate"
                        break;
                    case "temperature":
                        label = "Temperature"
                        break;
                    case "weight":
                        label = "Wight"
                        break;
                    case "bloodInr":
                        label = "Blood Inr"
                        break;
                }

                return label;
            },
            getDeviceTypeUniLabel: function(deviceType)
            {
                var label = "";
                switch (deviceType)
                {
                    case "bloodPressure":
                        label = "mm Hg"
                        break;
                    case "heartRate":
                        label = "BPM"
                        break;
                    case "bloodGlucose":
                        label = ""
                        break;
                    case "bloodOxygen":
                        label = "SO2"
                        break;
                    case "respiratoryRate":
                        label = "%"
                        break;
                    case "temperature":
                        label = "C"
                        break;
                    case "weight":
                        label = ""
                        break;
                    case "bloodInr":
                        label = ""
                        break;
                }
                return label;
            }
        };
    }]);
