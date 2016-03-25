/**
 * Created by Victor on 2/10/2016.
 */

angular.module('mobileApp').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state("patient-signup", {
        url: "/patient-signup",
        templateUrl: "access/patient-signup.html"
    }).state("patient-signup.landing", {
        url: "/landing",
        templateUrl: "access/landing/patient.html"
    });
}]);