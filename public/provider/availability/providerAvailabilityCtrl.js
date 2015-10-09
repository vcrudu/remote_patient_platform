(function () {
    angular.module('app').controller('providerAvailabilityCtrl', [
        '$scope', '$state', '$modal', '$filter',
        function ($scope, $state, $modal, $filter) {


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


                            $scope.session = event.session;

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
                                $modalInstance.close($scope.scheduleValue);
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
                            saveEvent({session: {end: new Date(d), SessionDateTime: new Date(d)}}, true);
                        }
                    }
                }
            };
        }]);
})();