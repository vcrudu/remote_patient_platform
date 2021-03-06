(function() {
    angular.module('app').controller("providerGroupScheduleList", ["$scope", "$http", "_", "appSettings", "$stateParams", "$localStorage", "$state", "alarmBuilderFactoryService", "toastr",
        function ($scope, $http, _, appSettings, $stateParams, $localStorage, $state, alarmBuilderFactoryService, toastr) {
            $scope.handleScheduleTypeSelected = function(template) {
                $state.go("provider.patients_groups_members.schedulebuilder_edit", {scheduleName: template.scheduleName, groupName: $stateParams.groupName });
            };
            
            $scope.$on("addScheduleClickEvent", function() {
               $state.go("provider.patients_groups_members.schedulebuilder");
            });


            $scope.groupSchedules = [];

            $scope.deleteSchedule = function(template) {
                var req = {
                    method: 'DELETE',
                    url: appSettings.getServerUrl() + '/v1/api/groupschedule?scheduleName=' + template.scheduleName+"&groupname="+$stateParams.groupName,
                    headers: {
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function (res) {
                    if (res.success) {
                        toastr.success('Schedule deleted!','Success');

                        var index = -1;
                        for(var i=0; i<$scope.groupSchedules.length;i++) {
                            if (template.scheduleName == $scope.groupSchedules[i].scheduleName) {
                                index = i;
                                break;
                            }
                        }

                        if (index > -1) {
                            //   alert(index);
                            $scope.groupSchedules.splice(index, 1);
                        }
                    } else {
                        toastr.success('Error happen!','Error');
                    }
                }).error(function (err) {
                    toastr.success('Error happen!','Error');
                });
            };





            $scope.init = function() {
                    var req = {
                        method: 'GET',
                        url: appSettings.getServerUrl() + '/v1/api/groupschedule/' + $stateParams.groupName,
                        headers: {
                            'x-access-token': $localStorage.user.token
                        }
                    };

                    $http(req).success(function (res) {
                        if (res.success) {
                            _.each(res.items, function(item) {
                                var dayTimePointsList = item.dayTimePoints;
                                var timePoint = item.scheduleName;
                                var timeList = [];
                                _.each(dayTimePointsList, function(timeitem) {
                                     timeList.push(timeitem.time);
                                });
                                $scope.groupSchedules.push({scheduleName: timePoint, dayTimePoints: timeList});

                            });


                        } else {


                        }
                    }).error(function (err) {
                    });
            };

            $scope.init();
        }
    ]);
})();
