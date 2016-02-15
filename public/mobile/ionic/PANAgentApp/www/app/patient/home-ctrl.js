/**
 * Created by Victor on 2/15/2016.
 */

angular.module('panAgentApp').controller("PatientHomeCtrl", ['$scope', 'commonService', '$state', function ($scope, commonService, $state) {
  $scope.goToState = function(state, params)
  {
    if (params)
    {
      $state.go(state, params);
    }
    else
    {
      $state.go(state);
    }
  }
}]);
