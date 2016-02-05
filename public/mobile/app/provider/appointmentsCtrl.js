/**
 * Created by Victor on 2/3/2016.
 */

angular.module("mobileApp")
    .controller("ProviderAppointmentsCtrl",
        ['$scope', '$state', 'providerAppointmentsService', function($scope, $state, providerAppointmentsService) {
            $scope.vm = {};

            $scope.vm.events = [];
            $scope.vm.eventSources = [$scope.vm.events];

            $scope.getCurrentTimeString = function getCurrentTimeString(dateTime) {
                var momentInstance = moment(dateTime);
                return momentInstance.format("YYYY-MM-DD HH:mm:ss");
            }

            $scope.getAppointments = function(startDate, endDate){
                    providerAppointmentsService.getAppointments($scope.getCurrentTimeString(startDate), $scope.getCurrentTimeString(endDate), function(result) {
                    var data = result;
                    for (var i = 0; i < data.length; i++) {
                        var backgroundColor = '#03a9f4';
                        var eventTextColor = '#ffffff';
                        var slotDateTime = new Date();
                        slotDateTime.setTime(data[i].slotDateTime);
                        $scope.vm.events.push({
                            id: data[i].slotDateTime,
                            title: "Appointment booked by: " + data[i].name,
                            slot: data[i],
                            start: $scope.getCurrentTimeString(slotDateTime),
                            icon: 'fa fa-calendar', //className: ["event", 'bg-color-' + 'greenLight']
                            backgroundColor: backgroundColor,
                            borderColor: '#000000',
                            textColor: eventTextColor
                        });

                        $scope.vm.eventSources = [$scope.vm.events];
                    }
                },function(error) {

                })
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
                    header: {
                        left: 'title',
                        right: 'prev,today,next'
                    },
                    bottomMarginDelta: 220,
                    eventDragStop: function (calEvent, jsEvent, view) {
                    },
                    eventResizeStop: function (calEvent, jsEvent, view) {
                    },
                    eventClick: function (calEvent, jsEvent, view) {
                        $state.go('patient', {userId:calEvent.slot.patientId});
                    },
                    eventRender: function (event, element, icon) {
                    },
                    events: function(start, end, timezone, callback){
                        var currentDay = $('#calendar').fullCalendar('getDate')._d;
                        var startDate = moment(currentDay).startOf("day");
                        var endDate = moment(currentDay).endOf("day");

                        $scope.getAppointments(startDate, endDate);
                    },
                    buttonText: {
                        prev: '<',
                        next: '>'
                    },
                    dayClick: function (date, jsEvent, view) {
                    }
                }
            };
        }]);