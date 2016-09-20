/**
 * Created by Victor on 23/06/2015.
 */

angular.module('app').controller('providerHomeMessageCtrl', ['$scope', '$log', '$state', '$rootScope',
    'toastr', 'authService', '$localStorage', 'notificationsService', 'Messaging','$modal','$rootScope',
    function ($scope, $log, $state, $rootScope, toastr, authService, $localStorage, notificationsService, Messaging) {
        var vm = this;
        vm.message = $rootScope.message;
    }
]);
