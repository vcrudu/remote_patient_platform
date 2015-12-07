(function () {
    angular.module('app').controller('providerAppointmentsViewCtrl', [
        '$scope', '$state', '$modal', '$filter','toastr','_','appointedPatientsService',
        function ($scope, $state, $modal, $filter,toastr, _, appointedPatientsService) {

            function getSchedulerEvent(id) {
                return $('#calendarBook').fullCalendar('clientEvents', id);
            }

            if (window.socket && !window.socket._callbacks.slotAvailable) {
               /* window.socket.on('slotAvailable', function (slot) {
                    var event = getSchedulerEvent(slot.slotDateTime);
                    if (event.length > 0 && !event[0].isBooked) {
                        event[0].slot.countOfProviders++;
                        event[0].backgroundColor = event[0].slot.countOfProviders > 0 ? 'rgb(153,217,234)' : 'red';
                        //event[0].eventTextColor = event[0].slot.countOfProviders>0? 'rgb(255,255,255)':'rgb(0,0,0)';
                        event[0].title = event[0].slot.countOfProviders + event[0].titleText;
                        $('#calendarBook').fullCalendar('updateEvent', event[0]);
                    }
                });*/
                window.socket.on('slotBookedForProvider', function (slotWithPatient) {
                    var event = getSchedulerEvent(slotWithPatient.slotDateTime);
                    if(event.length>0) {
                        event[0].slot.countOfProviders--;
                        event[0].backgroundColor = 'yellow';
                        // event[0].eventTextColor = event[0].slot.countOfProviders>0? 'rgb(255,255,255)':'rgb(0,0,0)';
                        event[0].title = "Slot booked by: "+slotWithPatient.name;
                        $('#calendarBook').fullCalendar('updateEvent', event[0]);
                    }
                });
                /*window.socket.on('slotBookedSuccessfully', function (slot) {
                    var event = getSchedulerEvent(slot.slotDateTime);
                    if(event.length>0) {
                        event[0].backgroundColor = 'rgb(191,88,179)';
                        event[0].isBooked = true;
                        // event[0].eventTextColor = event[0].slot.countOfProviders>0? 'rgb(255,255,255)':'rgb(0,0,0)';
                        event[0].title = "You have booked the appointment at this time.";
                        $('#calendarBook').fullCalendar('updateEvent', event[0]);
                    }
                });*/
                window.socket.on('slotCanceled', function (slot) {
                    var event = getSchedulerEvent(slot.slotDateTime);
                    if(event.length>0) {
                        event[0].slot.countOfProviders--;
                        event[0].backgroundColor = event[0].slot.countOfProviders > 0 ? 'rgb(153,217,234)' : 'red';
                        // event[0].eventTextColor = event[0].slot.countOfProviders>0? 'rgb(255,255,255)':'rgb(0,0,0)';
                        event[0].title = event[0].slot.countOfProviders + event[0].titleText;
                        $('#calendarBook').fullCalendar('updateEvent', event[0]);
                    }
                });
            }

            var vm = this;

                var hdr = {
                left: 'prev,next today',
                center: 'title',
                right: 'nurseGrid'
            };


            var date = new Date();
            var d = date.getDate();
            var m = date.getMonth();
            var y = date.getFullYear();

            vm.events = [];

            appointedPatientsService.search()
                .then(function (response) {
                    if (!response.data.success) {
                        Messaging.errHandle(response.data);
                    } else {
                        var data = response.data.result;
                        for (var i = 0; i < data.length; i++) {
                            var backgroundColor = 'yellow';
                            var eventTextColor = 'rgb(0,0,0)';  //rgb(255,255,255)
                            var slotDateTime = new Date();
                            slotDateTime.setTime(data[i].slotDateTime);

                            vm.events.push({
                                id: data[i].slotDateTime,
                                title: "Appointment booked by: " + data[i].name,
                                slot: data[i],
                                start: getCurrentTimeString(slotDateTime),
                                icon: 'fa fa-calendar', //className: ["event", 'bg-color-' + 'greenLight']
                                backgroundColor: backgroundColor,
                                borderColor: '#000000',
                                textColor: eventTextColor
                            });
                        }
                    }
                }, function (e) {
                    Messaging.errHandle(e);
                });



            $('#calendarBook').fullCalendar({
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
                eventClick: function(calEvent, jsEvent, view) {
                    var now = new Date();
                    if(calEvent.id<now.getTime() || calEvent.slot.countOfProviders==0) return;
                    var modal = $modal.open({
                        templateUrl: 'patient/appointments/book.dialog.html',
                        controller: function ($scope, $modalInstance, event) {
                            $scope.cancel = function () {
                                $modalInstance.dismiss();
                            };
                            $scope.delete = function () {
                                $modalInstance.dismiss(true);
                            };

                            $scope.apply = function () {
                                var now = new Date();
                                if(calEvent.slot.slotDateTime<=now.getTime()){
                                    toastr.error("It is too late to book for that time!", 'Error');
                                    $modalInstance.dismiss();
                                    return;
                                }
                                slotsService.bookAppointment({
                                        slotDateTime: calEvent.slot.slotDateTime
                                    },
                                    function (success) {
                                        $modalInstance.close($scope.scheduleValue);
                                    }, function (error) {
                                        $modalInstance.close($scope.scheduleValue);
                                        toastr.error(error, 'Error');
                                    }
                                );
                            };
                        },
                        resolve: {
                            event: function () {
                                return event;
                            }
                        }
                    });

                    modal.result.then(function (data) {

                    }, function (arg) {


                    });

                },
                events: function(start, end, timezone, callback){
                    var events=[];
                    appointedPatientsService.search()
                        .then(function (response) {
                            if (!response.data.success) {
                                Messaging.errHandle(response.data);
                            } else {
                                var data = response.data.result;
                                for (var i = 0; i < data.length; i++) {
                                    var backgroundColor = 'yellow';
                                    var eventTextColor = 'rgb(0,0,0)';  //rgb(255,255,255)
                                    var slotDateTime = new Date();
                                    slotDateTime.setTime(data[i].slotDateTime);

                                    if(data[i].slotDateTime>=start && data[i].slotDateTime<=end) {
                                        events.push({
                                            id: data[i].slotDateTime,
                                            title: "Appointment booked by: " + data[i].name,
                                            slot: data[i],
                                            start: getCurrentTimeString(slotDateTime),
                                            icon: 'fa fa-calendar', //className: ["event", 'bg-color-' + 'greenLight']
                                            backgroundColor: backgroundColor,
                                            borderColor: '#000000',
                                            textColor: eventTextColor
                                        });
                                    }
                                }
                                callback(events);

                            }
                        }, function (e) {
                            Messaging.errHandle(e);
                        });

                },
                eventAfterAllRender:function(view){

                },
                resources: [
                    { id: 'a', title: 'Health care providers' }
                ]
            });


            vm.eventSources = [vm.events];

            var removeEvent = function(session){
                var i = $filter('filter')(vm.events, function (e) {
                    return e.session && e.session.Id == session.Id;
                })[0];
                vm.events.splice(vm.events.indexOf(i), 1);
            };

            var applyEvent = function (session, date,updateEvent) {

                var isNew = !session.Id;
                if (isNew) {
                    session.Id = new Date().getUTCMilliseconds();

                    var event =
                    {
                        title: session.Description,
                        start: date,
                        className: ["event", 'bg-color-' + 'greenLight'],
                        icon: 'fa fa-calendar',
                        session: session,
                        allDay: true
                    };

                    vm.events.push(event);

                }
                else{
                    $('#calendar').fullCalendar('updateEvent', updateEvent);
                }
            };
            var saveEvent = function (event, showDialog) {

                if (event.session && event.session.end) {
                    event.session.SessionDateTime = $filter('date')(event.session.end, 'MM/dd/yyyy HH:mm');
                }

                vm.session = event.session || {};

                if (showDialog) {

                    var modal = $modal.open({
                        templateUrl: 'provider/availability/schedule.dialog.html',
                        controller: function ($scope, $modalInstance, event) {

                            function getDotDateString(dateTime) {
                                if(!dateTime){
                                    console.error("Pizdets");
                                }
                                var day = dateTime.getDate();
                                if (day < 10)day = '0' + day;
                                var month = dateTime.getMonth();
                                if (month < 10)month = '0' + month;
                                return day + '.' + month + '.' + dateTime.getFullYear();
                            }

                            $scope.session = event.session;
                            $scope.serverError = false;

                            if ($scope.session) {

                                $scope.scheduleValue = vm.session.Description;
                            }

                            $scope.cancel = function () {
                                $modalInstance.dismiss();
                            };
                            $scope.delete = function () {
                                $modalInstance.dismiss(true);
                            };

                            $scope.apply = function () {
                                var dateString = getDotDateString($scope.session.end);
                                var availabilityString = $scope.scheduleValue;
                                availabilityService.saveAvailability({availabilityString:availabilityString,
                                        dateString:dateString},

                                    function(success){
                                        $modalInstance.close($scope.scheduleValue);
                                    }, function(error){
                                        $scope.serverError = true;
                                    }
                                );
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
                        applyEvent(vm.session, event.session.end,event);
                    }, function (arg) {
                        if (arg === true) {
                            removeEvent(event.session);
                        }

                    });

                } else {

                }
            };

            function getCurrentTimeString(dateTime) {
                var momentInstance = moment(dateTime);
                return momentInstance.format();
            }

            var dateTime = new Date();
            var currentSlot = getCurrentTimeString(dateTime);

            vm.uiConfig = {
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
                    //events: vm.events,
                    resources: [
                        { id: 'a', title: 'Health care providers' }
                    ],
                    eventResizeStop: function (calEvent, jsEvent, view) {
                        // saveEvent(calEvent, false);

                    },
                    eventClick: function (calEvent, jsEvent, view) {
                        //saveEvent(calEvent, true);
                    }/*,
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
                    }*/
                }
            };
        }]);
})();