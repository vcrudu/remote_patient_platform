/**
 * Created by Victor on 12/05/2015.
 */

angular.module('app').controller('registerCtrl',['$scope','$log','$state', function($scope, $log, $state){
        $scope.newUser ={type:"Patient"};
        $scope.states = [];

        $scope.moveNext = function(){
            $state.go($state.$current.data.nextState);
        };

        $scope.moveBack = function(){
            $state.go($state.$current.data.previousState);
        };

        $scope.previousButtonClass = function(){
            return $state.$current.data.previousState?"previous":"previous disabled";
        };

        $scope.nextButtonClass = function(){
            return $state.$current.data.nextState?"next":"next disabled";
        };
}]);