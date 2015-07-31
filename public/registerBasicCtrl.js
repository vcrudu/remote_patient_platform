/**
 * Created by Victor on 27/05/2015.
 */

angular.module('app').controller('registerBasicCtrl',['$scope','$log','$state', function($scope, $log, $state){
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.formBasic.email.$setDirty();
        $scope.formBasic.password.$setDirty();
        $scope.formBasic.passwordConfirm.$setDirty();
        $scope.formBasic.name.$setDirty();
        $scope.formBasic.surname.$setDirty();
        $scope.formBasic.gender.$setDirty();
        $scope.formBasic.dateOfBirth.$setDirty();
        $scope.formBasic.password.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
        $scope.formBasic.passwordConfirm.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
        if(fromState.data.order<toState.data.order && $scope.formBasic.$invalid){
           event.preventDefault();
        }
    });

    $scope.$watch("newUser.password", function() {
        $scope.formBasic.password.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
        $scope.formBasic.passwordConfirm.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
    });

    $scope.$watch("newUser.passwordConfirm", function() {
        $scope.formBasic.password.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
        $scope.formBasic.passwordConfirm.$setValidity("matchPassword", $scope.newUser.password == $scope.newUser.passwordConfirm);
    });

}]);
