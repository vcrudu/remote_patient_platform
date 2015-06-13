/**
 * Created by Victor on 27/05/2015.
 */

angular.module('app').controller('registerBasicCtrl',['$scope','$log','$state', function($scope, $log, $state){
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.formBasic.email.$setDirty();
        $scope.formBasic.password.$setDirty();
        $scope.formBasic.passwordConfirm.$setDirty();
        $scope.formBasic.firstname.$setDirty();
        $scope.formBasic.surname.$setDirty();
        $scope.formBasic.gender.$setDirty();
        $scope.formBasic.dateOfBirth.$setDirty();
        if(fromState.data.order<toState.data.order && $scope.formBasic.$invalid){
           event.preventDefault();
        }
    });
}]);
