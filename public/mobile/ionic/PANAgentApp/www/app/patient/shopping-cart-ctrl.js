/**
 * Created by Victor on 2/15/2016.
 */

angular.module('panAgentApp').controller("PatientShoppingCartCtrl", ['$scope', '$state', '$ionicPopup', 'commonService', 'shoppingCartService',
  function ($scope, $state, $ionicPopup, commonService, shoppingCartService) {
    $scope.cart = shoppingCartService.getCart();
    $scope.subtotal = 0.00;

    if ($scope.cart) {
      $scope.subtotal = shoppingCartService.getTotal();
    }

    $scope.deleteProduct = function(device) {
      shoppingCartService.removeItem(device);
      $scope.subtotal = shoppingCartService.getTotal();
      $scope.productRemovedFromCard();
    }

    $scope.productRemovedFromCard = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Product Removed from Cart',
      });

      alertPopup.then(function(res) {
        //console.log('Thank you for not eating my delicious ice cream cone');
      });
    };
  }]);
