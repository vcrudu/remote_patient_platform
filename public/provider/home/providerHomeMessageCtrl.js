/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('providerHomeMessageCtrl', ['$scope', '$log', '$state', '$rootScope',
    'toastr', 'authService', '$localStorage', 'notificationsService', 'Messaging','$modal','$rootScope',
    function ($scope, $log, $state, $rootScope, toastr, authService, $localStorage, notificationsService, Messaging) {
        var vm = this;
        vm.message = $rootScope.message;
        vm.message.greetings = vm.message.content.match(/^.+\n/)[0];
        vm.message.content = vm.message.content.replace(vm.message.greetings,'');
    }
]);
