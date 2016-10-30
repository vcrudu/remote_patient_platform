/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('providerPatientsGroupsCtrl', ['$scope', '$log', '$state',
    'toastr', 'authService', '$localStorage', 'patientsGroupsService', '$modal','$rootScope', '$http',
    function ($scope, $log, $state, toastr, authService, $localStorage, patientsGroupsService, $modal, $rootScope, $http) {

        $scope.goToGroupDetails = function(group) {
            $state.go("provider.patients_groups_members.members", {groupName: group.groupName});
        };

        $scope.addGroup = function () {

            var modal = $modal.open({
                templateUrl: 'provider/patients_groups/add.group.html',
                controller: function ($scope, $modalInstance) {
                    $scope.submitted = false;
                    $scope.cancel = function () {

                        $modalInstance.dismiss();
                    };

                    $scope.apply = function () {
                        $scope.submitted = true;

                        if ($scope.groupNameForm.$valid) {
                            var post_data = {
                                "groupName": $scope.groupName
                            };

                            var config = {

                                headers: {
                                    'Accept':'application/json',
                                    'Content-Type': 'application/json',
                                    'x-access-token': $localStorage.user.token
                                }
                            };

                            $http.post("/v1/api/add-patients-group", post_data, config).then(function () {
                                $modalInstance.dismiss();
                                toastr.success('Group was added successfully !');

                                setTimeout(function() {
                                    location.reload();
                                }, 500);

                            }, function () {
                                toastr.error('Group was not added !');
                            });
                        }
                    };
                },
                resolve: {
                    event: function () {
                        return event;
                    }
                }
            });
        };

        patientsGroupsService.getPatientsGroups(function(data) {
                if (data) {
                    $scope.patientsGroups = data.items;
                }
            },
            function(err) {});
    }]);
