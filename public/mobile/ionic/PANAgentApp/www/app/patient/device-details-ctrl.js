/**
 * Created by Victor on 2/15/2016.
 */

angular.module("mobileApp")
  .controller("PatientDeviceDetailsCtrl",
    ['$scope', '$state', 'patientDeviceService', function ($scope, $state, devicesService) {
      $scope.device = {};
      if ($state && $state.params && $state.params.model)
      {
        $scope.device =  devicesService.getDevice($state.params.model);
      }
    }]);
