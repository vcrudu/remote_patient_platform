/**
 * Created by Victor on 27/05/2015.
 */

angular.module('app').controller('registerAddressCtrl',['$scope','$log','$state', function($scope, $log, $state){
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.formAddress.country.$setDirty();
        $scope.formAddress.county.$setDirty();
        $scope.formAddress.town.$setDirty();
        $scope.formAddress.address1.$setDirty();
        $scope.formAddress.postCode.$setDirty();
        if(fromState.data.order<toState.data.order && $scope.formAddress.$invalid){
           event.preventDefault();
        }
    });
}]);
