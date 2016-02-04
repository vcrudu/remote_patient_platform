/**
 * Created by Victor on 2/3/2016.
 */

angular.module('mobileApp').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state("patient", {
        url: "/patient/:userId",
        templateUrl: "patientDetails.html"
    }).state("patient_charts", {
        url: "/patient/charts/:userId",
        templateUrl: "patientCharts.html"
    }).state("appointments", {
        url: "/appointments",
        templateUrl: "appointments.html"
    });
}]);
