/**
 * Created by developer1 on 10/7/2016.
 */
var app = angular.module('app');

app.controller('timeController', ['$scope', function ($scope) {

    $scope.settings = {
        theme: 'mobiscroll',
        display: 'bottom',
        headerText: false,
        maxWidth: 190
    };

}]);