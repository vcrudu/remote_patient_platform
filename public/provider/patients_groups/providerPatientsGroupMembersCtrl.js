

angular.module('app').controller('providerPatientsGroupMembersCtrl', ['$rootScope', '$scope', '$log', '$http','$state',
    'toastr', 'authService', '$localStorage', 'patientsGroupMembersService', '$modal','$rootScope','$stateParams', 'appSettings',
    function ($rootScope, $scope, $log, $http, $state, toastr, authService, $localStorage, patientsGroupMembersService, $modal, $rootScope, $stateParams, appSettings) {

         $scope.currentGroupName = $stateParams.groupName;




        $scope.tabIndex = 0;

        $scope.$watch(function(){
            return $state.$current.name
        }, function(newVal, oldVal){
            if (newVal === 'provider.patients_groups_members.groupalarmrules' || newVal === 'provider.patients_groups_members.alarmbuilder_edit' || newVal === 'provider.patients_groups_members.alarmbuilder') {
                $scope.tabIndex = 1;
            } else if (newVal === 'provider.patients_groups_members.schedules'
                || newVal === 'provider.patients_groups_members.schedulebuilder_edit'
                || newVal === 'provider.patients_groups_members.schedulebuilder') {
                $scope.tabIndex = 2;
            }
            else {
                $scope.tabIndex = 0;
            }
        });


         patientsGroupMembersService.getPatientsGroupMembers(function(data) {
                if (data) {
                    $scope.patientsGroupsMembers = data.items;
                }
            },
            function(err) {});

       $scope.memberSelected = function(patient) {
                 
                  $state.go("provider.patients_groups_members.vitalsigns", {patient: patient});
       };

        $scope.deleteMember = function(patient) {

            
            
            var req = {
                method: 'DELETE',
                url: appSettings.getServerUrl() + '/v1/api/patientsgroupmember?patientId=' + patient.email+"&groupName="+$stateParams.groupName,
                headers: {
                    'x-access-token': $localStorage.user.token
                }
            };

            $http(req).success(function (res) {
                if (res.success) {
                    toastr.success('Member deleted!','Success');

                    var index = -1;
                    for(var i=0; i<$scope.patientsGroupsMembers.length;i++) {
                        if (patient.scheduleName == $scope.patientsGroupsMembers[i].scheduleName) {
                            index = i;
                            break;
                        }
                    }

                    if (index > -1) {
                        //   alert(index);
                        $scope.patientsGroupsMembers.splice(index, 1);
                    }
                } else {
                    toastr.success('Error happen!','Error');
                }
            }).error(function (err) {
                toastr.success('Error happen!','Error');
            });
            
        };

        $scope.addPatient = function () {
            var modal = $modal.open({
                templateUrl: 'provider/patients_groups/add.nhs.html',
                controller: function ($scope, $modalInstance) {
                    $scope.submitted = false;
                   $scope.cancel = function () {
                       $modalInstance.dismiss();
                    };

                    $scope.apply = function () {
                        $scope.submitted = true;

                        if ($scope.nhsNumberForm.$valid) {

                            var post_data = {
                                "patientId": $localStorage.patientId,
                                "groupName": $stateParams.groupName,
                                "providerId": $localStorage.user.email
                            };

                            var config = {
                                headers: {
                                    'Accept':'application/json',
                                    'Content-Type': 'application/json',
                                    'x-access-token': $localStorage.user.token
                                }
                            };

                            $http.post("/v1/api/patientsgroupmember/invitation",post_data, config).then(function () {
                                $modalInstance.dismiss();
                                toastr.success('Invitation was sent successfully !');
                            }, function () {
                                toastr.error('Invitation was not sent !');
                            });
                        }
                      };
                }
            });
        };

        $scope.addAlarmTemplate = function() {
            $rootScope.$broadcast("addAlarmTemplateClickEvent");
        };

        $scope.addSchedule = function() {
            $rootScope.$broadcast("addScheduleClickEvent");
        };
    }]);
