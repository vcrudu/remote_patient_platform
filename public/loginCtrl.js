/**
 * Created by Victor on 10/05/2015.
 */
angular.module('app').controller('loginCtrl',['$scope', '$state', 'toastr', 'authService',
    function($scope, $state, toastr, authService){
      $scope.userCredentials = {};

      if ($state && $state.params && $state.params.userName)
      {
        $scope.userCredentials.email = $state.params.userName;
      }
      $scope.signIn = function(){
          if($scope.loginForm.$valid){
              authService.signin($scope.userCredentials,
                  function(success){
                    switch (success.type){
                      case "patient":
                      {
                        $state.go('patient.home.inbox');
                        $scope.$emit('signin');
                        break;
                      }
                      case "provider":
                      {
                        $state.go('provider.availability');
                        $scope.$emit('signin');
                        break;
                      }
                    }

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