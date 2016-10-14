/**
 * Created by developer1 on 10/6/2016.
 */
/**
 * Created by developer1 on 9/21/2016.
 */
/**
 * Created by Victor on 5/26/2016.
 */

(function() {
    angular.module('app').controller("providerGroupScheduleList", ["$scope", "$http", "_", "appSettings", "$stateParams", "$localStorage", "$state", "alarmBuilderFactoryService", "toastr",
        function ($scope, $http, _, appSettings, $stateParams, $localStorage, $state, alarmBuilderFactoryService, toastr) {



       //     $scope.alarmTemplates = [];
      //      $scope.availableTemplates = [];
            $scope.handleScheduleTypeSelected = function(template) {

               // alert("AM AJUNS LA HANDLE !!!!   "+template.scheduleName);
                $state.go("provider.patients_group_members.schedulebuilder_edit", {scheduleName: template.scheduleName, groupName: $stateParams.groupName });
            };

           
     
     
      //     
            // 
            // $scope.handleAlarmTemplateSelected = function(template) {


       //         $state.go("provider.patients_group_members.alarmbuilder_edit", {alarmName: template.alarmName, groupName: $stateParams.groupName });
       //     };

      /*      $scope.deleteAlarmTemplate = function(template) {


                var req = {
                    method: 'DELETE',
                    url: appSettings.getServerUrl() + '/v1/api//groupalarm?alarmName=' + template.alarmName+"&groupname="+$stateParams.groupName,
                    headers: {
                        'x-access-token': $localStorage.user.token
                    }

                };

                $http(req).success(function (res) {
                    if (res.success) {
                        toastr.success('Group Alarm Template deleted!','Success');

                        var index = -1;
                        for(var i=0; i<$scope.alarmTemplates.length;i++) {
                            if (template.alarmName == $scope.alarmTemplates[i].alarmName) {
                                index = i;
                                break;
                            }
                        }

                        if (index > -1) {
                            //   alert(index);
                            $scope.alarmTemplates.splice(index, 1);
                        }
                    } else {
                        toastr.success('Error happen!','Error');
                    }
                }).error(function (err) {
                    toastr.success('Error happen!','Error');
                });
            }; */
            $scope.groupSchedules = [];
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
                        // console.log("EROARE !!!  ");

                    });
               
            };

            $scope.init();
        }
    ]);
})();
