/**
 * Created by Victor on 1/10/2016.
 */
angular.module("mobileApp").controller("VitalSignsCtrl", ['$scope', 'commonService', 'vitalSignsService', function($scope, commonService, vitalSignsService) {
    $scope.histories = [];
    $scope.measures = [];

    $scope.currentHistory = null;

    $scope.getHistories = function () {
        vitalSignsService.getHistories(function (histories) {
                $scope.histories = histories;
                angular.forEach($scope.histories, function (history) {
                    history.dashboard = {
                        data: history.dashboard,
                        deviceType: history.deviceType,
                        deviceName: history.deviceName
                    };
                    var lastMeasure = {};
                    lastMeasure.device = $scope.getDeviceTypeLabel(history.deviceType);
                    lastMeasure.deviceType = history.deviceType;
                    lastMeasure.deviceUnit = $scope.getDeviceTypeUniLabel(history.deviceType);
                    lastMeasure.time = history.Measurements.reverse()[0].DateTime;
                    lastMeasure.firstValue = history.Measurements.reverse()[0].FirstValue;
                    lastMeasure.secondValue = history.Measurements.reverse()[0].SecondValue;
                    lastMeasure.valueForUI = lastMeasure.firstValue;
                    if (lastMeasure.secondValue)
                    {
                        lastMeasure.valueForUI += " / " + lastMeasure.secondValue;
                    }

                    $scope.measures.push(lastMeasure);
                });
            },
            function (error) {
                console.error(error);
            })
    };

    $scope.getHistories();

    $scope.goToLatestReadings = function() {
        $scope.currentHistory = null;
    }

    $scope.viewHistory = function(deviceType)
    {
        angular.forEach($scope.histories, function (history) {
            if (history.deviceType === deviceType)
            {
                $scope.currentHistory = history;
                return;
            }
        });
    }

    $scope.getDeviceTypeLabel = function(deviceType)
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
    }

    $scope.getDeviceTypeUniLabel = function(deviceType)
    {
        var label = "";
        switch (deviceType)
        {
            case "bloodPressure":
                label = ""
                break;
            case "heartRate":
                label = "BPM"
                break;
            case "bloodGlucose":
                label = ""
                break;
            case "bloodOxygen":
                label = ""
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
}]);