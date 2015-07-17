/**
 * Created by Victor on 10/05/2015.
 */
angular.module('app').controller('loginCtrl',['$scope', '$state', 'authService', 'toastr','usSpinnerService',
    function($scope, $state, authService, toastr){
    $scope.userCredentials = {};

    $scope.signIn = function(){
        if($scope.loginForm.$valid){
            authService.signin($scope.userCredentials,
                function(success){
                        $state.go('patient.vitalsigns');
                        $scope.$emit('signin');
            },function(error){
                    if (error==="Unauthorized"){
                        toastr.error("Wrong username or password!", 'Error');
                    }else {
                        toastr.error(error, 'Error');
                    }
                }
            );
        }
    };
}]);