(function () {
    angular.module('app').controller('patientAppointmentsViewCtrl', [
        '$scope', '$state', '$modal', '$filter','availabilityService',
        function ($scope, $state, $modal, $filter, availabilityService) {


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

            availabilityService.getAvailability(new Date(),function(data){
                for(var i=0;i<data.length;i++){
                    var d = data[i].date.substring(0,2);
                    var m = data[i].date.substring(3,5);
                    var y = data[i].date.substring(6,10);
                    vm.events.push({
                        title: data[i].intervals,
                        start: y+'-'+m+'-'+d,
                        allDay:true,
                        icon: 'fa fa-calendar',
                        className: ["event", 'bg-color-' + 'greenLight']});
                }
                vm.eventSources = [vm.events];


            }, function(error){

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

            vm.uiConfig = {
                calendar: {
                    editable: false,
                    header: hdr,
                    defaultView : 'agendaDay',
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