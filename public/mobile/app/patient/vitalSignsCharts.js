/**
 * Created by Victor on 2/8/2016.
 */

angular.module("mobileApp").controller("PatientVitalSignsChartsCtrl", ['$scope', 'commonService', 'patientVitalSignsService', function($scope, commonService, patientVitalSignsService) {
    $scope.chartHistories = [];
    $scope.loaded = false;

    $scope.getHistories = function () {
        patientVitalSignsService.getHistories(function (histories) {
                $scope.chartHistories = histories;
                angular.forEach($scope.chartHistories, function (history) {
                    history.dashboard = {
                        data: history.dashboard,
                        deviceType: history.deviceType,
                        deviceName: history.deviceName
                    };
                });
                $scope.loaded = true;
            },
            function (error) {
                console.error(error);
            })
    };

    $scope.getHistories();
}]);