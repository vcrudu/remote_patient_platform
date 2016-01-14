/**
 * Created by Victor on 1/13/2016.
 */

angular.module("mobileApp").controller("VitalSignsChartsCtrl", ['$scope', 'commonService', 'vitalSignsService', function($scope, commonService, vitalSignsService) {
    $scope.chartHistories = [];

    $scope.getHistories = function () {
        vitalSignsService.getHistories(function (histories) {
                $scope.chartHistories = histories;
                angular.forEach($scope.chartHistories, function (history) {
                    history.dashboard = {
                        data: history.dashboard,
                        deviceType: history.deviceType,
                        deviceName: history.deviceName
                    };
                });
            },
            function (error) {
                console.error(error);
            })
    };

    $scope.getHistories();
}]);