/**
 * Created by Victor on 14/07/2015.
 */

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state("patient", {
        url: "/patient",
        views: {
            "headerView": {templateUrl: "patient.header.html"},
            "mainView": {templateUrl: "vitalSigns/content.html"},
            "asideView": {templateUrl: "asideNav.html"}
        }
    });
}]);
