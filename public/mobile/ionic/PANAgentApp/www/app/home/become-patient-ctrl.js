/**
 * Created by Victor on 2/14/2016.
 */

angular.module('panAgentApp').controller("BecomePatientCtrl", ['$scope', 'commonService', 'signupService', function ($scope, commonService, signupService) {
  $scope.patient = {
    email: "",
    password: "",
    confirmPassword: "",
    type: "patient",
    name: "",
    surname: "",
    agent: "mobile"
  };

  $scope.contextUser = null;

  $scope.signUp = function () {
    signupService.patientSignUp($scope.patient, function (result) {
      //sign in user and store user login details
      signupService.signInWithToken(result.token, function (res) {
        commonService.setContextUser(res, function(user) {
          $scope.$parent.contextUser = user;
        });
      }, function (error) {
      })
    }, function (error) {
    });
  };
}]);
