/**
 * Created by Victor on 2/15/2016.
 */

angular.module("panAgentApp")
  .controller("PatientDeviceDetailsCtrl",
    ['$scope', '$state', '$ionicPopup', 'devicesService', 'shoppingCartService', function ($scope, $state, $ionicPopup, devicesService, shoppingCartService) {
      $scope.device = {};
      if ($state && $state.params && $state.params.model)
      {
        $scope.device = devicesService.getDevice($state.params.model);
      }

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
