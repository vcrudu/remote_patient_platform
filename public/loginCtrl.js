/**
 * Created by Victor on 10/05/2015.
 */
angular.module('app').controller('loginCtrl',['$scope', '$state', 'toastr', 'authService',
    function($scope, $state, toastr, authService){
        /*setTimeout(function () {
            $scope.$parent.$parent.$apply(function () {
                $scope.$parent.$parent.showHtml = false;
                $scope.$parent.$parent.extr_page = "extr-page";
                $scope.$parent.$parent.containerClass = "container";
            });

        }, 1);*/

      $scope.userCredentials = {
          email: "",
          password: ""
      };
        $scope.submitted = false;

      if ($state && $state.params && $state.params.userName)
      {
        $scope.userCredentials.email = $state.params.userName;
      }
      $scope.signIn = function(){
          $scope.submitted = true;
          if($scope.loginForm.$valid){
              authService.signin($scope.userCredentials,
                  function(success){
                    switch (success.type){
                      case "patient":
                      {
                          setTimeout(function () {
                              $scope.$parent.$parent.$apply(function () {
                                  $scope.$parent.$parent.showHtml = false;
                                  $scope.$parent.$parent.extr_page = "";
                                  $state.go('patient.home.inbox');
                                  $scope.$emit('signin');
                              });
                          }, 1);

                        break;
                      }
                      case "provider":
                      {
                          setTimeout(function () {
                              $scope.$parent.$parent.$apply(function () {
                                  $scope.$parent.$parent.showHtml = false;
                                  $scope.$parent.$parent.extr_page = "";

                                  $state.go('provider.home.inbox');
                                  $scope.$emit('signin');
                              });
                          }, 1);
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

        setTimeout(function () {
            $scope.$parent.$parent.$apply(function () {
                $scope.$parent.$parent.extr_page = "extr-page";
                $scope.$parent.$parent.containerClass = "container";
                $scope.$parent.$parent.showHtml = true;
            });

        }, 100);
}]);