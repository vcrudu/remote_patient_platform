/**
 * Created by Victor on 2/10/2016.
 */

angular.module('mobileApp').config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state("patient-devices", {
        url: "/patient/devices",
        templateUrl: "patient/devices/list.html"
    });
}]);