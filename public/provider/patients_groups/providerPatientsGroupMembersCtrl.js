

angular.module('app').controller('providerPatientsGroupMembersCtrl', ['$scope', '$log', '$state',
    'toastr', 'authService', '$localStorage', 'patientsGroupMembersService', '$modal','$rootScope','$stateParams',
    function ($scope, $log, $state, toastr, authService, $localStorage, patientsGroupMembersService, $modal, $rootScope, $stateParams) {

        
         patientsGroupMembersService.getPatientsGroupMembers(function(data) {
                if (data) {

                    $scope.patientsGroupsMembers = data.items;
                    //   = $stateParams.groupName;

                }


            },
            function(err) {});



     //   patientsGroupsMembersService.getPatientsGroupsMembers(function(groupName, data){
     //           if (data) {

     //               $scope.patientsGroupsMembers = data.items;

       //         }


       //     },
        //    function(err) {});
        //,
        //function(err) {});
        /**
         * Created by Victor on 23/06/2015.
         */

  /*     angular.module('app').controller('providerPatientsGroupMembersCtrl', ['$scope', '$log', '$state', 'toastr', '$stateParams',
            function ($scope, $log, $state, toastr, $stateParamse) {

                var vm = this;

                if ($stateParams.model) {
                    vm.device = deviceService.get($stateParams.model);
                } else {
                    $window.history.back();
                }


            }
        ]);*/

    }]);
