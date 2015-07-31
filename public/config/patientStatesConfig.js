/**
 * Created by Victor on 14/07/2015.
 */

angular.module('app').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state("patient", {
        url: "/patient",
        views: {
            "headerView": {templateUrl: "patient.header.html"},
            "mainView": {templateUrl: "patient/patient.html"},
            "asideView": {templateUrl: "asideNav.html"}
        },
        controller:'patientVitalSignsCtrl'
    }).state("patient.home", {
        url: "/patient.home",
        templateUrl: "patient/home/patient.home.html",
        controller:'patientHomeCtrl'
    }).state("patient.vitalsigns", {
        url: "/patient.vitalsigns",
        templateUrl: "patient/vitalSigns/patient.vitalsigns.html",
        controller:'patientVitalSignsCtrl'
    }).state("patient.devices", {
        url: "/patient.devices",
        templateUrl: "patient/devices/patient.devices.html",
        controller:'patientDevicesCtrl'
    }).state("patient.devices.buy", {
        url: "/patient.devices.buy",
        templateUrl: "patient/devices/buy.html",
        controller:'patientDevicesBuyCtrl'
    }).state("patient.devices.checkout", {
        url: "/patient.devices.checkout",
        templateUrl: "patient/devices/checkout.html",
        controller:'patientDevicesCheckoutCtrl'
    }).state("patient.messages", {
        url: "/patient.messages",
        templateUrl: "patient/messages/patient.messages.html",
        controller:'patientMessagesCtrl'
    }).state("patient.appointments", {
        url: "/patient.appointments",
        templateUrl: "patient/appointments/patient.appointments.html",
        controller:'patientAppointmentsCtrl'
    }).state("patient.appointments.book", {
        url: "/patient.appointments.book",
        templateUrl: "patient/appointments/book.html",
        controller:'patientAppointmentsBookCtrl'
    }).state("patient.appointments.view", {
        url: "/patient.appointments.view",
        templateUrl: "patient/appointments/view.html",
        controller:'patientAppointmentsViewCtrl'
    }).state("patient.settings", {
        url: "/patient.settings",
        templateUrl: "patient/settings/patient.settings.html",
        controller:'patientSettingsCtrl'
    });
}]);
