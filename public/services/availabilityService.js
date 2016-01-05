/**
 * Created by Victor on 18/10/2015.
 */

angular.module('app').factory('availabilityService',['$http', '$localStorage','appSettings',
    function($http, $localStorage, appSettings) {
        return {
            getAvailability: function (dateTime, success, error) {
                var req = {
                    method: 'GET',
                    url: appSettings.getServerUrl() + '/v1/api/provider_availability',
                    headers: {
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function (res) {
                    success(res.result);
                }).error(error);
            }, addAvailability: function (availability, success, error) {

                var req = {
                    method: 'POST',
                    url: appSettings.getServerUrl() + '/v1/api/availability',
                    headers: {
                        'x-access-token': $localStorage.user.token
                    },
                    data: availability
                };

                $http(req).success(function (res) {
                    success(res.result);
                }).error(error);
            }, editAvailability: function (availability, success, error) {

                var req = {
                    method: 'PUT',
                    url: appSettings.getServerUrl() + '/v1/api/availability',
                    headers: {
                        'x-access-token': $localStorage.user.token
                    },
                    data: availability
                };

                $http(req).success(function (res) {
                    success(res.result);
                }).error(error);
            }
        };
    }]);