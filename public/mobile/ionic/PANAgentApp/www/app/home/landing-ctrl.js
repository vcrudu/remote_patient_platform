/**
 * Created by Victor on 2/12/2016.
 */

angular.module('panAgentApp').controller("LandingCtrl", ['$scope', 'commonService', '$state', function ($scope, commonService, $state) {
  $scope.contextUser = null;

  commonService.getContextUser(function(user) {
    if (user)
    {
      $scope.contextUser = user;
      $state.go('patient.landing')
    }
  });
}]);
