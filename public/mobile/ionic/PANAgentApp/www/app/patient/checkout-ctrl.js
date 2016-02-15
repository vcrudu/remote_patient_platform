/**
 * Created by Victor on 2/15/2016.
 */

angular.module('panAgentApp').controller("PatientCheckoutCtrl", ['$scope', '$state', '$ionicPopup',
  function ($scope, $state, $ionicPopup) {
    $scope.listdata = [];
    for (var i=0; i<100;i++){
      $scope.listdata.push(i)
    }

    $scope.listPopup = function()
    {
        $ionicPopup.show({
        template: '<ion-list>'+
                    '  <ion-item ng-repeat="item in listdata"> '+
                    '    {{item}}                              '+
                    '  </ion-item>                             '+
                  '</ion-list>                               ',

        scope: $scope,
        buttons: [
          { text: 'Cancel' },
        ]
      });
    }
  }]);
