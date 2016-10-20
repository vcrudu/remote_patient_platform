(function () {
    angular.module('app').controller('providerAvailabilityCtrl', [
        '$scope', '$state', '$modal', '$filter','_','availabilityService',
        function ($scope, $state, $modal, $filter, _, availabilityService) {
            var vm = this;

            var hdr = {
                left: 'title',
                //center: 'month,agendaWeek,agendaDay',
                right: 'prev,today,next'
            };

            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            vm.events = [];

            function getCurrentTimeString(dateTime) {
                var momentInstance = moment(dateTime);
                return momentInstance.format("YYYY-MM-DD HH:mm:ss");
            }

            $scope.getAvailability = function(startDate, endDate){
                availabilityService.getAvailabilityByPeriod(getCurrentTimeString(startDate), getCurrentTimeString(endDate), function(data){
                    console.log(data);
                    for(var i=0;i<data.length;i++){
                        var d = data[i].date.substring(0,2);
                        var m = data[i].date.substring(3,5);
                        var y = data[i].date.substring(6,10);
                        vm.events.push({
                            availability:data[i],
                            title: data[i].intervals,
                            start: y+'-'+m+'-'+d,
                            end: y+'-'+m+'-'+d,
                            allDay:true,
                            icon: 'fa fa-calendar',
                            className: ["event", 'bg-color-' + 'greenLight']});
                    }

                    vm.eventSources = [vm.events];

                }, function(error){

                });
            };

            vm.eventSources = [vm.events];

            var removeEvent = function(session){
                var i = $filter('filter')(vm.events, function (e) {
                    return e.session && e.session.Id == session.Id;
                })[0];
                vm.events.splice(vm.events.indexOf(i), 1);
            };

            var applyEvent = function (session, date,updateEvent) {
                vm.events.splice(0, vm.events.length);
                availabilityService.getAvailability(new Date(),function(data){
                    for(var i=0;i<data.length;i++){
                        var d = data[i].date.substring(0,2);
                        var m = data[i].date.substring(3,5);
                        var y = data[i].date.substring(6,10);
                        vm.events.push({
                            availability:data[i],
                            title: data[i].intervals,
                            start: y+'-'+m+'-'+d,
                            end: y+'-'+m+'-'+d,
                            allDay:true,
                            icon: 'fa fa-calendar',
                            className: ["event", 'bg-color-' + 'greenLight']});
                    }
                    vm.eventSources = [vm.events];


                }, function(error){

                });
            };

            var saveEvent = function (event, showDialog) {

                if (event.session && event.session.end) {
                    event.session.SessionDateTime = $filter('date')(event.session.end, 'MM/dd/yyyy HH:mm');
                    event.date = new Date(event.session.end);
                }else{
                    event.date = new Date(event.start._d);
                }

                vm.session = event.session || {};

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
                        templateUrl: 'provider/availability/schedule.dialog.html',
                        controller: function ($scope, $modalInstance, event) {
                            $scope.submitted = false;
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
                                $scope.submitted = true;
                                if ($scope.scheduleForm.$valid) {
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
                                        availabilityService.addAvailability({
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
                                        availabilityService.editAvailability({
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
                        vm.session.Description = data;
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

            vm.uiConfig = {
                calendar: {
                    schedulerLicenseKey:'0220103998-fcs-1447110034',
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
                        var today = new Date();
                        var currentMonth = today.getMonth();
                        var calendarMonth = $('#calendar').fullCalendar('getDate')._d.getMonth();

                        var startDate = moment(start).startOf("month");
                        if (currentMonth === calendarMonth) { startDate = moment(today).startOf("day"); }

                        var endDate = moment(end).endOf("month");
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
})();