/**
 * Created by Victor on 2/8/2016.
 */

angular.module("mobileApp")
    .controller("PatientDeviceDetailsCtrl",
        ['$scope', '$state', 'patientDeviceService', function ($scope, $state, patientDeviceService) {
            $scope.device = {};
            if ($state && $state.params && $state.params.model)
            {
                $scope.device =  patientDeviceService.getDevice($state.params.model);
            }
        }]);