/**
 * Created by developer1 on 10/6/2016.
 */
/**
 * Created by Victor on 5/6/2016.
 */
(function() {
    angular.module('app').controller('providerGroupScheduleBuilderCtrl', ["$scope", "$http", "$modal", "$stateParams", "appSettings", "$localStorage", "$state", "_", "toastr",
        function ($scope, $http, $modal, $stateParams,  appSettings, $localStorage, $state, _, toastr) {

            $scope.groupName = $stateParams.groupName;
            $scope.idSelectedTime = null;

            $scope.setSelected = function(idSelectedTime) {


                $scope.idSelectedTime = idSelectedTime;

            };
         $scope.dayTimePoints=[];


            $scope.clickOnTr = function(scheduleTime) {



                var index = -1;
                for(var i=0; i<$scope.dayTimePoints.length;i++) {
                    if (scheduleTime.time == $scope.dayTimePoints[i].time) {

                        $scope.mytime = $scope.dayTimePoints[i].time;
                        $scope.myselect = $scope.dayTimePoints[i].reminders ;

                     //   $scope.setSelected(scheduleTime.id);

                        //index = i;
                        break;
                    }
                }

            };


            $scope.deleteScheduleTime = function(scheduleTime) {

                var index = -1;
                for(var i=0; i<$scope.dayTimePoints.length;i++) {
                    if (scheduleTime.time == $scope.dayTimePoints[i].time) {
                        index = i;
                        break;
                    }
                }

                if (index > -1) {
                    //   alert(index);
                    $scope.dayTimePoints.splice(index, 1);
                }  else {
                toastr.success('Error happen!','Error');
            }



            };


            $scope.foundScheduleName = function(){

                if ($scope.data.scheduleList) {

                    $scope.dayTimePoints = [];


                        var req = {
                            method: 'GET',
                            url: appSettings.getServerUrl() + '/v1/api/groupschedule/' + $stateParams.groupName,
                            headers: {
                                'x-access-token': $localStorage.user.token
                            }
                        };

                        $http(req).success(function (res) {
                            if (res.success) {


                                var foundSchedule = _.find(res.items, function (globalSchedule) { return globalSchedule.scheduleName.toLowerCase() === $scope.data.scheduleList.toLowerCase() });

                                //     console.log("FOUNDALARM == "+foundAlarm.alarmName);
                                //      console.log("ALARMDESCRIPTION ===  "+ foundAlarm.alarmDescription);

                                if (foundSchedule) {


                                    //  $scope.dayTimePoints.push({time:  $scope.timeValue, reminders:  $scope.myselect});

                                   // $scope.data.scheduleList = foundSchedule.scheduleName;


                                    _.each(foundSchedule.dayTimePoints, function(timeReminder) {
                                        $scope.dayTimePoints.push({time:  timeReminder.time, reminders:  timeReminder.reminders});

                                    });
                                }
                            } else {
                            }
                        }).error(function (err) {

                        });
                }
                };











         $scope.addTime = function() {

           if ($scope.data.scheduleList) {

               if ($scope.timeValue && $scope.myselect) {

                   var foundTime = false;
                   _.each($scope.dayTimePoints, function(timeReminder) {


                       if (timeReminder.time == $scope.timeValue) {


                           timeReminder.reminders = $scope.myselect;
                           foundTime = true;
                           // $state.go("provider.patients_group_members.schedulebuilder_edit")
                       }
                   });
               if (!foundTime) {
                   $scope.dayTimePoints.push({time: $scope.timeValue, reminders: $scope.myselect});

               }
               } else {

                   toastr.error('Time value or Reminders list not SET!');
               }
           } else {

               toastr.error('Schedule Name not selected!');

           }
            };
           $scope.data = {
               scheduleList : null
           };



                $scope.timeSettings = {
                    theme: 'mobiscroll',
                    display: 'bottom',
                    headerText: false,
                    onSet: function(event) { $scope.timeValue = event.valueText;

                        _.each($scope.dayTimePoints, function(timeReminder) {
                            if (timeReminder.time ==  $scope.timeValue) {
                                $scope.myselect = timeReminder.reminders;
                              //  $state.go("provider.patients_group_members.schedulebuilder_edit")
                            }
                        });

                        },
                    minWidth: 200
                };

           

         

                $scope.remSettings = {
                    theme: 'mobiscroll',
                    display: 'bottom',
                    headerText: false,
                    maxWidth: 190
                };

           
          

            var byGroupName = $stateParams.groupName;
            //   alert("GROUP NAME IS ====    "+$state.params.groupName);

            //     alert("ALARM NAME IS=====    "+$state.params.alarmName);


            $scope.formWasSubmitted = false;

            $scope.submitForm = function (isValid) {
                $scope.formWasSubmitted = true;

                if (!isValid) {return;}

                if ($scope.data.scheduleList) {

                    if ($scope.dayTimePoints.length>0) {




                        //     alert("SCHEDULENAME ESTE    "+$scope.data.scheduleList);

                        if (!isValid) {
                            return;
                        }

                        var scheduleToPost = {
                            scheduleName: $scope.data.scheduleList,
                            scheduleTime: $scope.dayTimePoints

                        };


                        var req = {
                            method: 'POST',
                            url: appSettings.getServerUrl() + '/v1/api/groupschedule',
                            headers: {
                                'x-access-token': $localStorage.user.token
                            },
                            data: {
                                scheduleData: scheduleToPost,
                                groupname: $stateParams.groupName
                            }
                        };

                        $http(req).success(function (res) {
                            if (res.success) {
                                //   $scope.alarmTemplateModel.alarmNameDisabled = true;
                                toastr.success('Schedule Plan saved!', 'Success');
                                $state.go("provider.patients_groups_members.schedules");
                            } else {


                            }
                        }).error(function (err) {

                        });
                    } else {

                        toastr.error('Schedule time list is Empty!');

                    }


                } else {

                    toastr.error('Schedule Name not selected!');

                }
            };


            $scope.init = function () {


                if ($state && $state.params && $state.params.scheduleName)

                      //     alert("AM AJUNS LA PARAMETRUL SCHEDULENAME SI GROUPNAME!!!!!!")
                       //   alert("SCHEDULE NAME DIN  ESTE ===== "+$state.params.scheduleName);
                       //   alert("GROUP NAME ESTE    == "+$stateParams.groupName);
                {
                    var req = {
                        method: 'GET',
                        url: appSettings.getServerUrl() + '/v1/api/groupschedule/' + $stateParams.groupName,
                        headers: {
                            'x-access-token': $localStorage.user.token
                        }
                    };

                    $http(req).success(function (res) {
                        if (res.success) {


                            var foundSchedule = _.find(res.items, function (globalSchedule) { return globalSchedule.scheduleName.toLowerCase() === $state.params.scheduleName.toLowerCase() });

                            //     console.log("FOUNDALARM == "+foundAlarm.alarmName);
                            //      console.log("ALARMDESCRIPTION ===  "+ foundAlarm.alarmDescription);

                            if (foundSchedule) {


                              //  $scope.dayTimePoints.push({time:  $scope.timeValue, reminders:  $scope.myselect});

                                $scope.data.scheduleList = foundSchedule.scheduleName;
                              

                                _.each(foundSchedule.dayTimePoints, function(timeReminder) {
                                    $scope.dayTimePoints.push({time:  timeReminder.time, reminders:  timeReminder.reminders});
                                    
                                });
                            }
                        } else {
                        }
                    }).error(function (err) {

                    });                    }
            };

            $scope.init();
        }
            ]);




  


  

  

   
})();
