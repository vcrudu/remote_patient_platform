/**
 * Created by Victor on 2/4/2016.
 */

angular.module("mobileApp")
    .controller("ProviderPatientChartsCtrl",
        ['$scope', '$state', 'providerPatientChartsService', function($scope, $state, providerPatientChartsService) {
            $scope.chartHistories = [];
            $scope.loaded = false;

            $scope.userId = "";

            if ($state && $state.params && $state.params.userId)
            {
                $scope.userId = $state.params.userId;
            }

            $scope.getHistories = function () {
                providerPatientChartsService.getHistories($scope.userId, function (histories) {
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
                        console.log(error);
                    })
            };

            $scope.getHistories();
        }]);
