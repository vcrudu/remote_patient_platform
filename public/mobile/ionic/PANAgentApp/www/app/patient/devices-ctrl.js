/**
 * Created by Victor on 2/15/2016.
 */

angular.module('panAgentApp').controller("PatientDevicesCtrl", ['$scope', '$state', '$ionicPopup', 'commonService', 'devicesService', 'shoppingCartService',
    function ($scope, $state, $ionicPopup, commonService, devicesService, shoppingCartService) {
  $scope.devices = [];
  $scope.searchDevices = function () {
    devicesService.getDevices(function (result) {
      if (result && result.items) {
        $scope.devices = result.items;
      }
      $scope.loaded = true;
    }, function (error) {
    });
  };

  $scope.showDetails = function(device){
    $scope.$parent.goToState('patient.devices.details', {model:device.model});
  };

  $scope.searchDevices();

  $scope.addToCart = function(device)
  {
    shoppingCartService.addToCart(device, 1);
    $scope.showProductAdded();
  };

  $scope.showProductAdded = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Product Added to Cart',
    });

    alertPopup.then(function(res) {
      //console.log('Thank you for not eating my delicious ice cream cone');
    });
  };
}]);
