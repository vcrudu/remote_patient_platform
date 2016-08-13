

angular.module('app').controller('providerPatientsGroupMembersCtrl', ['$scope', '$log', '$http','$state',
    'toastr', 'authService', '$localStorage', 'patientsGroupMembersService', '$modal','$rootScope','$stateParams', 'appSettings',
    function ($scope, $log, $http, $state, toastr, authService, $localStorage, patientsGroupMembersService, $modal, $rootScope, $stateParams, appSettings) {

        
         patientsGroupMembersService.getPatientsGroupMembers(function(data) {
                if (data) {

                    $scope.patientsGroupsMembers = data.items;


                }


            },
            function(err) {});

        $scope.addPatient = function () {

            var modal = $modal.open({
                templateUrl: 'provider/patients_groups/nhs.dialog.html',
                controller: function ($scope, $modalInstance) {



                   $scope.cancel = function () {
                      
                       $modalInstance.dismiss();
                    };


                    $scope.apply = function () {

                       
                      var post_data = {
                            'patientId': $localStorage.patientId,
                            'groupName': $stateParams.groupName,
                            'providerId': $localStorage.user.email
                        };







                        var reqOptions = {
                            path: "/v1/api/patient-member-group-invitation",
                            method: "POST",
                            body: post_data,
                            headers: {
                                'Accept':'application/json',
                                'Content-Type': 'application/json',
                                'x-access-token': $localStorage.user.token
                            }
                        };

                        $http(reqOptions).then(function () {
                            toastr.success('Invitation was sent successfully !');
                        }, function () {
                            toastr.error('Invitation was not sent !');
                        });



                       };
                },
                resolve: {
                    event: function () {
                        return event;
                    }
                }
            });
          

        };
    }]);
