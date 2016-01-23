/**
 * Created by Victor on 1/16/2016.
 */

angular.module("mobileApp")
    .controller("NurseAvailabilityCtrl",
        ['$scope', '$filter', '_', '$modal', 'nurseAvailabilityService', function($scope, $filter, _, $modal, nurseAvailabilityService) {
            $scope.vm = {};

            var hdr = {
                left: 'title',
                //center: 'month,agendaWeek,agendaDay',
                right: 'prev,today,next'
            };

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            $scope.vm.events = [];

            $scope.getCurrentTimeString = function getCurrentTimeString(dateTime) {
                var momentInstance = moment(dateTime);
                return momentInstance.format("YYYY-MM-DD HH:mm:ss");
            }

            $scope.getAvailability = function(startDate, endDate){
                nurseAvailabilityService.getAvailabilityByPeriod($scope.getCurrentTimeString(startDate), $scope.getCurrentTimeString(endDate), function(data){
                    for(var i=0;i<data.length;i++){
                        var intervals = data[i].intervals.split("-");

                        var d = data[i].date.substring(0,2);
                        var m = data[i].date.substring(3,5);
                        var y = data[i].date.substring(6,10);
                        $scope.vm.events.push({
                            availability:data[i],
                            title: data[i].intervals,
                            start: intervals[0]+':00',
                            end: intervals[1]+':00',
                            allDay:true,
                            icon: 'fa fa-calendar',
                            className: ["event", 'bg-color-' + 'greenLight']});
                    }

                    $scope.vm.eventSources = [$scope.vm.events];

                }, function(error){

                });
            };

            $scope.vm.eventSources = [$scope.vm.events];

            var removeEvent = function(session){
                var i = $filter('filter')($scope.vm.events, function (e) {
                    return e.session && e.session.Id == session.Id;
                })[0];
                $scope.vm.events.splice($scope.vm.events.indexOf(i), 1);
            };

            var applyEvent = function (session, date,updateEvent) {
                $scope.vm.events.splice(0, $scope.vm.events.length);

                var currentDay = $('#calendar').fullCalendar('getDate')._d;
                var startDate = moment(currentDay).startOf("day");
                var endDate = moment(currentDay).endOf("day");

                nurseAvailabilityService.getAvailabilityByPeriod(moment(startDate).format("YYYY-MM-DD HH:mm:ss"), moment(endDate).format("YYYY-MM-DD HH:mm:ss"),function(data){
                    for(var i=0;i<data.length;i++){
                        var intervals = data[i].intervals.split("-");

                        var d = data[i].date.substring(0,2);
                        var m = data[i].date.substring(3,5);
                        var y = data[i].date.substring(6,10);
                        $scope.vm.events.push({
                            availability:data[i],
                            title: data[i].intervals,
                            start: intervals[0]+':00',
                            end: intervals[1]+':00',
                            allDay:true,
                            icon: 'fa fa-calendar',
                            className: ["event", 'bg-color-' + 'greenLight']});
                    }
                    $scope.vm.eventSources = [$scope.vm.events];


                }, function(error){

                });
            };

            $scope.changeDay = function() {
                var modal = $modal.open({
                    templateUrl: 'change.day.dialog.html',
                    controller: function($scope, $modalInstance, currentCalendar)
                    {
                        $scope.eventSources = [];
                        $scope.uiConfig = {
                            calendar: {
                                schedulerLicenseKey:'0220103998-fcs-1447110034',
                                editable: false,
                                header: hdr,
                                defaultDate: moment(currentCalendar._d),
                                buttonText: {
                                    prev: '<',
                                    next: '>'
                                },
                                dayClick: function (date, jsEvent, view) {
                                    $scope.apply(date);
                                }
                            }
                        };

                        $scope.cancel = function () {
                            $modalInstance.dismiss();
                        };

                        $scope.apply = function (date) {
                            $modalInstance.close(date);
                        }
                    },
                    resolve: {
                        currentCalendar: function()
                        {
                            return $('#calendar').fullCalendar('getDate');
                        }
                    }
                });

                modal.result.then(function (data) {
                    $('#calendar').fullCalendar('gotoDate', data);
                });
            }

            var saveEvent = function (event, showDialog) {
                if (event.session && event.session.end) {
                    event.session.SessionDateTime = $filter('date')(event.session.end, 'MM/dd/yyyy HH:mm');
                    event.date = new Date(event.session.end);
                }else{
                    event.date = new Date(event.start._d);
                }

                $scope.vm.session = event.session || {};

                if (showDialog) {

                    function GetTodayAvailability(currentEvent) {
                        var date = currentEvent.date;
                        var startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                        var endDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                        var todayEvents = $('#calendar').fullCalendar('clientEvents', function (anEvent) {
                            if (anEvent.start && anEvent.start.toDate() >= startDate
                                && anEvent.start.toDate() <= endDate) {
                                return true
                            }
                        });

                        if(todayEvents.length==0) return null;

                        var availabilityString = '';

                        _.forEach(todayEvents, function (todayEvent) {
                            availabilityString += todayEvent.title + ',';
                        });

                        availabilityString = availabilityString.substring(0,availabilityString.length-1);
                        return availabilityString;
                    }

                    var modal = $modal.open({
                        templateUrl: 'schedule.dialog.html',
                        controller: function ($scope, $modalInstance, event) {
                            $scope.modification = "Add";

                            var todayAvailability = GetTodayAvailability(event);

                            if (todayAvailability) {
                                $scope.currentSchedule = todayAvailability;
                                $scope.oldAvailability = todayAvailability;
                                $scope.modification = "Edit";
                                $scope.scheduleValue = todayAvailability;
                            }

                            function getDotDateString(dateTime) {
                                if (!dateTime) {
                                    console.error("Pizdets");
                                }
                                var day = dateTime.getDate();
                                if (day < 10)day = '0' + day;
                                var month = dateTime.getMonth() + 1;
                                if (month < 10)month = '0' + month;
                                return day + '.' + month + '.' + dateTime.getFullYear();
                            }

                            $scope.session = event.session;
                            $scope.serverError = false;
                            $scope.today = event.date;

                            $scope.cancel = function () {
                                $modalInstance.dismiss();
                            };
                            $scope.delete = function () {
                                $modalInstance.dismiss(true);
                            };


                            $scope.apply = function () {

                                var dateString = getDotDateString(event.date);

                                var re = /((([0-1][0-9])|([2][0-3])):([0-5][0-9]))(\s)*[-](\s)*((([0-1][0-9])|([2][0-3])):([0-5][0-9]))/g;

                                var match = re.exec($scope.scheduleValue);
                                var availabilityString = '';
                                while(match){
                                    availabilityString+=match[0]+',';
                                    match = re.exec($scope.scheduleValue);
                                }

                                availabilityString = availabilityString.substring(0,availabilityString.length-1);

                                if ($scope.modification == "Add") {
                                    nurseAvailabilityService.addAvailability({
                                            availabilityString: availabilityString,
                                            dateString: dateString
                                        },

                                        function (success) {
                                            $modalInstance.close(availabilityString);
                                        }, function (error) {
                                            $scope.serverError = true;
                                        }
                                    );
                                } else {
                                    nurseAvailabilityService.editAvailability({
                                            availabilityString: availabilityString,
                                            dateString: dateString,
                                            oldAvailabilityString: $scope.oldAvailability
                                        },

                                        function (success) {
                                            $modalInstance.close(availabilityString);
                                        }, function (error) {
                                            $scope.serverError = true;
                                        }
                                    );
                                }
                            };
                        },
                        resolve: {
                            event: function () {
                                return event;
                            }
                        }
                    });

                    modal.result.then(function (data) {
                        $scope.vm.session.Description = data;
                        event.title = data;
                        applyEvent();
                    }, function (arg) {
                        if (arg === true) {
                            removeEvent(event.session);
                        }

                    });

                } else {

                }
            };

            $scope.vm.uiConfig = {
                calendar: {
                    schedulerLicenseKey:'0220103998-fcs-1447110034',
                    defaultView:'nursesGrid',
                    defaultTimedEventDuration:'00:15:00',
                    allDaySlot:false,
                    views: {
                        nursesGrid: {
                            type: 'agenda',
                            duration: { days: 1 },
                            slotDuration:'00:15',
                            slotLabelInterval:'00:15'
                        }
                    },
                    editable: false,
                    header: hdr,
                    eventDragStop: function (calEvent, jsEvent, view) {
                        saveEvent(calEvent, false);

                    },
                    eventResizeStop: function (calEvent, jsEvent, view) {
                        // saveEvent(calEvent, false);

                    },
                    eventClick: function (calEvent, jsEvent, view) {
                        saveEvent(calEvent, true);
                    },
                    eventRender: function (event, element, icon) {
                        if (!event.description == "") {
                            element.find('.fc-event-title').append("<br/><span class='ultra-light'>" + event.description +
                                "</span>");
                        }
                        //if (!event.icon == "") {
                        //    element.find('.fc-event-title').append("<i class='air air-top-right fa " + event.icon +
                        //    " '></i>");
                        //}
                    },
                    events: function(start, end, timezone, callback){
                        var currentDay = $('#calendar').fullCalendar('getDate')._d;
                        var startDate = moment(currentDay).startOf("day");
                        var endDate = moment(currentDay).endOf("day");

                        $scope.getAvailability(startDate, endDate);
                    },
                    buttonText: {
                        prev: '<',
                        next: '>'
                    },
                    dayClick: function (date, jsEvent, view) {
                        var d = date._d;
                        if (d.getUTCHours() == 0 && d.getUTCMinutes() == 0) {
                            d.setUTCHours(new Date().getUTCHours());
                            d.setUTCMinutes(new Date().getUTCMinutes() + 1);
                        }
                        {
                            var today = new Date();
                            saveEvent({session: {end: new Date(d), SessionDateTime: new Date(d)}}, date>today);
                        }
                    }
                }
            };
}]);