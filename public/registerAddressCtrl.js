/**
 * Created by Victor on 27/05/2015.
 */

angular.module('app').controller('registerAddressCtrl',['$scope','$log','$state', function($scope, $log, $state){
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.formAddress.country.$setDirty();
        $scope.formAddress.county.$setDirty();
        $scope.formAddress.town.$setDirty();
        $scope.formAddress.addressLine1.$setDirty();
        $scope.formAddress.addressLine2.$setDirty();
        $scope.formAddress.postCode.$setDirty();
        $scope.formAddress.phone.$setDirty();
        $scope.formAddress.mobile.$setDirty();
        if(fromState.data.order<toState.data.order && $scope.formAddress.$invalid){
           event.preventDefault();
        }else {
            $scope.formAddress.$commitViewValue();
        }
    });



    $scope.$watch("newUser.mobile", function() {
        if(typeof $scope.newUser.mobile ==="string" && $scope.newUser.mobile.length>0)
        $scope.formAddress.phone.$setValidity("phoneMobileRequired",  true);
        else $scope.formAddress.phone.$setValidity("phoneMobileRequired",  false);
    });


}]);
