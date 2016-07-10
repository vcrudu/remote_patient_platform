/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('providerPatientsGroupsCtrl', ['$scope', '$log', '$state',
    'toastr', 'authService', '$localStorage', 'patientsGroupsService', '$modal','$rootScope',
    function ($scope, $log, $state, toastr, authService, $localStorage, patientsGroupsService, $modal, $rootScope) {


     /*   $scope.patientsGroups1 = 'Fifth Group';
        $scope.patientsGroups2 = 'First Group';
        $scope.patientsGroups3 = 'Second Group';*/



      patientsGroupsService.getPatientsGroups(function(data){
            if (data) {

                $scope.patientsGroups = data.items;

                           }


},
      function(err) {});
          //,
      //function(err) {});

        }]);
