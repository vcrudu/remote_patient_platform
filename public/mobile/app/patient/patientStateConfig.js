/**
 * Created by Victor on 2/8/2016.
 */

angular.module('mobileApp').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state("devices", {
        url: "/devices",
        templateUrl: "devices.html"
    }).state("devices.details", {
        url: "/details/:model",
        templateUrl: "deviceDetails.html",
    }).state("vitalsigns", {
            url: "/vitalsigns",
            templateUrl: "vitalSigns.html",
        })
        .state("vitalsigns.charts", {
            url: "/charts",
            templateUrl: "vitalSignsCharts.html",
        });
}]);
