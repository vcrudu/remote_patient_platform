/**
 * Created by Victor on 2/15/2016.
 */

angular.module('panAgentApp').controller("PatientHomeCtrl", ['$scope', 'commonService', '$state', 'shoppingCartService', function ($scope, commonService, $state, shoppingCartService) {
  $scope.goToState = function(state, params)
  {
    if (params)
    {
      $state.go(state, params);
    }
    else
    {
      $state.go(state);
    }
  }

  $scope.isCartVisible = false;
  $scope.changeCartIconVisibility = function(visible) {
    setTimeout(function () {
      $scope.$apply(function () {
        $scope.isCartVisible = visible;
      });
    }, 1);
  };

  $scope.changeCartIconVisibility(true);

  $scope.cartSubtotal = 0;
  $scope.cartSubtotalVisible = false;
  $scope.refreshCartSubtotal = function(callback) {
    setTimeout(function () {
      $scope.$apply(function () {
        $scope.cartSubtotal = shoppingCartService.getTotal();
          callback();
      });
    }, 1);
  };

  $scope.refreshCartSubtotalVisibility = function() {
    $scope.refreshCartSubtotal(function() {
      setTimeout(function () {
        $scope.$apply(function () {
          if ($scope.cartSubtotal > 0)
          {
            $scope.cartSubtotalVisible = true;
          }
          else
          {
            $scope.cartSubtotalVisible = false;
          }
        });
      }, 1);
    });
  };

  $scope.changeCartSubtotalVisibility = function(visible) {
    setTimeout(function () {
      $scope.$apply(function () {
        $scope.cartSubtotalVisible = visible;
      });
    }, 1);
  };

}]);
