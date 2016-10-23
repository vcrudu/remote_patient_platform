/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('patientHomeInboxCtrl', ['$scope', '$log', '$state', '$rootScope',
    'toastr', 'authService', '$localStorage', 'notificationsService', 'Messaging','$modal','$rootScope',
    function ($scope, $log, $state, $rootScope, toastr, authService, $localStorage, notificationsService, Messaging) {

        var vm = this;

        vm.getTimeString = function (dateTime) {
            var momentInstance = moment(dateTime);
            return momentInstance.format("Do MMM HH:mm");
        };

        vm.openMessage = function (notification) {
            $rootScope.message = notification;
            $state.go('patient.home.message');
        };

        notificationsService.getNotifications(function (result) {
            if (!result.success) {
                Messaging.errHandle(response);
            } else {
                vm.notifications = result.items;
            }
        }, function (e) {
            Messaging.errHandle(e);
        });
    }
]);
