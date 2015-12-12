/**
 * Created by Victor on 14/07/2015.
 */

angular.module('app').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state("provider", {
        url: "/provider",
        views: {
            "headerView": {templateUrl: "provider/provider.header.html"},
            "mainView": {templateUrl: "provider/provider.html"},
            "asideView": {templateUrl: "asideNav.html"}
        }
    }).state("provider.availability", {
        url: "/provider.availability",
        templateUrl: "provider/availability/provider.availability.html",
        controller: 'providerAvailabilityCtrl',
        controllerAs: 'vm'
    }).state("provider.appointments", {
        url: "/provider.appointments",
        templateUrl: "provider/appointments/provider.appointments.view.html",
        controller: 'providerAppointmentsViewCtrl',
        controllerAs: 'vm'
    }).state("provider.patient", {
          url: "/patient/:userName",
          templateUrl: "provider/appointments/provider.appointments.patient.html",
          controller: 'providerAppointmentsPatientViewCtrl',
    }).state("provider.settings", {
        url: "/provider.settings",
        templateUrl: "provider/settings/provider.settings.html",
        controller: 'providerSettingsCtrl'
    }).state("provider.call", {
        url: "/provider.call",
        templateUrl: "provider/appointments/provider.call.html",
        controller: 'providerCallCtrl as vm'
    });
}]);
