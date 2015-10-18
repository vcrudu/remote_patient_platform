/**
 * Created by Victor on 18/10/2015.
 */

angular.module('app').factory('availabilityService',['$http', '$localStorage','appSettings',
    function($http, $localStorage, appSettings) {
        return {
            getAvailability: function (dateTime, success, error) {
                var req = {
                    method:'GET',
                    url:appSettings.getServerUrl()+'v1/api/availability/'+$localStorage.user.email,
                    headers:{
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function(res){
                    success(res.result);
                }).error(error);
            },saveAvailability: function (availabilityString, success, error) {

                var req = {
                    method:'GET',
                    url:appSettings.getServerUrl()+'v1/api/availability/'+$localStorage.user.email,
                    headers:{
                        'x-access-token': $localStorage.user.token
                    }
                };

                $http(req).success(function(res){
                    success(res.result);
                }).error(error);
            }
        };
    }]);