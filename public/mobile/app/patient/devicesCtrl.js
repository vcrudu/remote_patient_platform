/**
 * Created by Victor on 2/8/2016.
 */

angular.module("mobileApp")
    .controller("PatientDevicesCtrl",
        ['$scope', '$state', 'patientDeviceService', function ($scope, $state, patientDeviceService) {
            $scope.loaded = false;
            $scope.devices = [];
            $scope.searchDevices = function () {
                patientDeviceService.getDevices(function (result) {
                    if (result && result.items) {
                        $scope.devices = result.items;
                    }
                    $scope.loaded = true;
                }, function (error) {
                });
            };

            $scope.showDetails = function(device){
                $state.$parent.go('devices.details', {model:device.model});
            };

            $scope.searchDevices();

            $scope.gotoState = function(state)
            {
                $state.go(state);
            }
        }]);