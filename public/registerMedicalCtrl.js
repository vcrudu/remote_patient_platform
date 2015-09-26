/**
 * Created by Victor on 27/05/2015.
 */

angular.module('app').controller('registerMedicalCtrl',['$scope','$log','$state', function($scope, $log, $state){
    $scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $scope.formMedical.nhsNumber.$setDirty();
        $scope.formMedical.height.$setDirty();
        $scope.formMedical.weight.$setDirty();
        if(toState&&fromState&&fromState.data.order<toState.data.order && $scope.formMedical.$invalid){
           event.preventDefault();
        }else {
            $scope.formMedical.$commitViewValue();
        }
    });
}]);
